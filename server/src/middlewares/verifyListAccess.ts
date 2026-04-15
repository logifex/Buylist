import type { NextFunction, Request, Response } from "express";
import type { ListIdParam } from "../types/list.js";
import { Role } from "../generated/prisma/enums.js";
import { ListNotFoundError, NotPermittedError } from "../errors/index.js";
import { ParticipantService } from "../services/index.js";
import { assertUser } from "../utils/index.js";

const verifyListAccess =
  (role?: Role) =>
  async (
    req: Request<ListIdParam, unknown, unknown>,
    res: Response,
    next: NextFunction,
  ) => {
    const user = assertUser(req.user);
    const { listId } = req.params;

    const accessRole = await ParticipantService.getParticipantRole(
      listId,
      user.id,
    );

    if (!accessRole) {
      return next(new ListNotFoundError());
    }

    if (role === "OWNER" && accessRole !== role) {
      return next(
        new NotPermittedError("Only the owner can perform this action"),
      );
    }

    req.role = accessRole;
    next();
  };

export default verifyListAccess;
