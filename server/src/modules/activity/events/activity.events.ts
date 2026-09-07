// ---------------------------------------------------------------------------
// Activity domain events
// ---------------------------------------------------------------------------

export const ActivityEvents = {
  CREATED: "activity.created",
  UPDATED: "activity.updated",
  DELETED: "activity.deleted",
} as const;

export type ActivityCreatedPayload = {
  activityId: string;
  projectId?: string;
  type: string;
};

export type ActivityUpdatedPayload = {
  activityId: string;
  projectId?: string;
};

export type ActivityDeletedPayload = {
  activityId: string;
  projectId?: string;
};
