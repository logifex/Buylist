import type { Request, Response } from "express";
import { env } from "../config/index.js";

const getInstanceId = (
  req: Request,
  res: Response<{ instanceId: string | undefined }>,
) => {
  res.status(200).json({ instanceId: env.flyMachineId });
};

export default {
  getInstanceId,
};
