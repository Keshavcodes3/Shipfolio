import { z } from "zod";

export const notificationListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  unreadOnly: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true"),
});

export const notificationIdParamSchema = z.object({
  id: z.string().min(1),
});

export type NotificationListQuery = z.infer<typeof notificationListQuerySchema>;
