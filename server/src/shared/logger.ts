import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport:
    env.NODE_ENV !== "production"
      ? { target: "pino/file", options: { destination: 1 } }
      : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a child logger with a fixed context prefix.
 * Use for module-level or worker-level logging.
 *
 * @example
 * const log = createLogger("github-worker");
 * log.info({ jobId: "123" }, "processing sync");
 */
export const createLogger = (name: string) => logger.child({ module: name });

export default logger;
