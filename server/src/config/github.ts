import { env } from "./env.js";

export const githubConfig = {
  clientId: env.GITHUB_CLIENT_ID ?? "",
  clientSecret: env.GITHUB_CLIENT_SECRET ?? "",
  callbackUrl: env.GITHUB_CALLBACK_URL ?? "",
  token: env.GITHUB_TOKEN ?? "",
  apiBaseUrl: "https://api.github.com",
  oauthAuthorizeUrl: "https://github.com/login/oauth/authorize",
  oauthTokenUrl: "https://github.com/login/oauth/access_token",
  scope: "read:user user:email repo",
} as const;

export const isGithubConfigured = (): boolean =>
  Boolean(githubConfig.clientId && githubConfig.clientSecret);

export default githubConfig;
