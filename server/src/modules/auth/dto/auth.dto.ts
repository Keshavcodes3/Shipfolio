import type { AuthUserDto, AuthResponse } from "../types/auth.types.js";

export const toAuthUserDto = (user: {
  id: string;
  email: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
}): AuthUserDto => ({
  id: user.id,
  email: user.email,
  username: user.username,
  name: user.name ?? null,
  avatarUrl: user.avatarUrl ?? null,
});

export const toAuthResponse = (user: AuthUserDto, token: string, refreshToken: string): AuthResponse => ({
  user,
  token,
  refreshToken,
});
