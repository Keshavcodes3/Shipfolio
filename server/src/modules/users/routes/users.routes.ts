import { Router } from "express";
import { usersController } from "../controller/users.controller.js";
import { profilesController } from "../../profiles/controller/profiles.controller.js";
import { authenticateRequest, optionalAuthenticateRequest } from "../../../middleware/auth.middleware.js";
import { requireSelf } from "../../../middleware/authorization.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { updateUserSchema, usersQuerySchema } from "../schema/users.schema.js";

const router = Router();

// GET /users — list users (paginated)
router.get("/", validate({ query: usersQuerySchema }), usersController.list);

// GET /users/:username — public profile (optional auth for isFollowing enrichment)
// This is the primary public profile endpoint per the API spec.
router.get("/:username", optionalAuthenticateRequest, profilesController.getByUsername);

// GET /users/account/:id — get own account by ID (requires auth + self)
router.get("/account/:id", authenticateRequest, requireSelf, usersController.getById);

// PATCH /users/account/:id — update own account (requires auth + self)
router.patch("/account/:id", authenticateRequest, requireSelf, validate({ body: updateUserSchema }), usersController.update);

// DELETE /users/account/:id — delete own account (requires auth + self)
router.delete("/account/:id", authenticateRequest, requireSelf, usersController.remove);

export default router;
