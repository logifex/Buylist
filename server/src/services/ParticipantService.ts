import { Role } from "@prisma/client";
import { prisma } from "../config";
import SocketService from "./SocketService";
import {
  ListNotFoundError,
  ParticipantAlreadyExistsError,
  ParticipantNotFoundError,
  RemoveOwnerError,
} from "../errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ParticipantDetails } from "../types/participant";
import { participantDetailsSelect } from "../utils/selects";

const getParticipants = async (
  listId: string
): Promise<ParticipantDetails[]> => {
  return prisma.listsOnUsers.findMany({
    orderBy: { createdAt: "asc" },
    where: { listId: listId },
    select: participantDetailsSelect,
  });
};

const getParticipantRole = async (
  listId: string,
  userId: string
): Promise<Role | null> => {
  const participant = await prisma.listsOnUsers.findUnique({
    where: { userId_listId: { listId: listId, userId: userId } },
    select: { role: true },
  });

  return participant?.role || null;
};

const addParticipant = async (
  listId: string,
  userId: string
): Promise<void> => {
  try {
    await prisma.listsOnUsers.create({
      data: { listId: listId, userId: userId },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new ParticipantAlreadyExistsError();
      }
      if (err.code === "P2003") {
        throw new ListNotFoundError();
      }
    }
    throw err;
  }
};

const removeParticipant = async (
  listId: string,
  userId: string
): Promise<void> => {
  // If in the future it is possible to change owner it needs to be a transaction
  const role = await getParticipantRole(listId, userId);

  if (!role) {
    throw new ParticipantNotFoundError();
  }
  if (role === "OWNER") {
    throw new RemoveOwnerError();
  }

  try {
    await prisma.listsOnUsers.delete({
      where: { userId_listId: { listId: listId, userId: userId } },
    });
    await SocketService.disconnectParticipantSocket(listId, userId);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new ParticipantNotFoundError();
      }
    }
    throw err;
  }
};

export default { getParticipants, getParticipantRole, addParticipant, removeParticipant };
