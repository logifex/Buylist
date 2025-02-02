import { NextFunction, Request, Response } from "express";
import { authenticate } from "../../middlewares";

export const authenticateSocket = (
  req: Request & { _query: Record<string, string> },
  res: Response,
  next: NextFunction
) => {
  const isHandshake = !req._query.sid;
  if (isHandshake) {
    authenticate(req, res, next);
  } else {
    next();
  }
};
