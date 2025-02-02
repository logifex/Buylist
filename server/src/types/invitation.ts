import { Prisma } from "@prisma/client";
import { inviteTokenParamSchema } from "../schemas/invitationSchema";
import { z } from "zod";
import { tokenInvitationDetailsSelect } from "../utils/selects";

const tokenInvitationDetails =
  Prisma.validator<Prisma.ListTokenInvitationDefaultArgs>()({
    select: tokenInvitationDetailsSelect,
  });

export type TokenInvitationDetails = Prisma.ListTokenInvitationGetPayload<
  typeof tokenInvitationDetails
>;
export type InviteTokenParam = z.infer<typeof inviteTokenParamSchema>;
