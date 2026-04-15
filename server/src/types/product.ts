import type { ProductGetPayload } from "../generated/prisma/models/Product.js";
import { z } from "zod";
import {
  createProductInputSchema,
  editProductInputSchema,
  productIdParamSchema,
} from "../schemas/productSchema.js";
import { productDetailsSelect } from "../utils/selects.js";

export type ProductDetails = ProductGetPayload<{
  select: typeof productDetailsSelect;
}>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type EditProductInput = z.infer<typeof editProductInputSchema>;

export type ProductIdParam = z.infer<typeof productIdParamSchema>;
