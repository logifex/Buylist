import { z } from "zod";

const baseProductSchema = z.object({
  id: z.string().uuid({ message: "Value has to be a valid ID" }),
  name: z.string().trim().min(1).max(50),
  note: z
    .string()
    .trim()
    .max(50)
    .nullish()
    .transform((arg) => (arg !== "" ? arg : undefined)),
  isChecked: z.boolean(),
});

export const createProductInputSchema = z.object({
  name: baseProductSchema.shape.name,
  note: baseProductSchema.shape.note,
  isChecked: baseProductSchema.shape.isChecked.optional(),
});

export const editProductInputSchema = baseProductSchema
  .pick({
    name: true,
    note: true,
    isChecked: true,
  })
  .partial()
  .refine((fields) => Object.values(fields).some((f) => f !== undefined), {
    message: "No edit fields provided",
  });

export const productIdParamSchema = z.object({
  productId: baseProductSchema.shape.id,
});
