import type { Request, Response, NextFunction } from "express";
import { githubService } from "../service/github.service.js";
import { HTTP_STATUS } from "../../../shared/constants/index.js";

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/",
};

const REFRESH_COOKIE_NAME = "refreshToken";

/** Safely extract a single string from an Express 5 param (which may be string | string[]). */
const param = (value: unknown): string =>
  Array.isArray(value) ? value[0] : (value as string);

export const githubController = {
  // ----- OAuth initiation --------------------------------------------------

  initiateOAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { redirect, mode } = req.body ?? {};
      const { url, state } = githubService.initiateOAuth(redirect, mode);
      res.json({ success: true, data: { url, state } });
    } catch (err) {
      next(err);
    }
  },

  // ----- OAuth callback (unauthenticated) -----------------------------------

  async handleOAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query as { code?: string; state?: string };

      if (!code || !state) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Missing code or state query parameter",
        });
      }

      const result = await githubService.handleOAuthCallback(code, state);

      // Set refresh cookie (for the session created during OAuth login)
      // The actual session token is returned by the auth service when
      // handleOAuthCallback is used in login context. Here we just return
      // the account info.
      res.json({
        success: true,
        data: { account: result.user, isNewUser: result.isNewUser },
      });
    } catch (err) {
      next(err);
    }
  },

  // ----- Get linked account ------------------------------------------------

  async getLinkedAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const account = await githubService.getLinkedAccount(req.user!.id);
      res.json({ success: true, data: account });
    } catch (err) {
      next(err);
    }
  },

  // ----- Link account (authenticated) --------------------------------------

  async linkAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.body;
      const account = await githubService.linkAccount(req.user!.id, code);
      res.status(HTTP_STATUS.CREATED).json({ success: true, data: account });
    } catch (err) {
      next(err);
    }
  },

  // ----- Unlink account ----------------------------------------------------

  async unlinkAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await githubService.unlinkAccount(req.user!.id);
      res.json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  },

  // ----- Sync repositories -------------------------------------------------

  async syncRepositories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await githubService.syncRepositories(req.user!.id);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  // ----- Get repositories --------------------------------------------------

  async getRepositories(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.query as { projectId?: string };
      const repos = await githubService.getRepositories(req.user!.id, projectId);
      res.json({ success: true, data: repos });
    } catch (err) {
      next(err);
    }
  },

  // ----- Get single repository ---------------------------------------------

  async getRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const repoId = param(req.params.repoId);
      const repo = await githubService.getRepository(req.user!.id, repoId);
      res.json({ success: true, data: repo });
    } catch (err) {
      next(err);
    }
  },

  // ----- Connect repository to project -------------------------------------

  async connectRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const repoId = param(req.params.repoId);
      const { projectId } = req.body;
      const project = await githubService.connectRepo(req.user!.id, repoId, projectId);
      res.json({ success: true, data: project });
    } catch (err) {
      next(err);
    }
  },

  // ----- Disconnect repository from project --------------------------------

  async disconnectRepository(req: Request, res: Response, next: NextFunction) {
    try {
      const projectId = param(req.params.id);
      const result = await githubService.disconnectRepo(req.user!.id, projectId);
      res.json({ success: true, message: result.message });
    } catch (err) {
      next(err);
    }
  },

  // ----- Public proxy endpoints (no auth required) -------------------------

  /**
   * GET /github/public/repos/:fullName/readme
   * Proxy README content from GitHub for any public repo.
   */
  async getPublicReadme(req: Request, res: Response, next: NextFunction) {
    try {
      const fullName = param(req.params.fullName);
      const { githubClient } = await import("../../../infrastructure/github/github.client.js");
      const response = await githubClient.getReadme(fullName);
      res.json({ success: true, data: { content: response.data } });
    } catch (err: any) {
      if (err?.status === 404) {
        res.json({ success: true, data: { content: null } });
        return;
      }
      next(err);
    }
  },

  /**
   * GET /github/public/repos/:fullName/contributors
   * Proxy contributors list from GitHub for any public repo.
   */
  async getPublicContributors(req: Request, res: Response, next: NextFunction) {
    try {
      const fullName = param(req.params.fullName);
      const { githubClient } = await import("../../../infrastructure/github/github.client.js");
      const response = await githubClient.getContributors(fullName);
      const contributors = (response.data || []).map((c: any) => ({
        login: c.login,
        avatarUrl: c.avatar_url,
        htmlUrl: c.html_url,
        contributions: c.contributions,
      }));
      res.json({ success: true, data: contributors });
    } catch (err: any) {
      if (err?.status === 404) {
        res.json({ success: true, data: [] });
        return;
      }
      next(err);
    }
  },

  /**
   * GET /github/public/repos/:fullName/languages
   * Proxy languages breakdown from GitHub for any public repo.
   */
  async getPublicLanguages(req: Request, res: Response, next: NextFunction) {
    try {
      const fullName = param(req.params.fullName);
      const { githubClient } = await import("../../../infrastructure/github/github.client.js");
      const response = await githubClient.getLanguages(fullName);
      const languages = response.data || {};
      // Sort by bytes descending, return top 10
      const sorted = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, bytes]) => ({ name, bytes }));
      res.json({ success: true, data: sorted });
    } catch (err: any) {
      if (err?.status === 404) {
        res.json({ success: true, data: [] });
        return;
      }
      next(err);
    }
  },
};

export default githubController;
