// ---------------------------------------------------------------------------
// Notification domain events
// ---------------------------------------------------------------------------

export const NotificationEvents = {
  CREATED: "notification.created",
} as const;

export type NotificationCreatedPayload = {
  notificationId: string;
  userId: string;
  type: string;
};
