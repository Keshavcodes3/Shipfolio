import { Router } from "express";
import { followsController } from "../controller/follows.controller.js";
import { authenticateRequest, optionalAuthenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { followQuerySchema } from "../schema/follows.schema.js";
import { followRateLimiter } from "../../../middleware/rate-limit.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public routes (optional auth enriches with isFollowing)
// ---------------------------------------------------------------------------

// GET /follows/:username/counts — follower/following counts
router.get("/:username/counts", followsController.getFollowCounts);

// GET /follows/:username/followers — paginated followers list
router.get(
  "/:username/followers",
  optionalAuthenticateRequest,
  validate({ query: followQuerySchema }),
  followsController.listFollowers,
);

// GET /follows/:username/following — paginated following list
router.get(
  "/:username/following",
  optionalAuthenticateRequest,
  validate({ query: followQuerySchema }),
  followsController.listFollowing,
);

// GET /follows/:username/status — check if authenticated user follows target
router.get("/:username/status", authenticateRequest, followsController.getFollowStatus);

// ---------------------------------------------------------------------------
// Protected routes (auth required)
// ---------------------------------------------------------------------------

// POST /follows/:username/follow — follow a user
router.post(
  "/:username/follow",
  authenticateRequest,
  followRateLimiter,
  followsController.follow,
);

// DELETE /follows/:username/follow — unfollow a user
router.delete(
  "/:username/follow",
  authenticateRequest,
  followRateLimiter,
  followsController.unfollow,
);

export default router;
