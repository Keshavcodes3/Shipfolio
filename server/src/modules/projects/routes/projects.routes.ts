import { Router } from "express";
import { projectsController } from "../controller/projects.controller.js";
import { projectNeedsController } from "../controller/projectNeeds.controller.js";
import { authenticateRequest, optionalAuthenticateRequest } from "../../../middleware/auth.middleware.js";
import { requireProjectOwnership } from "../../../middleware/authorization.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { createProjectSchema, updateProjectSchema, projectsQuerySchema } from "../schema/projects.schema.js";
import { createProjectNeedSchema, updateProjectNeedSchema, expressInterestSchema, discoverNeedsQuerySchema } from "../schema/projectNeed.schema.js";
import { githubController } from "../../github/controller/github.controller.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public routes — no auth required (but optional auth enriches responses)
// ---------------------------------------------------------------------------

// GET /projects — list public projects with pagination & filters
router.get("/", validate({ query: projectsQuerySchema }), projectsController.list);

// GET /projects/featured — global featured projects (must be before /:id)
router.get("/featured", projectsController.listGlobalFeatured);

// GET /projects/featured/:userId — featured public projects for a user
router.get("/featured/:userId", projectsController.listFeatured);

// GET /projects/building/:userId — currently-building project for a user
router.get("/building/:userId", projectsController.getCurrentlyBuilding);

// GET /discover/builders — top builders (must be before /:id)
router.get("/builders", projectsController.getTopBuilders);

// GET /discover/needs — public needs feed (must be before /:id)
router.get("/discover/needs", validate({ query: discoverNeedsQuerySchema }), projectNeedsController.discoverNeeds);

// GET /projects/mine — authenticated user's own projects (auth required)
router.get("/mine", authenticateRequest, validate({ query: projectsQuerySchema }), projectsController.listMine);

// GET /projects/:id — single project (optional auth for private project access)
router.get("/:id", optionalAuthenticateRequest, projectsController.getById);

// ---------------------------------------------------------------------------
// Project needs routes — auth required
// ---------------------------------------------------------------------------

// GET /projects/:id/needs — list needs for a project
router.get("/:id/needs", projectNeedsController.list);

// POST /projects/:id/needs — create a need
router.post("/:id/needs", authenticateRequest, validate({ body: createProjectNeedSchema }), projectNeedsController.create);

// GET /projects/:id/needs/:needId — get a single need with interests
router.get("/:id/needs/:needId", projectNeedsController.getById);

// PATCH /projects/:id/needs/:needId — update a need (owner only)
router.patch("/:id/needs/:needId", authenticateRequest, validate({ body: updateProjectNeedSchema }), projectNeedsController.update);

// DELETE /projects/:id/needs/:needId — delete a need (owner only)
router.delete("/:id/needs/:needId", authenticateRequest, projectNeedsController.remove);

// POST /projects/:id/needs/:needId/interest — express interest ("I CAN HELP")
router.post("/:id/needs/:needId/interest", authenticateRequest, validate({ body: expressInterestSchema }), projectNeedsController.expressInterest);

// DELETE /projects/:id/needs/:needId/interest — withdraw interest
router.delete("/:id/needs/:needId/interest", authenticateRequest, projectNeedsController.withdrawInterest);

// ---------------------------------------------------------------------------
// Write routes — auth required
// ---------------------------------------------------------------------------

// POST /projects — create project
router.post("/", authenticateRequest, validate({ body: createProjectSchema }), projectsController.create);

// PATCH /projects/:id — update project (owner only)
router.patch("/:id", authenticateRequest, requireProjectOwnership, validate({ body: updateProjectSchema }), projectsController.update);

// DELETE /projects/:id — delete project (owner only)
router.delete("/:id", authenticateRequest, requireProjectOwnership, projectsController.remove);

// DELETE /projects/:id/github — disconnect GitHub repository (owner only)
router.delete("/:id/github", authenticateRequest, requireProjectOwnership, githubController.disconnectRepository);

export default router;
