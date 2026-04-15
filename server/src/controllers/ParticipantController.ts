import type { NextFunction, Request, Response } from "express";
import type { ListIdParam } from "../types/list.js";
import type { UserIdParam } from "../types/user.js";
import type { ParticipantDetails } from "../types/participant.js";
import { ParticipantService } from "../services/index.js";
import { NotPermittedError } from "../errors/index.js";

const getParticipants = async (
  req: Request<ListIdParam, object, object>,
  res: Response<ParticipantDetails[]>,
) => {
  const { listId } = req.params;

  const participants = await ParticipantService.getParticipants(listId);

  res.status(200).send(participants);
};

const removeParticipant = async (
  req: Request<ListIdParam & UserIdParam, object, object>,
  res: Response<void>,
  next: NextFunction,
) => {
  const { listId, userId } = req.params;
  const { role, user } = req;
  const isCurrentUser = userId === user?.id;

  if (!isCurrentUser && role !== "OWNER") {
    return next(
      new NotPermittedError("Only the owner can remove other participants"),
    );
  }

  await ParticipantService.removeParticipant(listId, userId);

  res.status(204).send();
};

export default { getParticipants, removeParticipant };
