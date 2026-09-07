import { BadRequestError, ConflictError, UnauthorizedError } from "../../../shared/errors/index.js";
import { emitEvent } from "../../../shared/events/eventBus.js";
import { AuthEvents } from "../events/auth.events.js";
import { authRepository } from "../repository/auth.repository.js";
import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  generateSessionToken,
  hashSessionToken,
  compareSessionToken,
} from "../utils/auth.utils.js";
import { toAuthUserDto } from "../dto/auth.dto.js";
import { githubService } from "../../github/service/github.service.js";
import type { RegisterInput, LoginInput } from "../types/auth.types.js";

const REFRESH_TOKEN_EXPIRES_DAYS = 30;

const createSession = async (userId: string) => {
  const sessionToken = generateSessionToken();
  const tokenHash = hashSessionToken(sessionToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  await authRepository.createSession({ userId, tokenHash, expiresAt });

  return sessionToken;
};

export const authService = {
  async register(input: RegisterInput) {
    const existingEmail = await authRepository.findByEmail(input.email);
    if (existingEmail) throw new ConflictError("Email already in use");

    const existingUsername = await authRepository.findByUsername(input.username);
    if (existingUsername) throw new ConflictError("Username already taken");

    const hashed = await hashPassword(input.password);
    const user = await authRepository.create({
      email: input.email,
      username: input.username,
      password: hashed,
      name: input.name,
    });

    const dto = toAuthUserDto(user);
    const { token, refreshToken } = generateTokenPair(dto);
    const sessionToken = await createSession(user.id);

    emitEvent(AuthEvents.REGISTERED, { userId: user.id, email: user.email, username: user.username });

    return { user: dto, token, refreshToken: sessionToken };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);

    // Always run bcrypt comparison to prevent timing-based user enumeration
    const dummyHash = "$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
    const passwordToCheck = user?.password ?? dummyHash;
    const valid = await comparePassword(input.password, passwordToCheck);

    if (!user || !valid) throw new UnauthorizedError("Invalid credentials");

    const dto = toAuthUserDto(user);
    const { token, refreshToken } = generateTokenPair(dto);
    const sessionToken = await createSession(user.id);

    emitEvent(AuthEvents.LOGGED_IN, { userId: user.id, email: user.email });

    return { user: dto, token, refreshToken: sessionToken };
  },

  async me(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) throw new UnauthorizedError("User not found");
    return toAuthUserDto(user);
  },

  async refresh(refreshTokenRaw: string) {
    if (!refreshTokenRaw || typeof refreshTokenRaw !== "string") {
      throw new UnauthorizedError("Refresh token required");
    }

    // The refresh token is a raw session token stored in an httpOnly cookie.
    // Hash it to look up the session in the DB (DB stores SHA-256 hashes).
    const tokenHash = hashSessionToken(refreshTokenRaw);
    const session = await authRepository.findSessionByTokenHash(tokenHash);
    if (!session) throw new UnauthorizedError("Invalid refresh session");

    if (new Date() > session.expiresAt) {
      await authRepository.deleteSession(session.id).catch(() => {});
      throw new UnauthorizedError("Refresh token expired");
    }

    // Rotate: delete old session, create new one
    await authRepository.deleteSession(session.id);

    const user = await authRepository.findById(session.userId);
    if (!user) throw new UnauthorizedError("User not found");

    const dto = toAuthUserDto(user);
    const { token } = generateTokenPair(dto);
    const sessionToken = await createSession(user.id);

    emitEvent(AuthEvents.REFRESHED, { userId: user.id });

    return { user: dto, token, refreshToken: sessionToken };
  },

  async logout(userId: string, sessionTokenRaw?: string) {
    if (sessionTokenRaw) {
      const tokenHash = hashSessionToken(sessionTokenRaw);
      await authRepository.deleteSessionByTokenHash(tokenHash).catch(() => {});
    }
    emitEvent(AuthEvents.LOGGED_OUT, { userId });
  },

  async logoutAll(userId: string) {
    await authRepository.deleteSessionsByUserId(userId);
    emitEvent(AuthEvents.LOGGED_OUT, { userId });
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await authRepository.findById(userId);
    if (!user || !user.password) throw new UnauthorizedError("User not found");

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) throw new UnauthorizedError("Current password is incorrect");

    const hashed = await hashPassword(newPassword);
    await authRepository.updatePassword(userId, hashed);

    await authRepository.deleteSessionsByUserId(userId);

    emitEvent(AuthEvents.PASSWORD_CHANGED, { userId });
  },

  /**
   * Syncs a Clerk-authenticated user with the backend.
   * Creates a new user if none exists with the given clerkId.
   * Returns a backend JWT so the frontend can call other API endpoints.
   */
  async clerkSync(input: {
    clerkId: string;
    email: string;
    name?: string;
    avatarUrl?: string;
    githubUsername?: string;
    githubUserId?: string;
  }) {
    let user = await authRepository.findByClerkId(input.clerkId);

    if (!user) {
      // Check if email already exists (user registered via password before)
      user = await authRepository.findByEmail(input.email);

      if (user) {
        // Link existing account to Clerk
        user = await authRepository.update(user.id, {
          name: input.name ?? user.name ?? undefined,
          avatarUrl: input.avatarUrl ?? user.avatarUrl ?? undefined,
        });
        // We need to update clerkId - use prisma directly since update doesn't support it yet
        const { prisma } = await import("../../../config/database.js");
        await prisma.user.update({ where: { id: user.id }, data: { clerkId: input.clerkId } });
        user = await authRepository.findById(user.id);
      } else {
        // Create new user
        // Generate a unique username from email
        let baseUsername = input.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_-]/g, "");
        if (baseUsername.length < 3) baseUsername = "user";
        let username = baseUsername;
        let counter = 1;
        while (await authRepository.findByUsername(username)) {
          username = `${baseUsername}${counter}`;
          counter++;
        }

        user = await authRepository.create({
          email: input.email,
          username,
          name: input.name,
          avatarUrl: input.avatarUrl,
          clerkId: input.clerkId,
        });
      }
    } else {
      // Update existing Clerk user's info
      user = await authRepository.update(user.id, {
        name: input.name ?? user.name ?? undefined,
        avatarUrl: input.avatarUrl ?? user.avatarUrl ?? undefined,
      });
    }

    if (!user) throw new UnauthorizedError("Failed to sync Clerk user");

    // Fetch GitHub account if linked
    const { githubRepository } = await import("../../github/repository/github.repository.js");
    const githubAccount = await githubRepository.findAccountByUserId(user.id);

    const dto = toAuthUserDto(user);
    const { token } = generateTokenPair(dto);
    const sessionToken = await createSession(user.id);

    emitEvent(AuthEvents.LOGGED_IN, { userId: user.id, email: user.email });

    return {
      user: {
        ...dto,
        githubUsername: githubAccount?.username,
      },
      token,
      refreshToken: sessionToken,
    };
  },

  /**
   * Handles the GitHub OAuth callback. Delegates user resolution and
   * account upsert to the GitHub module, then creates an auth session.
   */
  async githubCallback(code: string) {
    if (!code) throw new BadRequestError("GitHub code is required");

    // processOAuthCode skips CSRF state validation — safe here because the
    // auth callback URL is server-controlled and not user-initiated.
    const { user: ghAccount, isNewUser } = await githubService.processOAuthCode(code);

    const user = await authRepository.findById(ghAccount.userId);
    if (!user) throw new UnauthorizedError("User not found after GitHub OAuth");

    const dto = toAuthUserDto(user);
    const { token } = generateTokenPair(dto);
    const sessionToken = await createSession(user.id);

    return { user: dto, token, refreshToken: sessionToken };
  },
};

export default authService;
