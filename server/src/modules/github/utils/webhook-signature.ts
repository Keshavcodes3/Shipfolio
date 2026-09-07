import crypto from "node:crypto";

/**
 * Verify a GitHub webhook signature using HMAC-SHA256.
 *
 * GitHub sends the signature as "sha256=<hex>" in the X-Hub-Signature-256 header.
 * We compute our own HMAC over the raw payload and compare using timing-safe comparison
 * to prevent timing attacks.
 *
 * @returns `true` if the signature is valid, `false` otherwise (including any error).
 */
export function verifyWebhookSignature(
  payload: Buffer,
  signature: string,
  secret: string,
): boolean {
  try {
    if (!payload || !signature || !secret) {
      return false;
    }

    // GitHub prefixes the signature with "sha256="
    const expectedPrefix = "sha256=";
    if (!signature.startsWith(expectedPrefix)) {
      return false;
    }

    const incomingHex = signature.slice(expectedPrefix.length);
    if (incomingHex.length === 0) {
      return false;
    }

    const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

    // Both strings must be the same length for timingSafeEqual
    const incomingBuf = Buffer.from(incomingHex, "utf-8");
    const expectedBuf = Buffer.from(hmac, "utf-8");

    if (incomingBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(incomingBuf, expectedBuf);
  } catch {
    return false;
  }
}
