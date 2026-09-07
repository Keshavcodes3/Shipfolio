import crypto from "node:crypto";
import { env } from "../../../config/env.js";
import { BadRequestError } from "../../../shared/errors/index.js";
import type { OAuthState } from "../types/github.types.js";

const STATE_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function hmacSign(payload: string): string {
  return crypto
    .createHmac("sha256", env.GITHUB_STATE_SECRET)
    .update(payload)
    .digest("hex");
}

/**
 * Generates a signed, time-limited OAuth state parameter.
 *
 * Format: `<base64(state)>.<hex-signature>`
 *
 * The state contains a random nonce, the current timestamp, and an optional
 * redirect path. The HMAC signature prevents tampering.
 */
export function generateOAuthState(redirect?: string, mode?: 'login' | 'link'): string {
  const state: OAuthState = {
    nonce: crypto.randomBytes(16).toString("hex"),
    timestamp: Date.now(),
    redirect,
    mode: mode || 'login',
  };

  const stateB64 = Buffer.from(JSON.stringify(state)).toString("base64url");
  const signature = hmacSign(stateB64);

  return `${stateB64}.${signature}`;
}

/**
 * Validates the OAuth state parameter received in the callback.
 *
 * 1. Verifies the HMAC signature.
 * 2. Checks that the state has not expired.
 *
 * @returns The parsed {@link OAuthState} when valid.
 * @throws {BadRequestError} when the state is malformed, expired, or
 *   tampered with.
 */
export function validateOAuthState(raw: string): OAuthState {
  if (!raw || typeof raw !== "string") {
    throw new BadRequestError("Missing or invalid OAuth state parameter");
  }

  const dotIdx = raw.lastIndexOf(".");
  if (dotIdx === -1) {
    throw new BadRequestError("Malformed OAuth state parameter");
  }

  const stateB64 = raw.slice(0, dotIdx);
  const signature = raw.slice(dotIdx + 1);

  const expectedSig = hmacSign(stateB64);
  if (!crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSig, "hex"))) {
    throw new BadRequestError("Invalid OAuth state signature");
  }

  let state: OAuthState;
  try {
    state = JSON.parse(Buffer.from(stateB64, "base64url").toString("utf8"));
  } catch {
    throw new BadRequestError("Malformed OAuth state payload");
  }

  if (typeof state.nonce !== "string" || typeof state.timestamp !== "number") {
    throw new BadRequestError("Malformed OAuth state payload");
  }

  if (Date.now() - state.timestamp > STATE_EXPIRY_MS) {
    throw new BadRequestError("OAuth state has expired – please try again");
  }

  return state;
}
