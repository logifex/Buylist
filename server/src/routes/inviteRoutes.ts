import { Router } from "express";
import { InvitationController } from "../controllers/index.js";
import { verifyListAccess } from "../middlewares/index.js";

const router = Router({ mergeParams: true });

router
  .route("/token")
  .get(verifyListAccess(), InvitationController.getInviteToken)
  .post(verifyListAccess(), InvitationController.postInviteToken)
  .delete(verifyListAccess(), InvitationController.deleteInviteToken);

export default router;
