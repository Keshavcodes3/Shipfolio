import { Router } from "express";
import { educationController } from "../controller/education.controller.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import {
  createEducationSchema,
  updateEducationSchema,
  reorderEducationSchema,
} from "../schema/education.schema.js";

const router = Router();

router.get("/", authenticateRequest, educationController.list);
router.get("/:id", educationController.getById);
router.post(
  "/",
  authenticateRequest,
  validate({ body: createEducationSchema }),
  educationController.create
);
router.patch(
  "/:id",
  authenticateRequest,
  validate({ body: updateEducationSchema }),
  educationController.update
);
router.delete("/:id", authenticateRequest, educationController.remove);
router.post(
  "/reorder",
  authenticateRequest,
  validate({ body: reorderEducationSchema }),
  educationController.reorder
);

export default router;
