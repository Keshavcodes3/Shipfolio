import { describe, it, expect, vi, beforeEach } from "vitest";
import { githubWebhookController } from "../../../src/modules/github/controller/webhook.controller.js";
import { webhookService } from "../../../src/modules/github/service/webhook.service.js";
import { verifyWebhookSignature } from "../../../src/modules/github/utils/webhook-signature.js";

vi.mock("../../../src/modules/github/service/webhook.service.js", () => ({
  webhookService: {
    processWebhook: vi.fn(),
  },
}));

vi.mock("../../../src/modules/github/utils/webhook-signature.js", () => ({
  verifyWebhookSignature: vi.fn(),
}));

vi.mock("../../../src/config/env.js", () => ({
  env: {
    GITHUB_WEBHOOK_SECRET: "test-secret",
    API_PREFIX: "/api/v1",
  },
}));

const mockWebhookService = vi.mocked(webhookService);
const mockVerifySignature = vi.mocked(verifyWebhookSignature);

const mockReq = (overrides: Record<string, any> = {}) =>
  ({
    headers: {},
    body: {},
    ...overrides,
  }) as any;

const mockRes = () => {
  const res: any = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
  return res;
};

const mockNext = vi.fn();

const VALID_HEADERS = {
  "x-github-event": "push",
  "x-github-delivery": "delivery-123",
  "x-hub-signature-256": "sha256=abc123",
};

describe("githubWebhookController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =========================================================================
  // handleWebhook
  // =========================================================================

  describe("handleWebhook", () => {
    it("returns 400 when required headers are missing", async () => {
      const req = mockReq({ headers: {} });
      const res = mockRes();

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Missing required GitHub webhook headers",
        }),
      );
    });

    it("returns 400 when x-github-event header is missing", async () => {
      const req = mockReq({
        headers: {
          "x-github-delivery": "delivery-123",
          "x-hub-signature-256": "sha256=abc123",
        },
      });
      const res = mockRes();

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when x-github-delivery header is missing", async () => {
      const req = mockReq({
        headers: {
          "x-github-event": "push",
          "x-hub-signature-256": "sha256=abc123",
        },
      });
      const res = mockRes();

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 400 when x-hub-signature-256 header is missing", async () => {
      const req = mockReq({
        headers: {
          "x-github-event": "push",
          "x-github-delivery": "delivery-123",
        },
      });
      const res = mockRes();

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 500 when raw body is not available", async () => {
      const req = mockReq({ headers: VALID_HEADERS });
      const res = mockRes();

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Internal processing error",
        }),
      );
    });

    it("returns 401 for invalid webhook signature", async () => {
      const rawBody = Buffer.from('{"hello":"world"}');
      const req = mockReq({
        headers: VALID_HEADERS,
        _rawBody: rawBody,
      });
      const res = mockRes();
      mockVerifySignature.mockReturnValue(false);

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Invalid signature",
        }),
      );
      expect(mockVerifySignature).toHaveBeenCalledWith(rawBody, "sha256=abc123", "test-secret");
    });

    it("processes valid webhook and returns success", async () => {
      const rawBody = Buffer.from('{"hello":"world"}');
      const req = mockReq({
        headers: VALID_HEADERS,
        _rawBody: rawBody,
        body: { hello: "world" },
      });
      const res = mockRes();
      mockVerifySignature.mockReturnValue(true);
      mockWebhookService.processWebhook.mockResolvedValue({ processed: true });

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        processed: true,
      });
      expect(mockWebhookService.processWebhook).toHaveBeenCalledWith(
        "push",
        "delivery-123",
        { hello: "world" },
      );
    });

    it("includes reason when processing returns one", async () => {
      const rawBody = Buffer.from("{}");
      const req = mockReq({
        headers: VALID_HEADERS,
        _rawBody: rawBody,
        body: {},
      });
      const res = mockRes();
      mockVerifySignature.mockReturnValue(true);
      mockWebhookService.processWebhook.mockResolvedValue({
        processed: false,
        reason: "duplicate",
      });

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        processed: false,
        reason: "duplicate",
      });
    });

    it("calls next on unhandled error", async () => {
      const rawBody = Buffer.from("{}");
      const req = mockReq({
        headers: VALID_HEADERS,
        _rawBody: rawBody,
        body: {},
      });
      const res = mockRes();
      mockVerifySignature.mockReturnValue(true);
      mockWebhookService.processWebhook.mockRejectedValue(new Error("Unexpected"));

      await githubWebhookController.handleWebhook(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
