import { describe, it, expect, vi, beforeEach } from "vitest";
import { ZodError } from "zod";
import { errorMiddleware, notFoundMiddleware } from "../../src/middleware/error.middleware.js";
import { AppError, NotFoundError } from "../../src/shared/errors/AppError.js";

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    originalUrl: "/api/v1/test",
    ...overrides,
  }) as any;

const mockRes = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = vi.fn();

describe("errorMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("handles ZodError with 400", () => {
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["email"],
        message: "Required",
      },
    ]);

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(zodError, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: { email: ["Required"] },
    });
  });

  it("handles AppError with correct status code", () => {
    const appError = new AppError("Custom error", 422, "CUSTOM_ERROR");

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(appError, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Custom error",
      code: "CUSTOM_ERROR",
    });
  });

  it("handles NotFoundError", () => {
    const error = new NotFoundError();

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Resource not found",
      code: "NOT_FOUND",
    });
  });

  it("handles unknown error with 500", () => {
    const error = new Error("Something went wrong");

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Something went wrong",
      })
    );
  });

  it("hides error message in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    const error = new Error("Sensitive error details");

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(error, req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });

    process.env.NODE_ENV = originalEnv;
  });

  it("logs unknown errors to console", () => {
    const error = new Error("Logged error");

    const req = mockReq();
    const res = mockRes();

    errorMiddleware(error, req, res, mockNext);

    expect(console.error).toHaveBeenCalledWith("[Unhandled Error]", error);
  });
});

describe("notFoundMiddleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 404 with route info", () => {
    const req = mockReq({ originalUrl: "/api/v1/unknown-route" });
    const res = mockRes();

    notFoundMiddleware(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Route /api/v1/unknown-route not found",
    });
  });
});
