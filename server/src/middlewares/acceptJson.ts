import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors";
import bodyParser from "body-parser";

const acceptOnlyJson = (req: Request, res: Response, next: NextFunction) => {
  if (!req.is("json")) {
    return next(new HttpError(415, "Only JSON request is supported"));
  }

  next();
};

const acceptJson = [acceptOnlyJson, bodyParser.json()];

export default acceptJson;
