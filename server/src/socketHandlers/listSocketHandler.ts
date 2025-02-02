import { Request } from "express";
import { ParticipantService } from "../services";
import { logger } from "../config";
import { assertUser } from "../utils";
import { AppSocket } from "../types/socketTypes";
import { ListNotFoundError, ValidationError } from "../errors";
import CustomError from "../errors/CustomError";

const joinListRoom = async function (this: AppSocket, listId: unknown) {
  const socket = this;
  const req = socket.request as Request;
  const user = assertUser(req.user);
  socket.data.user = user;

  try {
    if (typeof listId !== "string") {
      throw new ValidationError("Invalid list id");
    }

    const roomName = `listRoom-${listId}`;
    if (socket.rooms.has(roomName)) {
      return;
    }

    const role = await ParticipantService.getParticipantRole(listId, user.id);

    if (!role) {
      throw new ListNotFoundError();
    }

    socket.join(roomName);
  } catch (err) {
    if (err instanceof CustomError) {
      return socket.emit("error", err.message);
    }

    logger.error(err);
    socket.emit("error", "Server error for joining list");
  }
};

const leaveListRoom = async function (this: AppSocket, listId: unknown) {
  const socket = this;

  try {
    if (typeof listId !== "string") {
      throw new ValidationError("Invalid list id");
    }

    const roomName = `listRoom-${listId}`;
    socket.leave(roomName);
  } catch (err) {
    if (err instanceof CustomError) {
      return socket.emit("error", err.message);
    }

    logger.error(err);
  }
};

export default { joinListRoom, leaveListRoom };
