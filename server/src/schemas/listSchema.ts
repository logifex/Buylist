import { z } from "zod";
import { Color } from "../generated/prisma/enums.js";
import { createProductInputSchema } from "./productSchema.js";

const baseListSchema = z.object({
  id: z.uuid({ error: "Value has to be a valid ID" }),
  name: z.string().trim().min(1).max(50),
  color: z.string().trim().toUpperCase().pipe(z.enum(Color)),
  products: z.array(createProductInputSchema),
});

export const createListInputSchema = z.object({
  name: baseListSchema.shape.name,
  color: baseListSchema.shape.color.optional(),
  products: baseListSchema.shape.products.optional(),
});

export const editListInputSchema = baseListSchema
  .pick({
    name: true,
    color: true,
  })
  .partial()
  .refine(
    (fields) => Object.values(fields).some((f: unknown) => f !== undefined),
    {
      error: "No edit fields provided",
    },
  );

export const listIdParamSchema = z.object({
  listId: baseListSchema.shape.id,
});
