import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import { validate } from "../../src/middleware/validation.middleware.js";

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    body: {},
    query: {},
    params: {},
    ...overrides,
  }) as any;

const mockRes = () => ({}) as any;

const mockNext = vi.fn();

describe("validate middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("body validation", () => {
    it("passes through valid body", async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const middleware = validate({ body: schema });

      const req = mockReq({ body: { name: "John", age: 30 } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.body).toEqual({ name: "John", age: 30 });
    });

    it("returns 400 on invalid body", async () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const middleware = validate({ body: schema });

      const req = mockReq({ body: { name: "John" } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    it("transforms body data", async () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const middleware = validate({ body: schema });

      const req = mockReq({ body: { email: "test@example.com" } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.body.email).toBe("test@example.com");
    });
  });

  describe("query validation", () => {
    it("passes through valid query", async () => {
      const schema = z.object({
        page: z.coerce.number().default(1),
        limit: z.coerce.number().default(10),
      });

      const middleware = validate({ query: schema });

      const req = mockReq({ query: { page: "2", limit: "20" } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.query).toEqual({ page: 2, limit: 20 });
    });

    it("returns 400 on invalid query", async () => {
      const schema = z.object({
        page: z.coerce.number(),
      });

      const middleware = validate({ query: schema });

      const req = mockReq({ query: { page: "not-a-number" } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    it("applies default values to query", async () => {
      const schema = z.object({
        page: z.coerce.number().default(1),
      });

      const middleware = validate({ query: schema });

      const req = mockReq({ query: {} });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req.query).toEqual({ page: 1 });
    });
  });

  describe("params validation", () => {
    it("passes through valid params", async () => {
      const schema = z.object({
        id: z.string().uuid(),
      });

      const middleware = validate({ params: schema });

      const req = mockReq({
        params: { id: "550e8400-e29b-41d4-a716-446655440000" },
      });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it("returns 400 on invalid params", async () => {
      const schema = z.object({
        id: z.string().uuid(),
      });

      const middleware = validate({ params: schema });

      const req = mockReq({ params: { id: "not-a-uuid" } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });
  });

  describe("multiple schemas", () => {
    it("validates body, query, and params together", async () => {
      const bodySchema = z.object({ name: z.string() });
      const querySchema = z.object({ page: z.coerce.number() });
      const paramsSchema = z.object({ id: z.string() });

      const middleware = validate({
        body: bodySchema,
        query: querySchema,
        params: paramsSchema,
      });

      const req = mockReq({
        body: { name: "test" },
        query: { page: "1" },
        params: { id: "abc" },
      });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });

    it("fails if any schema is invalid", async () => {
      const bodySchema = z.object({ name: z.string() });
      const querySchema = z.object({ page: z.coerce.number() });

      const middleware = validate({
        body: bodySchema,
        query: querySchema,
      });

      const req = mockReq({
        body: { name: "test" },
        query: { page: "invalid" },
      });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });
  });

  describe("no schemas provided", () => {
    it("passes through without validation", async () => {
      const middleware = validate({});

      const req = mockReq({ body: { anything: "goes" } });
      const res = mockRes();

      await middleware(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});
