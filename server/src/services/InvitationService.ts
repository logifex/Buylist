import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../config";
import {
  InvitationAlreadyExistsError,
  InvitationNotFoundError,
  ListNotFoundError,
} from "../errors";
import { TokenInvitationDetails } from "../types/invitation";
import { ListPreview } from "../types/list";
import { tokenInvitationDetailsSelect } from "../utils/selects";
import ListService from "./ListService";
import ParticipantService from "./ParticipantService";

const TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 3;

const getTokenInvitationByList = (
  listId: string
): Promise<TokenInvitationDetails | null> => {
  return prisma.listTokenInvitation.findUnique({
    where: {
      listId: listId,
    },
    select: tokenInvitationDetailsSelect,
  });
};

const createTokenInvitation = async (
  listId: string
): Promise<TokenInvitationDetails> => {
  try {
    const expiryTimestamp = new Date(Date.now() + TOKEN_EXPIRY);
    const invitation = await prisma.listTokenInvitation.create({
      data: { listId: listId, expiry: expiryTimestamp },
      select: tokenInvitationDetailsSelect,
    });

    return invitation;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        throw new InvitationAlreadyExistsError();
      }
      if (err.code === "P2003") {
        throw new ListNotFoundError();
      }
    }
    throw err;
  }
};

const deleteTokenInvitationByList = async (listId: string): Promise<void> => {
  try {
    await prisma.listTokenInvitation.delete({ where: { listId: listId } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new InvitationNotFoundError();
      }
    }
    throw err;
  }
};

const getListIdFromInviteToken = async (
  token: string
): Promise<string | null> => {
  const invitation = await prisma.listTokenInvitation.findUnique({
    where: { token: token, expiry: { gt: new Date() } },
    select: { listId: true },
  });

  return invitation?.listId ?? null;
};

const getListInfoFromInviteToken = async (
  token: string
): Promise<ListPreview | null> => {
  const listId = await getListIdFromInviteToken(token);

  if (!listId) {
    return null;
  }

  const listInfo = await ListService.getListPreview(listId);

  return listInfo;
};

const joinListFromInviteToken = async (
  token: string,
  userId: string
): Promise<string> => {
  const listId = await getListIdFromInviteToken(token);

  if (!listId) {
    throw new InvitationNotFoundError();
  }

  await ParticipantService.addParticipant(listId, userId);

  return listId;
};

export default {
  getTokenInvitationByList,
  createTokenInvitation,
  deleteTokenInvitationByList,
  getListIdFromInviteToken,
  getListInfoFromInviteToken,
  joinListFromInviteToken,
};
