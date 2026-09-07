import crypto from "node:crypto";
import { env } from "../../../config/env.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const raw = env.TOKEN_ENCRYPTION_KEY;
  // Derive a 32-byte key from whatever the user provides
  return crypto.scryptSync(raw, "shipfolio-github-tokens", 32);
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 *
 * Returns a prefixed string: `enc:<base64(iv)>:<base64(authTag)>:<base64(ciphertext)>`
 *
 * The prefix allows callers to distinguish encrypted tokens from plain-text
 * tokens and skip decryption when the value is already clear-text (e.g. a
 * token returned directly from an OAuth exchange that has not yet been
 * persisted).
 */
export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv) as crypto.CipherGCM;

  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `enc:${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

/**
 * Decrypts a value produced by {@link encryptToken}.
 *
 * If the value does not start with `enc:` it is returned as-is, which
 * gracefully handles plain-text tokens that were stored before encryption
 * was enabled.
 */
export function decryptToken(value: string): string {
  if (!value || !value.startsWith("enc:")) return value;

  const key = getKey();
  const parts = value.slice(4).split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token format");
  }

  const [ivB64, authTagB64, dataB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const encrypted = Buffer.from(dataB64, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv) as crypto.DecipherGCM;
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

/**
 * Returns `true` when the value was produced by {@link encryptToken}.
 */
export function isEncryptedToken(value: string): boolean {
  return typeof value === "string" && value.startsWith("enc:");
}
