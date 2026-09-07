import type { ActivityType } from "@prisma/client";
import { prisma } from "../../../config/database.js";
import { createLogger } from "../../../shared/logger.js";
import { activityRepository } from "../../activity/repository/activity.repository.js";
import { githubRepository } from "../repository/github.repository.js";
import type {
  WebhookEventType,
  WebhookPushPayload,
  WebhookPullRequestPayload,
  WebhookReleasePayload,
  WebhookIssuesPayload,
  WebhookStarPayload,
  WebhookForkPayload,
} from "../types/webhook.types.js";

const log = createLogger("github-webhook");

// ---------------------------------------------------------------------------
// Event → ActivityType mapping
// ---------------------------------------------------------------------------

const EVENT_ACTIVITY_MAP: Record<WebhookEventType, ActivityType> = {
  push: "COMMIT",
  pull_request: "PULL_REQUEST",
  release: "RELEASE",
  issues: "ISSUE",
  star: "STAR",
  fork: "FORK",
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Find the project connected to a GitHub repository by its numeric GitHub ID.
 * Returns null when the repo doesn't exist or has no connected project.
 */
async function findProjectByGithubRepoId(
  githubRepoId: number,
): Promise<{ projectId: string; githubRepoId: string } | null> {
  const repo = await githubRepository.findRepositoryByGithubRepoId(
    String(githubRepoId),
  );
  if (!repo) return null;

  // Find the project that references this GithubRepository record by its internal ID.
  const project = await prisma.project.findFirst({
    where: { githubRepoId: repo.id },
    select: { id: true },
  });
  if (!project) return null;

  return { projectId: project.id, githubRepoId: repo.id };
}

/**
 * Idempotently create an activity using upsert on the (type, externalId)
 * unique constraint. Returns the activity whether it was newly created or
 * already existed.
 */
async function upsertActivity(data: {
  type: ActivityType;
  externalId: string;
  projectId: string;
  githubRepoId: string;
  title?: string;
  description?: string;
  url?: string;
  actorUsername?: string;
  actorAvatarUrl?: string;
  occurredAt: Date;
}) {
  return activityRepository.findOrCreateByExternalId(data.type, data.externalId, {
    project: { connect: { id: data.projectId } },
    githubRepo: { connect: { id: data.githubRepoId } },
    title: data.title,
    description: data.description,
    url: data.url,
    actorUsername: data.actorUsername,
    actorAvatarUrl: data.actorAvatarUrl,
    occurredAt: data.occurredAt,
  });
}

// ---------------------------------------------------------------------------
// Webhook Service
// ---------------------------------------------------------------------------

export const webhookService = {
  /**
   * Process an incoming GitHub webhook.
   *
   * Each handler uses idempotent upserts — duplicate deliveries are safe.
   * No events are emitted from webhook handlers; activities are persisted
   * directly to avoid double-creation via the event queue.
   */
  async processWebhook(
    event: string,
    deliveryId: string,
    payload: any,
  ): Promise<{ processed: boolean; reason?: string }> {
    const webhookEvent = event as WebhookEventType;

    log.info(
      { event: webhookEvent, deliveryId },
      "Processing webhook",
    );

    // -- Route to event-specific handler ------------------------------------
    try {
      switch (webhookEvent) {
        case "push":
          return await this.handlePush(deliveryId, payload);
        case "pull_request":
          return await this.handlePullRequest(deliveryId, payload);
        case "release":
          return await this.handleRelease(deliveryId, payload);
        case "issues":
          return await this.handleIssues(deliveryId, payload);
        case "star":
          return await this.handleStar(deliveryId, payload);
        case "fork":
          return await this.handleFork(deliveryId, payload);
        default:
          log.debug({ event: webhookEvent }, "Unsupported webhook event — ignoring");
          return { processed: false, reason: "unsupported_event" };
      }
    } catch (err) {
      log.error({ event: webhookEvent, deliveryId, err }, "Failed to process webhook");
      return { processed: false, reason: "processing_error" };
    }
  },

  // -- Push -----------------------------------------------------------------

  async handlePush(
    deliveryId: string,
    payload: WebhookPushPayload,
  ): Promise<{ processed: boolean; reason?: string }> {
    const repoId = payload.repository?.id;
    if (!repoId) return { processed: false, reason: "missing_repository" };

    const connection = await findProjectByGithubRepoId(repoId);
    if (!connection) {
      log.debug({ repoId }, "No connected project for repository — skipping push");
      return { processed: false, reason: "no_connected_project" };
    }

    const commits = payload.commits ?? [];
    if (commits.length === 0) {
      return { processed: false, reason: "no_commits" };
    }

    for (const commit of commits) {
      const externalId = `${deliveryId}-${commit.id}`;

      await upsertActivity({
        type: "COMMIT",
        externalId,
        projectId: connection.projectId,
        githubRepoId: connection.githubRepoId,
        title: commit.message.split("\n")[0],
        description: commit.message,
        url: commit.url,
        // Prefer GitHub username over Git author name
        actorUsername: (commit as any).author?.username ?? commit.author?.name,
        occurredAt: new Date(commit.timestamp),
      });
    }

    return { processed: true };
  },

  // -- Pull Request ---------------------------------------------------------

  async handlePullRequest(
    deliveryId: string,
    payload: WebhookPullRequestPayload,
  ): Promise<{ processed: boolean; reason?: string }> {
    const repoId = (payload as any).repository?.id;
    if (!repoId) return { processed: false, reason: "missing_repository" };

    const connection = await findProjectByGithubRepoId(repoId);
    if (!connection) {
      log.debug({ repoId }, "No connected project — skipping pull_request");
      return { processed: false, reason: "no_connected_project" };
    }

    const pr = payload.pull_request;
    const title = `${payload.action} PR #${pr.number}: ${pr.title}`;

    await upsertActivity({
      type: "PULL_REQUEST",
      externalId: deliveryId,
      projectId: connection.projectId,
      githubRepoId: connection.githubRepoId,
      title,
      url: pr.html_url,
      actorUsername: pr.user?.login,
      occurredAt: new Date(pr.created_at),
    });

    return { processed: true };
  },

  // -- Release --------------------------------------------------------------

  async handleRelease(
    deliveryId: string,
    payload: WebhookReleasePayload,
  ): Promise<{ processed: boolean; reason?: string }> {
    const repoId = (payload as any).repository?.id;
    if (!repoId) return { processed: false, reason: "missing_repository" };

    const connection = await findProjectByGithubRepoId(repoId);
    if (!connection) {
      log.debug({ repoId }, "No connected project — skipping release");
      return { processed: false, reason: "no_connected_project" };
    }

    const release = payload.release;
    const title = `${payload.action} release ${release.tag_name}: ${release.name}`;

    await upsertActivity({
      type: "RELEASE",
      externalId: deliveryId,
      projectId: connection.projectId,
      githubRepoId: connection.githubRepoId,
      title,
      description: release.body,
      url: release.html_url,
      occurredAt: new Date(release.created_at),
    });

    return { processed: true };
  },

  // -- Issues ---------------------------------------------------------------

  async handleIssues(
    deliveryId: string,
    payload: WebhookIssuesPayload,
  ): Promise<{ processed: boolean; reason?: string }> {
    const repoId = (payload as any).repository?.id;
    if (!repoId) return { processed: false, reason: "missing_repository" };

    const connection = await findProjectByGithubRepoId(repoId);
    if (!connection) {
      log.debug({ repoId }, "No connected project — skipping issues");
      return { processed: false, reason: "no_connected_project" };
    }

    const issue = payload.issue;
    const title = `${payload.action} issue #${issue.number}: ${issue.title}`;

    await upsertActivity({
      type: "ISSUE",
      externalId: deliveryId,
      projectId: connection.projectId,
      githubRepoId: connection.githubRepoId,
      title,
      url: issue.html_url,
      actorUsername: issue.user?.login,
      occurredAt: new Date(issue.created_at),
    });

    return { processed: true };
  },

  // -- Star -----------------------------------------------------------------
  // Only process "created" actions — ignore "deleted" (unstar).

  async handleStar(
    deliveryId: string,
    payload: WebhookStarPayload,
  ): Promise<{ processed: boolean; reason?: string }> {
    if (payload.action !== "created") {
      log.debug({ action: payload.action }, "Ignoring non-created star event");
      return { processed: false, reason: "ignored_action" };
    }

    const repoId = (payload as any).repository?.id;
    if (!repoId) return { processed: false, reason: "missing_repository" };

    const connection = await findProjectByGithubRepoId(repoId);
    if (!connection) {
      log.debug({ repoId }, "No connected project — skipping star");
      return { processed: false, reason: "no_connected_project" };
    }

    const starredAt = payload.star?.starred_at ?? new Date().toISOString();
    const title = `Star by ${payload.sender?.login ?? "unknown"}`;

    await upsertActivity({
      type: "STAR",
      externalId: deliveryId,
      projectId: connection.projectId,
      githubRepoId: connection.githubRepoId,
      title,
      actorUsername: payload.sender?.login,
      occurredAt: new Date(starredAt),
    });

    return { processed: true };
  },

  // -- Fork -----------------------------------------------------------------

  async handleFork(
    deliveryId: string,
    payload: WebhookForkPayload,
  ): Promise<{ processed: boolean; reason?: string }> {
    const repoId = (payload as any).repository?.id;
    if (!repoId) return { processed: false, reason: "missing_repository" };

    const connection = await findProjectByGithubRepoId(repoId);
    if (!connection) {
      log.debug({ repoId }, "No connected project — skipping fork");
      return { processed: false, reason: "no_connected_project" };
    }

    const forkee = payload.forkee;
    const title = `Fork created: ${forkee.full_name}`;

    await upsertActivity({
      type: "FORK",
      externalId: deliveryId,
      projectId: connection.projectId,
      githubRepoId: connection.githubRepoId,
      title,
      url: forkee.html_url,
      occurredAt: new Date(),
    });

    return { processed: true };
  },
};

export default webhookService;
