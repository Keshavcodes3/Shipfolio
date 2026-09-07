export const AuthEvents = {
  REGISTERED: "auth.registered",
  LOGGED_IN: "auth.logged_in",
  LOGGED_OUT: "auth.logged_out",
  REFRESHED: "auth.refreshed",
  PASSWORD_CHANGED: "auth.password_changed",
  GITHUB_LINKED: "auth.github_linked",
} as const;

export type AuthRegisteredPayload = {
  userId: string;
  email: string;
  username: string;
};

export type AuthLoggedInPayload = {
  userId: string;
  email: string;
};

export type AuthLoggedOutPayload = {
  userId: string;
};

export type AuthRefreshedPayload = {
  userId: string;
};

export type AuthPasswordChangedPayload = {
  userId: string;
};

export type AuthGithubLinkedPayload = {
  userId: string;
  githubId: string;
};
