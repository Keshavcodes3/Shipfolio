import { eventBus } from "../../../shared/events/eventBus.js";
import { GithubEvents } from "./github.events.js";
import type {
  GithubAccountLinkedPayload,
  GithubAccountUnlinkedPayload,
  GithubOAuthCompletedPayload,
  GithubReposSyncRequestedPayload,
  GithubReposSyncedPayload,
  GithubRepoSyncRequestedPayload,
  GithubRepoUpdatedPayload,
  GithubRepoMetadataRefreshRequestedPayload,
  GithubTokenRefreshFailedPayload,
  GithubActivityReceivedPayload,
  GithubTokenRefreshedPayload,
} from "./github.events.js";
import {
  enqueueGithubSyncAllRepos,
  enqueueGithubSyncSingleRepo,
  enqueueGithubRefreshMetadata,
} from "../../../infrastructure/queue/queues/github.queue.js";
import { enqueueActivity } from "../../../infrastructure/queue/queues/activity.queue.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("github-listeners");

// ---------------------------------------------------------------------------
// Account lifecycle → trigger repo sync
// ---------------------------------------------------------------------------

eventBus.on(GithubEvents.ACCOUNT_LINKED, async (payload: GithubAccountLinkedPayload) => {
  log.info({ userId: payload.userId, username: payload.username }, "Account linked — requesting repo sync");
  await enqueueGithubSyncAllRepos({ userId: payload.userId, force: true }).catch((err) => {
    log.error({ userId: payload.userId, err }, "Failed to enqueue repo sync after account link");
  });
});

eventBus.on(GithubEvents.ACCOUNT_UNLINKED, (payload: GithubAccountUnlinkedPayload) => {
  log.info({ userId: payload.userId }, "Account unlinked — no sync needed");
});

eventBus.on(GithubEvents.OAUTH_COMPLETED, (payload: GithubOAuthCompletedPayload) => {
  log.info({ userId: payload.userId, isNewUser: payload.isNewUser }, "OAuth completed");
});

// ---------------------------------------------------------------------------
// Sync events → enqueue queue jobs
// ---------------------------------------------------------------------------

eventBus.on(GithubEvents.REPOS_SYNC_REQUESTED, async (payload: GithubReposSyncRequestedPayload) => {
  log.info({ userId: payload.userId, force: payload.force }, "Repo sync requested");
  await enqueueGithubSyncAllRepos({ userId: payload.userId, force: payload.force }).catch((err) => {
    log.error({ userId: payload.userId, err }, "Failed to enqueue repo sync");
  });
});

eventBus.on(GithubEvents.REPOS_SYNCED, (payload: GithubReposSyncedPayload) => {
  log.info({ userId: payload.userId, synced: payload.syncedCount, removed: payload.removedCount }, "Repos synced");
});

eventBus.on(GithubEvents.REPO_SYNC_REQUESTED, async (payload: GithubRepoSyncRequestedPayload) => {
  log.info({ userId: payload.userId, repoId: payload.repoId }, "Single repo sync requested");
  await enqueueGithubSyncSingleRepo({ userId: payload.userId, repoId: payload.repoId }).catch((err) => {
    log.error({ repoId: payload.repoId, err }, "Failed to enqueue single repo sync");
  });
});

eventBus.on(GithubEvents.REPO_UPDATED, (payload: GithubRepoUpdatedPayload) => {
  log.debug({ repoId: payload.repoId }, "Repo updated");
});

eventBus.on(GithubEvents.REPO_METADATA_REFRESH_REQUESTED, async (payload: GithubRepoMetadataRefreshRequestedPayload) => {
  log.info({ repoId: payload.repoId }, "Metadata refresh requested");
  await enqueueGithubRefreshMetadata({ userId: payload.userId, repoId: payload.repoId, fullName: payload.fullName }).catch((err) => {
    log.error({ repoId: payload.repoId, err }, "Failed to enqueue metadata refresh");
  });
});

// ---------------------------------------------------------------------------
// Token lifecycle
// ---------------------------------------------------------------------------

eventBus.on(GithubEvents.TOKEN_REFRESHED, (payload: GithubTokenRefreshedPayload) => {
  log.info({ userId: payload.userId }, "Token refreshed");
});

eventBus.on(GithubEvents.TOKEN_REFRESH_FAILED, (payload: GithubTokenRefreshFailedPayload) => {
  log.warn({ userId: payload.userId, reason: payload.reason }, "Token refresh failed");
});

// ---------------------------------------------------------------------------
// Activity events → enqueue activity creation
// ---------------------------------------------------------------------------

eventBus.on(GithubEvents.ACTIVITY_RECEIVED, async (payload: GithubActivityReceivedPayload) => {
  log.info({ userId: payload.userId, type: payload.type, externalId: payload.externalId }, "Activity received");
  await enqueueActivity({
    userId: payload.userId,
    type: payload.type,
    projectId: payload.projectId,
    githubRepoId: payload.githubRepoId,
    metadata: {
      externalId: payload.externalId,
      title: payload.title,
      description: payload.description,
      url: payload.url,
      actorUsername: payload.actorUsername,
      actorAvatarUrl: payload.actorAvatarUrl,
    },
    occurredAt: payload.occurredAt,
  }).catch((err) => {
    log.error({ userId: payload.userId, err }, "Failed to enqueue activity");
  });
});

// ---------------------------------------------------------------------------
// Registration helper (for explicit init)
// ---------------------------------------------------------------------------

export const registerGithubListeners = () => {
  // Listeners are registered on import. Keep for explicit init if needed.
};
