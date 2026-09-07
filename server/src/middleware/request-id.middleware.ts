import type { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";

const HEADER = "x-request-id";

/**
 * Injects a unique request ID into every request.
 * Uses the client-provided `x-request-id` header when present (for
 * distributed tracing), otherwise generates a new one.
 */
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id = (req.headers[HEADER] as string | undefined) || crypto.randomUUID();
  req.headers[HEADER] = id;
  res.setHeader(HEADER, id);
  next();
};
