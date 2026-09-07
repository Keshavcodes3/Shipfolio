import { describe, it, expect } from "vitest";
import crypto from "node:crypto";
import { verifyWebhookSignature } from "../../../src/modules/github/utils/webhook-signature.js";

const SECRET = "test-webhook-secret";

function computeSignature(payload: Buffer, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `sha256=${hmac}`;
}

describe("verifyWebhookSignature", () => {
  const payload = Buffer.from(JSON.stringify({ hello: "world" }));

  it("returns true for a valid signature", () => {
    const sig = computeSignature(payload, SECRET);

    expect(verifyWebhookSignature(payload, sig, SECRET)).toBe(true);
  });

  it("returns false for an invalid signature", () => {
    const sig = "sha256=" + "a".repeat(64);

    expect(verifyWebhookSignature(payload, sig, SECRET)).toBe(false);
  });

  it("returns false for a malformed signature without sha256 prefix", () => {
    expect(verifyWebhookSignature(payload, "not-a-signature", SECRET)).toBe(false);
  });

  it("returns false when payload is missing", () => {
    const sig = computeSignature(payload, SECRET);

    expect(verifyWebhookSignature(null as any, sig, SECRET)).toBe(false);
  });

  it("returns false when signature is empty", () => {
    expect(verifyWebhookSignature(payload, "", SECRET)).toBe(false);
  });

  it("returns false when secret is empty", () => {
    const sig = computeSignature(payload, SECRET);

    expect(verifyWebhookSignature(payload, sig, "")).toBe(false);
  });

  it("returns false when signature has sha256= prefix but empty hex", () => {
    expect(verifyWebhookSignature(payload, "sha256=", SECRET)).toBe(false);
  });

  it("returns false when signature hex has wrong length", () => {
    const sig = "sha256=" + "a".repeat(32);

    expect(verifyWebhookSignature(payload, sig, SECRET)).toBe(false);
  });

  it("returns false on error", () => {
    expect(verifyWebhookSignature(null as any, null as any, null as any)).toBe(false);
  });
});
