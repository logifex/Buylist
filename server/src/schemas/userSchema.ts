import { z } from "zod";

export const userIdParamSchema = z.object({
  userId: z.uuid({ error: "Value has to be a valid ID" }),
});
