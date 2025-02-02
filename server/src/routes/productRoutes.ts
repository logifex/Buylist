import { Router } from "express";
import { ProductController } from "../controllers";
import {
  createProductInputSchema,
  editProductInputSchema,
} from "../schemas/productSchema";
import {
  acceptJson,
  verifyListAccess,
  validateRequest,
} from "../middlewares";

const router = Router({ mergeParams: true });

router
  .route("/")
  .post(
    verifyListAccess(),
    acceptJson,
    validateRequest({ body: createProductInputSchema }),
    ProductController.postProduct
  );

router
  .route("/:productId")
  .patch(
    verifyListAccess(),
    ProductController.checkProductExists,
    acceptJson,
    validateRequest({ body: editProductInputSchema }),
    ProductController.patchProduct
  )
  .delete(verifyListAccess(), ProductController.deleteProduct);

export default router;
