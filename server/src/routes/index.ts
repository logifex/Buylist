import { Router } from "express";
import listRoutes from "./listRoutes.js";
import authRoutes from "./authRoutes.js";
import { decodeInviteToken } from "../middlewares/index.js";
import { InfoController, InvitationController } from "../controllers/index.js";

const router = Router();

router.use("/api/lists", listRoutes);

router.use("/api/auth", authRoutes);

router.get("/api/instance-id", InfoController.getInstanceId);

router.get(
  "/invite/:inviteToken",
  decodeInviteToken,
  InvitationController.getInvitePage,
);

export default router;
