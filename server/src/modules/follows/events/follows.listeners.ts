import { eventBus } from "../../../shared/events/eventBus.js";
import { FollowEvents } from "./follows.events.js";
import type { UserFollowedPayload, UserUnfollowedPayload } from "./follows.events.js";
import { createLogger } from "../../../shared/logger.js";

const log = createLogger("follow-listeners");

eventBus.on(FollowEvents.USER_FOLLOWED, async (payload: UserFollowedPayload) => {
  log.info({ followerId: payload.followerId, followingId: payload.followingId }, "User followed");

  // Notify the followed user (fire-and-forget — must never break the follow flow)
  try {
    const { prisma } = await import("../../../config/database.js");
    const follower = await prisma.user.findUnique({
      where: { id: payload.followerId },
      select: { username: true, name: true },
    });
    if (!follower) return;

    const { notificationsService } = await import("../../notifications/service/notifications.service.js");
    await notificationsService.notify({
      userId: payload.followingId,
      actorId: payload.followerId,
      type: "FOLLOWED_YOU",
      title: "New follower",
      message: `${follower.username} followed you`,
      link: `/@${follower.username}`,
      dedupe: true,
    });
  } catch (err) {
    log.error({ err, ...payload }, "Failed to create follow notification");
  }
});

eventBus.on(FollowEvents.USER_UNFOLLOWED, (payload: UserUnfollowedPayload) => {
  log.info({ followerId: payload.followerId, followingId: payload.followingId }, "User unfollowed");
});

export const registerFollowListeners = () => {};
