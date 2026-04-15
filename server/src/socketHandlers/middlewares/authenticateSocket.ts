import type { NextFunction, Request, Response } from "express";
import { authenticate } from "../../middlewares/index.js";

export const authenticateSocket = async (
  req: Request & { _query: Record<string, string> },
  res: Response,
  next: NextFunction,
) => {
  const isHandshake = !req._query.sid;
  if (isHandshake) {
    await authenticate(req, res, next);
  } else {
    next();
  }
};
