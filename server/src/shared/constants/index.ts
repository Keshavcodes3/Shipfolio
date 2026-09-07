export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const QUEUE_NAMES = {
  GITHUB: "github-queue",
  ACTIVITY: "activity-queue",
  REPO_METADATA: "repo-metadata-queue",
} as const;

export const EVENTS = {
  AUTH_REGISTERED: "auth.registered",
  AUTH_LOGGED_IN: "auth.logged_in",
  USER_CREATED: "user.created",
  PROJECT_CREATED: "project.created",
  GITHUB_SYNC_REQUESTED: "github.sync_requested",
  ACTIVITY_CREATED: "activity.created",
  FOLLOW_CREATED: "follow.created",
  NEED_INTEREST: "need.interest",
} as const;
