import { describe, it, expect, vi, beforeEach } from "vitest";
import { requestId } from "../../src/middleware/request-id.middleware.js";

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    headers: {},
    ...overrides,
  }) as any;

const mockRes = () => {
  const res: any = {
    setHeader: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = vi.fn();

describe("requestId middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("generates a new UUID when no x-request-id header is provided", () => {
    const req = mockReq({ headers: {} });
    const res = mockRes();

    requestId(req, res, mockNext);

    expect(req.headers["x-request-id"]).toBeDefined();
    expect(typeof req.headers["x-request-id"]).toBe("string");
    expect(req.headers["x-request-id"]).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
    );
    expect(res.setHeader).toHaveBeenCalledWith(
      "x-request-id",
      req.headers["x-request-id"]
    );
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("uses existing x-request-id header if provided", () => {
    const existingId = "existing-trace-id-123";
    const req = mockReq({
      headers: { "x-request-id": existingId },
    });
    const res = mockRes();

    requestId(req, res, mockNext);

    expect(req.headers["x-request-id"]).toBe(existingId);
    expect(res.setHeader).toHaveBeenCalledWith("x-request-id", existingId);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("sets x-request-id on response", () => {
    const req = mockReq({ headers: {} });
    const res = mockRes();

    requestId(req, res, mockNext);

    expect(res.setHeader).toHaveBeenCalledWith(
      "x-request-id",
      expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      )
    );
  });

  it("generates unique IDs for each request", () => {
    const req1 = mockReq({ headers: {} });
    const res1 = mockRes();

    const req2 = mockReq({ headers: {} });
    const res2 = mockRes();

    requestId(req1, res1, mockNext);
    requestId(req2, res2, mockNext);

    expect(req1.headers["x-request-id"]).not.toBe(
      req2.headers["x-request-id"]
    );
  });
});
