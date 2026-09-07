// ---------------------------------------------------------------------------
// Project domain events
// ---------------------------------------------------------------------------

export const ProjectEvents = {
  CREATED: "project.created",
  UPDATED: "project.updated",
  DELETED: "project.deleted",
  GITHUB_CONNECTED: "project.github.connected",
  GITHUB_DISCONNECTED: "project.github.disconnected",
} as const;

// ---------------------------------------------------------------------------
// Payload types
// ---------------------------------------------------------------------------

export type ProjectCreatedPayload = {
  projectId: string;
  userId: string;
  slug: string;
};

export type ProjectUpdatedPayload = {
  projectId: string;
  userId: string;
};

export type ProjectDeletedPayload = {
  projectId: string;
  userId: string;
};

export type ProjectGithubConnectedPayload = {
  projectId: string;
  userId: string;
  repoId: string;
  githubRepoId: string;
};

export type ProjectGithubDisconnectedPayload = {
  projectId: string;
  userId: string;
};
