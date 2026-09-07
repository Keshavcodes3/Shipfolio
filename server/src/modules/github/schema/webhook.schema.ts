import { z } from "zod";

/**
 * Validates the essential fields extracted from GitHub webhook headers.
 * Full payload validation is intentionally omitted because GitHub payloads
 * vary significantly between event types and versions.
 */
export const webhookDeliverySchema = z.object({
  deliveryId: z.string().min(1),
  event: z.string().min(1),
  signature: z.string().min(1),
});

export type WebhookDeliverySchema = z.infer<typeof webhookDeliverySchema>;
