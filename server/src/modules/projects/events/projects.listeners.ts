import { eventBus } from "../../../shared/events/eventBus.js";
import { ProjectEvents } from "./projects.events.js";
import type {
  ProjectCreatedPayload,
  ProjectUpdatedPayload,
  ProjectDeletedPayload,
  ProjectGithubConnectedPayload,
  ProjectGithubDisconnectedPayload,
} from "./projects.events.js";
import { enqueueActivity } from "../../../infrastructure/queue/queues/activity.queue.js";
import { enqueueGithubRefreshMetadata } from "../../../infrastructure/queue/queues/github.queue.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("project-listeners");

// ---------------------------------------------------------------------------
// Project lifecycle
// ---------------------------------------------------------------------------

eventBus.on(ProjectEvents.CREATED, async (payload: ProjectCreatedPayload) => {
  log.info({ projectId: payload.projectId, userId: payload.userId }, "Project created");
  await enqueueActivity({
    userId: payload.userId,
    type: "PROJECT_CREATED",
    projectId: payload.projectId,
    metadata: { slug: payload.slug },
  }).catch((err) => {
    log.error({ projectId: payload.projectId, err }, "Failed to enqueue PROJECT_CREATED activity");
  });
});

eventBus.on(ProjectEvents.UPDATED, (payload: ProjectUpdatedPayload) => {
  log.debug({ projectId: payload.projectId }, "Project updated");
});

eventBus.on(ProjectEvents.DELETED, (payload: ProjectDeletedPayload) => {
  log.info({ projectId: payload.projectId }, "Project deleted");
});

// ---------------------------------------------------------------------------
// GitHub connection events → enqueue metadata refresh
// ---------------------------------------------------------------------------

eventBus.on(ProjectEvents.GITHUB_CONNECTED, async (payload: ProjectGithubConnectedPayload) => {
  log.info({ projectId: payload.projectId, repoId: payload.repoId }, "GitHub connected to project");
  await enqueueGithubRefreshMetadata({ userId: payload.userId, repoId: payload.repoId }).catch((err) => {
    log.error({ projectId: payload.projectId, err }, "Failed to enqueue metadata refresh after GitHub connect");
  });
});

eventBus.on(ProjectEvents.GITHUB_DISCONNECTED, (payload: ProjectGithubDisconnectedPayload) => {
  log.info({ projectId: payload.projectId }, "GitHub disconnected from project");
});

// ---------------------------------------------------------------------------
// Registration helper
// ---------------------------------------------------------------------------

export const registerProjectListeners = () => {};
