import { Router } from "express";
import { ListController } from "../controllers/index.js";
import productRoutes from "./productRoutes.js";
import participantRoutes from "./participantRoutes.js";
import {
  createListInputSchema,
  editListInputSchema,
} from "../schemas/listSchema.js";
import { inviteTokenParamSchema } from "../schemas/invitationSchema.js";
import {
  acceptJson,
  decodeInviteToken,
  verifyListAccess,
  validateRequest,
  authenticate,
} from "../middlewares/index.js";

const router = Router();

router.use(authenticate);

router.use("/:listId/products", productRoutes);

router.use("/:listId/participants", participantRoutes);

router
  .route("/join/:inviteToken")
  .get(
    validateRequest({ params: inviteTokenParamSchema }),
    decodeInviteToken,
    ListController.getJoinList,
  )
  .post(
    validateRequest({ params: inviteTokenParamSchema }),
    decodeInviteToken,
    ListController.postJoinList,
  );

router
  .route("/")
  .get(ListController.getLists)
  .post(
    acceptJson,
    validateRequest({ body: createListInputSchema }),
    ListController.postList,
  );

router
  .route("/:listId")
  .get(verifyListAccess(), ListController.getList)
  .patch(
    verifyListAccess(),
    acceptJson,
    validateRequest({ body: editListInputSchema }),
    ListController.patchList,
  )
  .delete(verifyListAccess("OWNER"), ListController.deleteList);

export default router;
