import { Router } from "express";
import { activityController } from "../controller/activity.controller.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { createActivitySchema, updateActivitySchema } from "../schema/activity.schema.js";

const router = Router();

router.get("/", activityController.list);
router.get("/:id", activityController.getById);
router.post("/", authenticateRequest, validate({ body: createActivitySchema }), activityController.create);
router.patch("/:id", authenticateRequest, validate({ body: updateActivitySchema }), activityController.update);
router.delete("/:id", authenticateRequest, activityController.remove);

export default router;
