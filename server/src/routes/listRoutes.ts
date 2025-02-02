import { Router } from "express";
import { ListController } from "../controllers";
import productRoutes from "./productRoutes";
import participantRoutes from "./participantRoutes";
import {
  createListInputSchema,
  editListInputSchema,
} from "../schemas/listSchema";
import { inviteTokenParamSchema } from "../schemas/invitationSchema";
import {
  acceptJson,
  decodeInviteToken,
  verifyListAccess,
  validateRequest,
  authenticate,
} from "../middlewares";

const router = Router();

router.use(authenticate);

router.use("/:listId/products", productRoutes);

router.use("/:listId/participants", participantRoutes);

router
  .route("/join/:inviteToken")
  .get(
    validateRequest({ params: inviteTokenParamSchema }),
    decodeInviteToken,
    ListController.getJoinList
  )
  .post(
    validateRequest({ params: inviteTokenParamSchema }),
    decodeInviteToken,
    ListController.postJoinList
  );

router
  .route("/")
  .get(ListController.getLists)
  .post(
    acceptJson,
    validateRequest({ body: createListInputSchema }),
    ListController.postList
  );

router
  .route("/:listId")
  .get(verifyListAccess(), ListController.getList)
  .patch(
    verifyListAccess(),
    acceptJson,
    validateRequest({ body: editListInputSchema }),
    ListController.patchList
  )
  .delete(verifyListAccess("OWNER"), ListController.deleteList);

export default router;
