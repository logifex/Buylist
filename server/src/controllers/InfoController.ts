import { NextFunction, Request, Response } from "express";
import { env } from "../config";

export const getInstanceId = (
  req: Request,
  res: Response<{ instanceId: string | undefined }>,
  next: NextFunction
) => {
  res.status(200).json({ instanceId: env.flyMachineId });
};

export default {
  getInstanceId,
};
