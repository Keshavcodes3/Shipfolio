// ---------------------------------------------------------------------------
// GitHub Webhook – Type Definitions
// ---------------------------------------------------------------------------

/** Supported GitHub webhook event types. */
export type WebhookEventType =
  | "push"
  | "pull_request"
  | "release"
  | "issues"
  | "star"
  | "fork";

/** Metadata about a processed webhook delivery. */
export type WebhookDelivery = {
  id: string;
  event: WebhookEventType;
  deliveryId: string;
  processedAt: Date;
};

// ---------------------------------------------------------------------------
// Payload Types
// ---------------------------------------------------------------------------

export type WebhookPushPayload = {
  ref: string;
  after: string;
  repository: {
    id: number;
    full_name: string;
  };
  commits: Array<{
    id: string;
    message: string;
    author: {
      name: string;
      email: string;
    };
    url: string;
    timestamp: string;
  }>;
};

export type WebhookPullRequestPayload = {
  action: string;
  pull_request: {
    number: number;
    title: string;
    html_url: string;
    user: {
      login: string;
    };
    created_at: string;
  };
};

export type WebhookReleasePayload = {
  action: string;
  release: {
    tag_name: string;
    name: string;
    html_url: string;
    body: string;
    created_at: string;
  };
};

export type WebhookIssuesPayload = {
  action: string;
  issue: {
    number: number;
    title: string;
    html_url: string;
    user: {
      login: string;
    };
    created_at: string;
  };
};

export type WebhookStarPayload = {
  action: string;
  star: {
    starred_at: string;
  } | null;
  sender: {
    login: string;
  };
};

export type WebhookForkPayload = {
  forkee: {
    full_name: string;
    html_url: string;
  };
};

/** Union of all supported webhook payloads. */
export type WebhookPayload =
  | WebhookPushPayload
  | WebhookPullRequestPayload
  | WebhookReleasePayload
  | WebhookIssuesPayload
  | WebhookStarPayload
  | WebhookForkPayload;
