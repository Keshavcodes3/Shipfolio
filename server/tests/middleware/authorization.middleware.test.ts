import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  requireOwnership,
  requireProjectOwnership,
  requireUserOwnership,
  requireSelf,
} from "../../src/middleware/authorization.middleware.js";
import { prisma } from "../../src/config/database.js";

const mockPrisma = vi.mocked(prisma);

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    params: {},
    user: undefined,
    ...overrides,
  }) as any;

const mockRes = () => ({}) as any;

const mockNext = vi.fn();

describe("requireOwnership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows owner to access resource", async () => {
    const lookup = vi.fn().mockResolvedValue({ userId: "user-1" });
    const middleware = requireOwnership(lookup);

    const req = mockReq({
      params: { id: "resource-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it("rejects non-owner with 403", async () => {
    const lookup = vi.fn().mockResolvedValue({ userId: "user-2" });
    const middleware = requireOwnership(lookup);

    const req = mockReq({
      params: { id: "resource-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    );
  });

  it("returns 404 when resource not found", async () => {
    const lookup = vi.fn().mockResolvedValue(null);
    const middleware = requireOwnership(lookup);

    const req = mockReq({
      params: { id: "nonexistent" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      })
    );
  });

  it("returns 403 when no user is authenticated", async () => {
    const lookup = vi.fn().mockResolvedValue({ userId: "user-2" });
    const middleware = requireOwnership(lookup);

    const req = mockReq({
      params: { id: "resource-1" },
      user: undefined,
    });
    const res = mockRes();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    );
  });

  it("uses custom extractId when provided", async () => {
    const lookup = vi.fn().mockResolvedValue({ userId: "user-1" });
    const extractId = vi.fn().mockReturnValue("custom-id");
    const middleware = requireOwnership(lookup, extractId);

    const req = mockReq({
      params: { id: "resource-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await middleware(req, res, mockNext);

    expect(extractId).toHaveBeenCalledWith(req);
    expect(lookup).toHaveBeenCalledWith("custom-id");
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("returns 404 when id is missing", async () => {
    const lookup = vi.fn();
    const middleware = requireOwnership(lookup);

    const req = mockReq({
      params: {},
      user: { id: "user-1" },
    });
    const res = mockRes();

    await middleware(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      })
    );
    expect(lookup).not.toHaveBeenCalled();
  });
});

describe("requireProjectOwnership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows project owner", async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ userId: "user-1" } as any);

    const req = mockReq({
      params: { id: "project-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireProjectOwnership(req, res, mockNext);

    expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
      where: { id: "project-1" },
      select: { userId: true },
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("rejects non-owner with 403", async () => {
    mockPrisma.project.findUnique.mockResolvedValue({ userId: "user-2" } as any);

    const req = mockReq({
      params: { id: "project-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireProjectOwnership(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    );
  });

  it("returns 404 when project not found", async () => {
    mockPrisma.project.findUnique.mockResolvedValue(null);

    const req = mockReq({
      params: { id: "nonexistent" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireProjectOwnership(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      })
    );
  });
});

describe("requireUserOwnership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows self", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-1" } as any);

    const req = mockReq({
      params: { id: "user-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireUserOwnership(req, res, mockNext);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { id: true },
    });
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("rejects other with 403", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "user-2" } as any);

    const req = mockReq({
      params: { id: "user-2" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireUserOwnership(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    );
  });

  it("returns 404 when user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const req = mockReq({
      params: { id: "nonexistent" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireUserOwnership(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      })
    );
  });
});

describe("requireSelf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows matching user ID", async () => {
    const req = mockReq({
      params: { id: "user-1" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireSelf(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });

  it("rejects mismatched user ID with 403", async () => {
    const req = mockReq({
      params: { id: "user-2" },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireSelf(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    );
  });

  it("returns 403 when no user is authenticated", async () => {
    const req = mockReq({
      params: { id: "user-1" },
      user: undefined,
    });
    const res = mockRes();

    await requireSelf(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
      })
    );
  });

  it("handles array params", async () => {
    const req = mockReq({
      params: { id: ["user-1"] },
      user: { id: "user-1" },
    });
    const res = mockRes();

    await requireSelf(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
  });
});
