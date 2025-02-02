import { Router } from "express";
import inviteRoutes from "./inviteRoutes";
import { ParticipantController } from "../controllers";
import { verifyListAccess } from "../middlewares";

const router = Router({ mergeParams: true });

router.use("/invite", inviteRoutes);

router
  .route("/")
  .get(verifyListAccess(), ParticipantController.getParticipants);

router
  .route("/:userId")
  .delete(verifyListAccess(), ParticipantController.removeParticipant);

export default router;
