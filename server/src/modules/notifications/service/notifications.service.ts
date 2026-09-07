import type { NotificationType } from "@prisma/client";
import { notificationsRepository } from "../repository/notifications.repository.js";
import { NotFoundError } from "../../../shared/errors/index.js";
import type { PaginatedResponse } from "../../../shared/types/index.js";
import { createLogger } from "../../../shared/logger.js";
import type { NotificationListQuery } from "../schema/notifications.schema.js";

const log = createLogger("notifications-service");

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  projectId: string | null;
  isRead: boolean;
  createdAt: Date;
  actor: { id: string; username: string; name: string | null; avatarUrl: string | null } | null;
};

export type CreateNotificationInput = {
  userId: string;
  actorId?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  projectId?: string | null;
  /** When true, skip creation if an unread notification of the same type from the same actor already exists. */
  dedupe?: boolean;
};

export const notificationsService = {
  /**
   * Create a notification. Never throws for trigger paths — failures are
   * logged so a notification error can never break follows/comments/etc.
   */
  async notify(input: CreateNotificationInput): Promise<NotificationItem | null> {
    // No self-notifications
    if (input.actorId && input.actorId === input.userId) return null;

    try {
      if (input.dedupe && input.actorId) {
        const existing = await notificationsRepository.findExistingUnread(
          input.userId,
          input.actorId,
          input.type,
        );
        if (existing) return null;
      }
      const created = await notificationsRepository.create(input);
      return created as NotificationItem;
    } catch (err) {
      log.error({ err, userId: input.userId, type: input.type }, "Failed to create notification");
      return null;
    }
  },

  /**
   * Paginated inbox for the authenticated user, newest first.
   */
  async list(
    userId: string,
    query: NotificationListQuery,
  ): Promise<PaginatedResponse<NotificationItem>> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;
    const unreadOnly = query.unreadOnly ?? false;

    const [items, total] = await Promise.all([
      notificationsRepository.list(userId, { skip, take: limit, unreadOnly }),
      notificationsRepository.count(userId, unreadOnly),
    ]);

    return {
      data: items as NotificationItem[],
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  /**
   * Unread badge count for the authenticated user.
   */
  async getUnreadCount(userId: string): Promise<{ unread: number }> {
    const unread = await notificationsRepository.countUnread(userId);
    return { unread };
  },

  /**
   * Mark a single notification as read. 404s when the id doesn't exist or
   * belongs to someone else (no ownership oracle).
   */
  async markRead(userId: string, id: string): Promise<NotificationItem> {
    const existing = await notificationsRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError("Notification not found");
    }
    if (!existing.isRead) {
      await notificationsRepository.markRead(id, userId);
    }
    const updated = await notificationsRepository.findById(id);
    return updated as NotificationItem;
  },

  /**
   * Mark every notification as read. Returns the number marked.
   */
  async markAllRead(userId: string): Promise<{ marked: number }> {
    const result = await notificationsRepository.markAllRead(userId);
    return { marked: result.count };
  },

  /**
   * Delete a notification. 404s when the id doesn't exist or belongs to
   * someone else.
   */
  async remove(userId: string, id: string): Promise<void> {
    const existing = await notificationsRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError("Notification not found");
    }
    await notificationsRepository.delete(id, userId);
  },
};

export default notificationsService;
