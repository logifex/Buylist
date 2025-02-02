import { z } from "zod";
import { Base64 } from "js-base64";

export const inviteTokenParamSchema = z.object({
  inviteToken: z
    .string()
    .length(22, "Invalid length")
    .refine(Base64.isValid, { message: "Invalid token" }),
});
