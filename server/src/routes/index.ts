import { Router } from "express";
import listRoutes from "./listRoutes";
import { decodeInviteToken } from "../middlewares";
import { InfoController, InvitationController } from "../controllers";

const router = Router();

router.use("/api/lists", listRoutes);

router.get("/api/instance-id", InfoController.getInstanceId);

router.get(
  "/invite/:inviteToken",
  decodeInviteToken,
  InvitationController.getInvitePage
);

export default router;
