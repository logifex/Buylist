import { z } from "zod";

export const userIdParamSchema = z.object({
  userId: z.string().uuid({ message: "Value has to be a valid ID" }),
});
