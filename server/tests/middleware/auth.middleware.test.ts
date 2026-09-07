import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import {
  authenticateRequest,
  optionalAuthenticateRequest,
} from "../../src/middleware/auth.middleware.js";
import { prisma } from "../../src/config/database.js";
import { cacheGet, cacheSet } from "../../src/shared/cache.js";

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

vi.mock("../../src/shared/cache.js", () => ({
  cacheGet: vi.fn(),
  cacheSet: vi.fn(),
  cacheDel: vi.fn(),
}));

const mockJwt = vi.mocked(jwt);
const mockPrisma = vi.mocked(prisma);
const mockCacheGet = vi.mocked(cacheGet);
const mockCacheSet = vi.mocked(cacheSet);

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    headers: {},
    cookies: {},
    user: undefined,
    ...overrides,
  }) as any;

const mockRes = () => {
  const res: any = {};
  return res;
};

const mockNext = vi.fn();

const VALID_PAYLOAD = {
  id: "user-1",
  email: "test@example.com",
  username: "testuser",
  iat: 1000,
  exp: 9999999999,
};

describe("authenticateRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets req.user and calls next for valid token", async () => {
    mockJwt.verify.mockReturnValue(VALID_PAYLOAD as any);
    mockCacheGet.mockResolvedValue(true);

    const req = mockReq({
      headers: { authorization: "Bearer valid-token" },
    });
    const res = mockRes();

    await authenticateRequest(req, res, mockNext);

    expect(req.user).toEqual({
      id: "user-1",
      email: "test@example.com",
      username: "testuser",
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("returns 401 when no token is provided", async () => {
    const req = mockReq({ headers: {}, cookies: {} });
    const res = mockRes();

    await authenticateRequest(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });

  it("returns 401 when token is invalid", async () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = mockReq({
      headers: { authorization: "Bearer invalid-token" },
    });
    const res = mockRes();

    await authenticateRequest(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });

  it("returns 401 when session is expired", async () => {
    mockJwt.verify.mockReturnValue({
      ...VALID_PAYLOAD,
      sessionId: "session-1",
    } as any);
    mockCacheGet.mockResolvedValue(null);
    mockPrisma.session.findUnique.mockResolvedValue(null);

    const req = mockReq({
      headers: { authorization: "Bearer token" },
    });
    const res = mockRes();

    await authenticateRequest(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
      })
    );
  });

  it("accepts token from cookies", async () => {
    mockJwt.verify.mockReturnValue(VALID_PAYLOAD as any);
    mockCacheGet.mockResolvedValue(true);

    const req = mockReq({
      cookies: { token: "cookie-token" },
    });
    const res = mockRes();

    await authenticateRequest(req, res, mockNext);

    expect(req.user).toEqual({
      id: "user-1",
      email: "test@example.com",
      username: "testuser",
    });
    expect(mockNext).toHaveBeenCalledWith();
  });
});

describe("optionalAuthenticateRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sets req.user for valid token", async () => {
    mockJwt.verify.mockReturnValue(VALID_PAYLOAD as any);
    mockCacheGet.mockResolvedValue(true);

    const req = mockReq({
      headers: { authorization: "Bearer valid-token" },
    });
    const res = mockRes();

    await optionalAuthenticateRequest(req, res, mockNext);

    expect(req.user).toEqual({
      id: "user-1",
      email: "test@example.com",
      username: "testuser",
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("proceeds without user when no token is present", async () => {
    const req = mockReq({ headers: {}, cookies: {} });
    const res = mockRes();

    await optionalAuthenticateRequest(req, res, mockNext);

    expect(req.user).toBeUndefined();
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("proceeds without user when token is invalid", async () => {
    mockJwt.verify.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = mockReq({
      headers: { authorization: "Bearer bad-token" },
    });
    const res = mockRes();

    await optionalAuthenticateRequest(req, res, mockNext);

    expect(req.user).toBeUndefined();
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("proceeds without user when session is invalid", async () => {
    mockJwt.verify.mockReturnValue({
      ...VALID_PAYLOAD,
      sessionId: "session-1",
    } as any);
    mockCacheGet.mockResolvedValue(null);
    mockPrisma.session.findUnique.mockResolvedValue(null);

    const req = mockReq({
      headers: { authorization: "Bearer token" },
    });
    const res = mockRes();

    await optionalAuthenticateRequest(req, res, mockNext);

    expect(req.user).toBeUndefined();
    expect(mockNext).toHaveBeenCalledWith();
  });
});
