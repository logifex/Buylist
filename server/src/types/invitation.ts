import type { ListTokenInvitationGetPayload } from "../generated/prisma/models/ListTokenInvitation.js";
import { z } from "zod";
import { inviteTokenParamSchema } from "../schemas/invitationSchema.js";
import { tokenInvitationDetailsSelect } from "../utils/selects.js";

export type TokenInvitationDetails = ListTokenInvitationGetPayload<{
  select: typeof tokenInvitationDetailsSelect;
}>;
export type InviteTokenParam = z.infer<typeof inviteTokenParamSchema>;
