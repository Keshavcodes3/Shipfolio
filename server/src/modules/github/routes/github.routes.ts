import { Router, raw } from "express";
import { githubController } from "../controller/github.controller.js";
import { githubWebhookController } from "../controller/webhook.controller.js";
import { authenticateRequest } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../middleware/validation.middleware.js";
import { oauthInitSchema, linkAccountSchema, connectRepoSchema, repoListQuerySchema } from "../schema/github.schema.js";
import { githubRateLimiter } from "../../../middleware/rate-limit.middleware.js";

const router = Router();

// ---------------------------------------------------------------------------
// Public routes (no auth required)
// ---------------------------------------------------------------------------

// Public proxy: README content for any GitHub repo
router.get("/public/repos/:fullName/readme", githubController.getPublicReadme);

// Public proxy: contributors for any GitHub repo
router.get("/public/repos/:fullName/contributors", githubController.getPublicContributors);

// Public proxy: languages breakdown for any GitHub repo
router.get("/public/repos/:fullName/languages", githubController.getPublicLanguages);

// Initiates OAuth – returns the GitHub authorization URL and state
router.post(
  "/oauth/init",
  githubRateLimiter,
  validate({ body: oauthInitSchema }),
  githubController.initiateOAuth,
);

// GitHub OAuth callback – exchanges code for token, creates/finds user
router.get("/oauth/callback", githubRateLimiter, githubController.handleOAuthCallback);

// GitHub Webhook – requires raw body for HMAC-SHA256 signature verification.
// The global express.json() parser is bypassed for this route by mounting
// express.raw() here. The raw buffer is stored on req._rawBody and the
// parsed body is produced by express.json() which still runs for downstream
// middleware/controllers (Express processes both when both are present).
router.post(
  "/webhook",
  raw({ type: "application/json" }),
  (req, _res, next) => {
    // Store the raw buffer before JSON parsing overwrites req.body
    (req as any)._rawBody = req.body;
    next();
  },
  githubWebhookController.handleWebhook,
);

// ---------------------------------------------------------------------------
// Protected routes (auth required)
// ---------------------------------------------------------------------------

// Get the currently linked GitHub account
router.get("/account", authenticateRequest, githubController.getLinkedAccount);

// Link a GitHub account to the authenticated user
router.post(
  "/account/link",
  authenticateRequest,
  githubRateLimiter,
  validate({ body: linkAccountSchema }),
  githubController.linkAccount,
);

// Unlink the GitHub account from the authenticated user
router.delete("/account/unlink", authenticateRequest, githubController.unlinkAccount);

// Sync repositories from GitHub
router.post("/repos/sync", authenticateRequest, githubRateLimiter, githubController.syncRepositories);

// Get synced repositories (optionally filter by projectId)
router.get(
  "/repos",
  authenticateRequest,
  validate({ query: repoListQuerySchema }),
  githubController.getRepositories,
);

// Get a single repository by ID
router.get("/repos/:repoId", authenticateRequest, githubController.getRepository);

// Connect a repository to a project
router.post(
  "/repos/:repoId/connect",
  authenticateRequest,
  validate({ body: connectRepoSchema }),
  githubController.connectRepository,
);

export default router;
