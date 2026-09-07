import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

type Schemas = {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
};

export const validate =
  (schemas: Schemas) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.body) req.body = await schemas.body.parseAsync(req.body);
      if (schemas.query) {
        const parsed = await schemas.query.parseAsync(req.query);
        // mutate query in place without reassigning read-only property
        Object.assign(req.query, parsed);
      }
      if (schemas.params) {
        const parsed = await schemas.params.parseAsync(req.params);
        Object.assign(req.params, parsed);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
