import { Router } from "express";
import { experienceController } from "../controller/experience.controller.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import {
  createExperienceSchema,
  updateExperienceSchema,
  reorderExperienceSchema,
} from "../schema/experience.schema.js";

const router = Router();

router.get("/", authenticateRequest, experienceController.list);
router.get("/:id", experienceController.getById);
router.post(
  "/",
  authenticateRequest,
  validate({ body: createExperienceSchema }),
  experienceController.create
);
router.patch(
  "/:id",
  authenticateRequest,
  validate({ body: updateExperienceSchema }),
  experienceController.update
);
router.delete("/:id", authenticateRequest, experienceController.remove);
router.post(
  "/reorder",
  authenticateRequest,
  validate({ body: reorderExperienceSchema }),
  experienceController.reorder
);

export default router;
