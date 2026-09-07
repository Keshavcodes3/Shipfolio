import { Router } from "express";
import { technologiesController } from "../controller/technologies.controller.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import {
  createTechnologySchema,
  updateTechnologySchema,
  technologiesQuerySchema,
  technologySearchSchema,
  attachUserTechnologySchema,
  attachProjectTechnologySchema,
} from "../schema/technologies.schema.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public routes — no auth required
// ---------------------------------------------------------------------------

// GET /technologies — list technologies with pagination & filters
router.get("/", validate({ query: technologiesQuerySchema }), technologiesController.list);

// GET /technologies/search — search technologies
router.get("/search", validate({ query: technologySearchSchema }), technologiesController.search);

// GET /technologies/user/:userId — get technologies for a user
router.get("/user/:userId", technologiesController.getUserTechnologies);

// GET /technologies/project/:projectId — get technologies for a project
router.get("/project/:projectId", technologiesController.getProjectTechnologies);

// GET /technologies/:id — get a technology by ID
router.get("/:id", technologiesController.getById);

// ---------------------------------------------------------------------------
// Write routes — auth required
// ---------------------------------------------------------------------------

// POST /technologies — create a new technology
router.post(
  "/",
  authenticateRequest,
  validate({ body: createTechnologySchema }),
  technologiesController.create,
);

// PATCH /technologies/:id — update a technology
router.patch(
  "/:id",
  authenticateRequest,
  validate({ body: updateTechnologySchema }),
  technologiesController.update,
);

// DELETE /technologies/:id — delete a technology
router.delete("/:id", authenticateRequest, technologiesController.remove);

// ---------------------------------------------------------------------------
// User–Technology write routes — auth required
// ---------------------------------------------------------------------------

// POST /technologies/user/attach — attach technology to authenticated user
router.post(
  "/user/attach",
  authenticateRequest,
  validate({ body: attachUserTechnologySchema }),
  technologiesController.attachToUser,
);

// PATCH /technologies/user/:technologyId/primary — set primary for user
router.patch(
  "/user/:technologyId/primary",
  authenticateRequest,
  technologiesController.setPrimaryUserTechnology,
);

// DELETE /technologies/user/:technologyId — remove from user
router.delete(
  "/user/:technologyId",
  authenticateRequest,
  technologiesController.detachFromUser,
);

// ---------------------------------------------------------------------------
// Project–Technology write routes — auth required (ownership checked in service)
// ---------------------------------------------------------------------------

// POST /technologies/project/:projectId/attach — attach to project
router.post(
  "/project/:projectId/attach",
  authenticateRequest,
  validate({ body: attachProjectTechnologySchema }),
  technologiesController.attachToProject,
);

// PATCH /technologies/project/:projectId/:technologyId/primary — set primary for project
router.patch(
  "/project/:projectId/:technologyId/primary",
  authenticateRequest,
  technologiesController.setPrimaryProjectTechnology,
);

// DELETE /technologies/project/:projectId/:technologyId — remove from project
router.delete(
  "/project/:projectId/:technologyId",
  authenticateRequest,
  technologiesController.detachFromProject,
);

export default router;
