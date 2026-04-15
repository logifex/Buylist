import type { NextFunction, Request, Response } from "express";
import { decodeUuidFromBase64Url } from "../utils/index.js";

const decodeInviteToken = (
  req: Request<{ inviteToken: string }, unknown, unknown>,
  res: Response,
  next: NextFunction,
) => {
  const shortenedToken = req.params.inviteToken;
  const token = decodeUuidFromBase64Url(shortenedToken);

  req.params.inviteToken = token;
  next();
};

export default decodeInviteToken;
