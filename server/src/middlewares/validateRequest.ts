import type { NextFunction, Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { ZodError, ZodType } from "zod";
import { ValidationError } from "../errors/index.js";

interface RequestValidator {
  params?: ZodType<ParamsDictionary>;
  body?: ZodType;
  query?: ZodType<ParsedQs>;
}

const validateRequest =
  (validators: RequestValidator) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = validators.params.parse(req.params);
      }
      if (validators.body) {
        req.body = validators.body.parse(req.body);
      }
      if (validators.query) {
        req.query = validators.query.parse(req.query);
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
