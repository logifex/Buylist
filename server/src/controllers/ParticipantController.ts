import { NextFunction, Request, Response } from "express";
import { ListIdParam } from "../types/list";
import { UserIdParam } from "../types/user";
import { ParticipantService } from "../services";
import { NotPermittedError } from "../errors";
import { ParticipantDetails } from "../types/participant";

const getParticipants = async (
  req: Request<ListIdParam, {}, {}>,
  res: Response<ParticipantDetails[]>,
  next: NextFunction
) => {
  const { listId } = req.params;

  const participants = await ParticipantService.getParticipants(listId);

  res.status(200).send(participants);
};

const removeParticipant = async (
  req: Request<ListIdParam & UserIdParam, {}, {}>,
  res: Response<{}>,
  next: NextFunction
) => {
  const { listId, userId } = req.params;
  const { role, user } = req;
  const isCurrentUser = userId === user?.id;

  if (!isCurrentUser && role !== "OWNER") {
    return next(
      new NotPermittedError("Only the owner can remove other participants")
    );
  }

  await ParticipantService.removeParticipant(listId, userId);

  res.status(204).send();
};

export default { getParticipants, removeParticipant };
