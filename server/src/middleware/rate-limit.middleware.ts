import type { Request, Response, NextFunction } from "express";

// Rate limiters temporarily disabled for development
const noop = (_req: Request, _res: Response, next: NextFunction) => next();

export const globalRateLimiter = noop;
export const authRateLimiter = noop;
export const githubRateLimiter = noop;
export const followRateLimiter = noop;
