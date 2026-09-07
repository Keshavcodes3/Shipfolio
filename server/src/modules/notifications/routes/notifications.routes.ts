import { Router } from "express";
import { notificationsController } from "../controller/notifications.controller.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import {
  notificationListQuerySchema,
  notificationIdParamSchema,
} from "../schema/notifications.schema.js";
import { followRateLimiter } from "../../../middleware/rate-limit.middleware.js";

const router = Router();

// All notification routes require authentication
router.use(authenticateRequest);

// GET /notifications — paginated inbox
router.get(
  "/",
  validate({ query: notificationListQuerySchema }),
  notificationsController.list,
);

// GET /notifications/unread-count — badge count
router.get("/unread-count", notificationsController.getUnreadCount);

// POST /notifications/read-all — mark everything as read
router.post("/read-all", followRateLimiter, notificationsController.markAllRead);

// PATCH /notifications/:id/read — mark one as read
router.patch(
  "/:id/read",
  followRateLimiter,
  validate({ params: notificationIdParamSchema }),
  notificationsController.markRead,
);

// DELETE /notifications/:id — delete one
router.delete(
  "/:id",
  validate({ params: notificationIdParamSchema }),
  notificationsController.remove,
);

export default router;
