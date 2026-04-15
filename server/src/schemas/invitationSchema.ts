import { z } from "zod";

export const inviteTokenParamSchema = z.object({
  inviteToken: z
    .base64url({ error: "Invalid token" })
    .length(22, { error: "Invalid token length" }),
});
