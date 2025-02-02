import { z } from "zod";
import {
  createProductInputSchema,
  editProductInputSchema,
  productIdParamSchema,
} from "../schemas/productSchema";
import { Prisma } from "@prisma/client";
import { productDetailsSelect } from "../utils/selects";

const productDetails = Prisma.validator<Prisma.ProductDefaultArgs>()({
  select: productDetailsSelect,
});

export type ProductDetails = Prisma.ProductGetPayload<typeof productDetails>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type EditProductInput = z.infer<typeof editProductInputSchema>;

export type ProductIdParam = z.infer<typeof productIdParamSchema>;
