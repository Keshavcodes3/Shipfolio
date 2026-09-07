import { Router } from "express";
import { profilesController } from "../controller/profiles.controller.js";
import { authenticateRequest, optionalAuthenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import {
  updateProfileSchema,
  profilesQuerySchema,
  followersQuerySchema,
  followingQuerySchema,
} from "../schema/profiles.schema.js";

const router = Router();

// ---------------------------------------------------------------------------
// Private routes — MUST come before /:username to avoid shadowing
// ---------------------------------------------------------------------------

// GET /profiles/me — own private profile
router.get("/me", authenticateRequest, profilesController.getOwn);

// PATCH /profiles/me — update own profile
router.patch("/me", authenticateRequest, validate({ body: updateProfileSchema }), profilesController.updateOwn);

// ---------------------------------------------------------------------------
// Public routes — no auth required (but optional auth enriches responses)
// ---------------------------------------------------------------------------

// GET /profiles — list users (paginated)
router.get("/", validate({ query: profilesQuerySchema }), profilesController.list);

// GET /profiles/:username/availability — check username availability
router.get("/:username/availability", profilesController.checkUsernameAvailability);

// GET /profiles/:username — public profile (optional auth for isFollowing)
router.get("/:username", optionalAuthenticateRequest, profilesController.getByUsername);

// GET /profiles/:username/followers — paginated followers list
router.get("/:username/followers", validate({ query: followersQuerySchema }), profilesController.getFollowers);

// GET /profiles/:username/following — paginated following list
router.get("/:username/following", validate({ query: followingQuerySchema }), profilesController.getFollowing);

export default router;
