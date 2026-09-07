import type { Request } from "express";

// ---------------------------------------------------------------------------
// Express Request augmentation — attaches `user` to every Request so that
// `req.user` is available without manual type assertions.
// ---------------------------------------------------------------------------
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

/** @deprecated Prefer using `req.user` directly — this type is kept for callers that still reference it. */
export type AuthenticatedRequest = Request;

export type PaginationQuery = {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};
