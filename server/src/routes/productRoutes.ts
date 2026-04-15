import { Router } from "express";
import { ProductController } from "../controllers/index.js";
import {
  createProductInputSchema,
  editProductInputSchema,
} from "../schemas/productSchema.js";
import {
  acceptJson,
  verifyListAccess,
  validateRequest,
} from "../middlewares/index.js";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    verifyListAccess(),
    acceptJson,
    validateRequest({ body: createProductInputSchema }),
    ProductController.postProduct,
  );

router
  .route("/:productId")
  .patch(
    verifyListAccess(),
    ProductController.checkProductExists,
    acceptJson,
    validateRequest({ body: editProductInputSchema }),
    ProductController.patchProduct,
  )
  .delete(verifyListAccess(), ProductController.deleteProduct);

export default router;
