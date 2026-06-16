import z from "zod";
import { NextFunction, Request, Response } from "express";

export const validatorMiddleware = (schema: z.ZodObject<{}>) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      const error = z.prettifyError(parsed.error);
      throw new Error(error);
    }

    next();
  };
};
