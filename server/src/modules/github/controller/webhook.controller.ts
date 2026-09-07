import type { Request, Response, NextFunction } from "express";
import { verifyWebhookSignature } from "../utils/webhook-signature.js";
import { webhookService } from "../service/webhook.service.js";
import { createLogger } from "../../../shared/logger.js";
import { HTTP_STATUS } from "../../../shared/constants/index.js";
import { env } from "../../../config/env.js";

const log = createLogger("github-webhook-controller");

export const githubWebhookController = {
  /**
   * Handle an incoming GitHub webhook.
   *
   * Expects:
   *  - `req._rawBody` set by a dedicated `express.raw()` middleware mounted
   *    on this route **before** the global JSON parser.
   *  - Headers: x-github-event, x-github-delivery, x-hub-signature-256
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const event = req.headers["x-github-event"] as string | undefined;
      const deliveryId = req.headers["x-github-delivery"] as string | undefined;
      const signature = req.headers["x-hub-signature-256"] as string | undefined;

      if (!event || !deliveryId || !signature) {
        log.warn("Missing required GitHub webhook headers");
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Missing required GitHub webhook headers",
        });
        return;
      }

      // Retrieve the raw body captured by express.raw() middleware
      const rawBody = (req as any)._rawBody as Buffer | undefined;
      if (!rawBody) {
        log.error("Raw body not available — ensure express.raw() middleware is mounted");
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal processing error",
        });
        return;
      }

      // Verify HMAC-SHA256 signature
      const webhookSecret = env.GITHUB_WEBHOOK_SECRET;
      if (!webhookSecret) {
        log.error("GITHUB_WEBHOOK_SECRET is not configured — rejecting webhook");
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Webhook secret not configured",
        });
        return;
      }

      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        log.warn({ deliveryId, event }, "Invalid webhook signature");
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
          success: false,
          message: "Invalid signature",
        });
        return;
      }

      log.info(
        { event, deliveryId, bodyType: typeof req.body },
        "Webhook received — processing",
      );

      const result = await webhookService.processWebhook(event, deliveryId, req.body);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        processed: result.processed,
        ...(result.reason ? { reason: result.reason } : {}),
      });
    } catch (err) {
      next(err);
    }
  },
};

export default githubWebhookController;
