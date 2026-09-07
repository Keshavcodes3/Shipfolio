import { prisma } from "../../../config/database.js";
import type { NotificationType } from "@prisma/client";

// ---------------------------------------------------------------------------
// Selects — avoid over-fetching; always include the actor for display
// ---------------------------------------------------------------------------

const ACTOR_SELECT = {
  id: true,
  username: true,
  name: true,
  avatarUrl: true,
} as const;

const NOTIFICATION_INCLUDE = {
  actor: { select: ACTOR_SELECT },
} as const;

export type CreateNotificationInput = {
  userId: string;
  actorId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  projectId?: string | null;
};

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const notificationsRepository = {
  /**
   * Create a notification for a user.
   */
  create: (input: CreateNotificationInput) =>
    prisma.notification.create({
      data: {
        userId: input.userId,
        actorId: input.actorId ?? null,
        type: input.type,
        title: input.title,
        message: input.message,
        link: input.link ?? null,
        projectId: input.projectId ?? null,
      },
      include: NOTIFICATION_INCLUDE,
    }),

  /**
   * Check for an existing UNREAD notification of the same type from the same
   * actor (used to dedupe repeat triggers, e.g. follow → unfollow → follow).
   */
  findExistingUnread: (userId: string, actorId: string, type: NotificationType) =>
    prisma.notification.findFirst({
      where: { userId, actorId, type, isRead: false },
      select: { id: true },
    }),

  /**
   * Paginated list for a recipient, newest first.
   */
  list: (userId: string, args: { skip: number; take: number; unreadOnly?: boolean }) =>
    prisma.notification.findMany({
      where: { userId, ...(args.unreadOnly ? { isRead: false } : {}) },
      orderBy: { createdAt: "desc" },
      skip: args.skip,
      take: args.take,
      include: NOTIFICATION_INCLUDE,
    }),

  count: (userId: string, unreadOnly?: boolean) =>
    prisma.notification.count({
      where: { userId, ...(unreadOnly ? { isRead: false } : {}) },
    }),

  countUnread: (userId: string) =>
    prisma.notification.count({ where: { userId, isRead: false } }),

  findById: (id: string) =>
    prisma.notification.findUnique({
      where: { id },
      include: NOTIFICATION_INCLUDE,
    }),

  /**
   * Mark a single notification as read. Scoped to the owner — returns the
   * count of updated rows (0 when the id doesn't belong to the user).
   */
  markRead: (id: string, userId: string) =>
    prisma.notification.updateMany({
      where: { id, userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    }),

  /**
   * Mark all of a user's notifications as read. Returns the count.
   */
  markAllRead: (userId: string) =>
    prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    }),

  /**
   * Delete a notification. Scoped to the owner — returns the count.
   */
  delete: (id: string, userId: string) =>
    prisma.notification.deleteMany({ where: { id, userId } }),

  /**
   * Delete all notifications for a user (used during account deletion).
   */
  deleteByUser: (userId: string) =>
    prisma.notification.deleteMany({ where: { userId } }),
};

export default notificationsRepository;
