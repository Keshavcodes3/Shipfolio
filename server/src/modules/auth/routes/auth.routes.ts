import { Router } from "express";
import { authController } from "../controller/auth.controller.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { registerSchema, loginSchema, changePasswordSchema } from "../schema/auth.schema.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { authRateLimiter } from "../../../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", authRateLimiter, validate({ body: registerSchema }), authController.register);
router.post("/login", authRateLimiter, validate({ body: loginSchema }), authController.login);
router.post("/clerk/sync", authRateLimiter, authController.clerkSync);
router.post("/logout", authenticateRequest, authController.logout);
router.post("/logout-all", authenticateRequest, authController.logoutAll);
router.post("/refresh", authRateLimiter, authController.refresh);
router.get("/me", authenticateRequest, authController.me);
router.post(
  "/change-password",
  authenticateRequest,
  validate({ body: changePasswordSchema }),
  authController.changePassword,
);
router.get("/github/callback", authController.githubCallback);

export default router;
