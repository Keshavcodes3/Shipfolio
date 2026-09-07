import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../shared/errors/index.js";
import { prisma } from "../config/database.js";
import { cacheGet, cacheSet, cacheDel } from "../shared/cache.js";

export interface JwtPayload {
  id: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// ---------------------------------------------------------------------------
// Session cache — avoids a DB hit on every authenticated request
// ---------------------------------------------------------------------------

const SESSION_CACHE_PREFIX = "session:";
const SESSION_CACHE_TTL = 60; // 1 minute — short enough to respect revocations
const USER_CACHE_PREFIX = "user-exists:";
const USER_CACHE_TTL = 60;

async function isSessionValid(sessionId: string): Promise<boolean> {
  // Try cache first
  const cached = await cacheGet<boolean>(`${SESSION_CACHE_PREFIX}${sessionId}`);
  if (cached === true) return true;
  if (cached === false) return false;

  // Cache miss — check DB
  const session = await prisma.session.findUnique({ where: { id: sessionId } });
  if (!session) {
    await cacheSet(`${SESSION_CACHE_PREFIX}${sessionId}`, false, SESSION_CACHE_TTL);
    return false;
  }
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    await cacheSet(`${SESSION_CACHE_PREFIX}${sessionId}`, false, SESSION_CACHE_TTL);
    return false;
  }

  await cacheSet(`${SESSION_CACHE_PREFIX}${sessionId}`, true, SESSION_CACHE_TTL);
  return true;
}

/**
 * Invalidate a session cache entry (called on logout / revoke).
 */
export const invalidateSessionCache = (sessionId: string): Promise<void> =>
  cacheDel(`${SESSION_CACHE_PREFIX}${sessionId}`);

/**
 * Verify that the user still exists in the database.
 * Uses a short-lived cache to avoid a DB hit on every request.
 * Returns false for deleted users.
 */
async function doesUserExist(userId: string): Promise<boolean> {
  const cacheKey = `${USER_CACHE_PREFIX}${userId}`;
  const cached = await cacheGet<boolean>(cacheKey);
  if (cached !== null) return cached;

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  const exists = user !== null;
  await cacheSet(cacheKey, exists, USER_CACHE_TTL);
  return exists;
}

// ---------------------------------------------------------------------------
// Token extraction
// ---------------------------------------------------------------------------

function extractToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return req.cookies?.token as string | undefined;
}

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

/**
 * Verifies the JWT and attaches the authenticated user to `req.user`.
 *
 * When a session ID is present in the JWT payload, validates that the session
 * still exists and has not expired. Uses a short-lived Redis cache to avoid
 * a DB hit on every request.
 */
export const authenticateRequest = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new UnauthorizedError("Authentication required");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch (e) {
      throw e;
    }

    const sessionId = (decoded as any).sessionId as string | undefined;
    if (sessionId) {
      const valid = await isSessionValid(sessionId);
      if (!valid) {
        throw new UnauthorizedError("Session revoked or expired");
      }
    }

    const userExists = await doesUserExist(decoded.id);
    if (!userExists) {
      throw new UnauthorizedError("User account no longer exists");
    }

    req.user = { id: decoded.id, email: decoded.email, username: decoded.username };
    next();
  } catch (err: any) {
    if (err instanceof UnauthorizedError) return next(err);
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

/**
 * Same as `authenticateRequest` but never rejects — when no token is present
 * or the token is invalid the request simply proceeds with `req.user = undefined`.
 */
export const optionalAuthenticateRequest = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = extractToken(req);
    if (!token) return next();

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const sessionId = (decoded as any).sessionId as string | undefined;
    if (sessionId) {
      const valid = await isSessionValid(sessionId);
      if (!valid) return next();
    }

    req.user = { id: decoded.id, email: decoded.email, username: decoded.username };
  } catch {
    // ignore — proceed unauthenticated
  }
  next();
};

// ---------------------------------------------------------------------------
// Backwards-compatible aliases
// ---------------------------------------------------------------------------

/** @deprecated Use `authenticateRequest` */
export const authMiddleware = authenticateRequest;

/** @deprecated Use `optionalAuthenticateRequest` */
export const optionalAuth = optionalAuthenticateRequest;
