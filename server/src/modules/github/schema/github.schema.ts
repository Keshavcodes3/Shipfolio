import { z } from "zod";

// ---------------------------------------------------------------------------
// OAuth Initiation
// ---------------------------------------------------------------------------

export const oauthInitSchema = z.object({
  redirect: z.string().max(500).optional(),
  mode: z.enum(["login", "link"]).optional(),
});

export type OAuthInitSchema = z.infer<typeof oauthInitSchema>;

// ---------------------------------------------------------------------------
// OAuth Callback
// ---------------------------------------------------------------------------

export const oauthCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().min(1, "State parameter is required"),
});

export type OAuthCallbackSchema = z.infer<typeof oauthCallbackSchema>;

// ---------------------------------------------------------------------------
// Account Linking (authenticated user links a GitHub account)
// ---------------------------------------------------------------------------

export const linkAccountSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});

export type LinkAccountSchema = z.infer<typeof linkAccountSchema>;

// ---------------------------------------------------------------------------
// Connect Repository to Project
// ---------------------------------------------------------------------------

export const connectRepoSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
});

export type ConnectRepoSchema = z.infer<typeof connectRepoSchema>;

// ---------------------------------------------------------------------------
// Repository List Query
// ---------------------------------------------------------------------------

export const repoListQuerySchema = z.object({
  projectId: z.string().optional(),
});

export type RepoListQuerySchema = z.infer<typeof repoListQuerySchema>;
