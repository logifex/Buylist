import { Router } from "express";
import inviteRoutes from "./inviteRoutes.js";
import { ParticipantController } from "../controllers/index.js";
import { verifyListAccess } from "../middlewares/index.js";

const router = Router({ mergeParams: true });

router.use("/invite", inviteRoutes);

router
  .route("/")
  .get(verifyListAccess(), ParticipantController.getParticipants);

router
  .route("/:userId")
  .delete(verifyListAccess(), ParticipantController.removeParticipant);

export default router;
