import type { Request } from "express";
import type { AppSocket } from "../types/socketTypes.js";
import { ParticipantService } from "../services/index.js";
import { logger } from "../config/index.js";
import { assertUser } from "../utils/index.js";
import { ListNotFoundError, ValidationError } from "../errors/index.js";
import CustomError from "../errors/CustomError.js";

const joinListRoom = async function (this: AppSocket, listId: unknown) {
  const req = this.request as Request;
  const user = assertUser(req.user);
  this.data.user = user;

  try {
    if (typeof listId !== "string") {
      throw new ValidationError("Invalid list id");
    }

    const roomName = `listRoom-${listId}`;
    if (this.rooms.has(roomName)) {
      return;
    }

    const role = await ParticipantService.getParticipantRole(listId, user.id);

    if (!role) {
      throw new ListNotFoundError();
    }

    await this.join(roomName);
  } catch (err) {
    if (err instanceof CustomError) {
      return this.emit("error", err.message);
    }

    logger.error(err);
    this.emit("error", "Server error for joining list");
  }
};

const leaveListRoom = async function (this: AppSocket, listId: unknown) {
  try {
    if (typeof listId !== "string") {
      throw new ValidationError("Invalid list id");
    }

    const roomName = `listRoom-${listId}`;
    await this.leave(roomName);
  } catch (err) {
    if (err instanceof CustomError) {
      return this.emit("error", err.message);
    }

    logger.error(err);
  }
};

export default { joinListRoom, leaveListRoom };
