import { Prisma } from "@prisma/client";
import { participantDetailsSelect } from "../utils/selects";

const participantDetails = Prisma.validator<Prisma.ListsOnUsersDefaultArgs>()({
  select: participantDetailsSelect,
});

export type ParticipantDetails = Prisma.ListsOnUsersGetPayload<
  typeof participantDetails
>;
