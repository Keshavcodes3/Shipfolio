export type RegisterInput = {
  email: string;
  username: string;
  password: string;
  name?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUserDto = {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
  githubUsername?: string | null;
};

export type AuthResponse = {
  user: AuthUserDto;
  token: string;
  refreshToken: string;
};

export type GithubAuthInput = {
  code: string;
};
