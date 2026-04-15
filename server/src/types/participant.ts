import type { ListsOnUsersGetPayload } from "../generated/prisma/models/ListsOnUsers.js";
import { participantDetailsSelect } from "../utils/selects.js";

export type ParticipantDetails = ListsOnUsersGetPayload<{
  select: typeof participantDetailsSelect;
}>;
