import type { NextFunction, Request, Response } from "express";
import type { ErrorResponse } from "../types/responseTypes.js";
import type { BodyParserError } from "../types/error.js";
import * as Sentry from "@sentry/node";
import {
  AlreadyExistsError,
  AuthenticationError,
  ConflictError,
  HttpError,
  NotFoundError,
  NotPermittedError,
  RemoveOwnerError,
  TooManyLists,
  TooManyProducts,
  ValidationError,
} from "../errors/index.js";
import { logger } from "../config/index.js";

const handleNotFound = (req: Request, res: Response) => {
  res.status(404).send();
};

const handleKnownErrors = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof URIError) {
    return next(new HttpError(400, "Invalid URI"));
  }

  if (
    typeof error !== "object" ||
    error === null ||
    !("type" in error) ||
    typeof error.type !== "string"
  ) {
    return next(error);
  }
  const type = (error as BodyParserError).type;

  if (type === "entity.parse.failed" || type === "request.aborted") {
    return next(new HttpError(400, "Request contains invalid JSON"));
  }
  if (type === "entity.too.large" || type === "parameters.too.many") {
    return next(new HttpError(413));
  }
  if (type === "encoding.unsupported" || type === "charset.unsupported") {
    return next(new HttpError(415));
  }

  next(error);
};

const handleCustomError = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof HttpError) {
    return next(error);
  }

  let status;
  let data;

  if (error instanceof NotFoundError) {
    status = 404;
  } else if (error instanceof AlreadyExistsError) {
    status = 409;
  } else if (error instanceof AuthenticationError) {
    status = 401;
  } else if (error instanceof ConflictError) {
    status = 409;
  } else if (error instanceof ValidationError) {
    status = 400;
    data = error.data;
  } else if (error instanceof NotPermittedError) {
    status = 403;
  } else if (error instanceof RemoveOwnerError) {
    status = 403;
  } else if (
    error instanceof TooManyLists ||
    error instanceof TooManyProducts
  ) {
    status = 403;
  } else {
    return next(error);
  }

  const httpError = new HttpError(status, error.message);
  httpError.code = error.code;
  httpError.data = data;
  next(httpError);
};

const handleHttpError = (
  error: unknown,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  const isHttpError = error instanceof HttpError;
  const status = isHttpError ? error.status : 500;

  if (!isHttpError) {
    logger.error(error);
    Sentry.captureException(error);
  }

  if (!isHttpError || error.message === "") {
    res.status(status).send();
  } else {
    res.status(status).json({
      error: {
        code: error.code,
        message: error.message,
        data: error.data,
      },
    });
  }
};

const errorHandlers = [handleKnownErrors, handleCustomError, handleHttpError];

export default { handleNotFound, errorHandlers };
