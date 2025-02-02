import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodEffects, ZodError } from "zod";
import { ValidationError } from "../errors";

type RequestValidator = {
  params?: AnyZodObject | ZodEffects<AnyZodObject>;
  body?: AnyZodObject | ZodEffects<AnyZodObject>;
  query?: AnyZodObject | ZodEffects<AnyZodObject>;
};

const validateRequest =
  (validators: RequestValidator) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = await validators.params.parseAsync(req.params);
      }
      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }
      if (validators.query) {
        req.query = await validators.query.parseAsync(req.query);
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = new ValidationError();
        validationError.data = err.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        }));
        return next(validationError);
      }
      next(err);
    }
  };

export default validateRequest;
