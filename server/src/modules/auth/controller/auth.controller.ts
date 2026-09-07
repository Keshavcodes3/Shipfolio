import type { Request, Response, NextFunction } from "express";
import { authService } from "../service/auth.service.js";
import { HTTP_STATUS } from "../../../shared/constants/index.js";
import { validateOAuthState } from "../../github/utils/csrf.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

const REFRESH_COOKIE_NAME = "refreshToken";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request & { user?: { id: string } }, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const user = await authService.me(userId);
      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshTokenRaw = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
      const result = await authService.refresh(refreshTokenRaw ?? "");
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: Request & { user?: { id: string } }, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const refreshTokenRaw = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
      await authService.logout(userId, refreshTokenRaw);
      res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
      res.json({ success: true, message: "Logged out" });
    } catch (err) {
      next(err);
    }
  },

  async logoutAll(req: Request & { user?: { id: string } }, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      await authService.logoutAll(userId);
      res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
      res.json({ success: true, message: "Logged out from all devices" });
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req: Request & { user?: { id: string } }, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(userId, currentPassword, newPassword);
      res.clearCookie(REFRESH_COOKIE_NAME, cookieOptions);
      res.json({ success: true, message: "Password changed. Please log in again." });
    } catch (err) {
      next(err);
    }
  },

  async clerkSync(req: Request, res: Response, next: NextFunction) {
    try {
      const { clerkId, email, name, avatarUrl, githubUsername, githubUserId } = req.body;
      const result = await authService.clerkSync({ clerkId, email, name, avatarUrl, githubUsername, githubUserId });
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      next(err);
    }
  },

  async githubCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query as { code?: string; state?: string };

      // Check if this is a "link" flow — redirect to frontend callback
      if (state) {
        try {
          const parsed = validateOAuthState(state);
          if (parsed.mode === "link") {
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            const redirectUrl = `${frontendUrl}/github/link-callback?code=${code}&state=${state}`;
            return res.redirect(redirectUrl);
          }
        } catch {
          // Invalid state — fall through to normal login flow
        }
      }

      // Normal login flow
      const result = await authService.githubCallback(code as string);
      res.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
        ...cookieOptions,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.json({
        success: true,
        data: { user: result.user, token: result.token },
      });
    } catch (err) {
      next(err);
    }
  },
};

export default authController;
