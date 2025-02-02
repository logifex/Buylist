import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { ListNotFoundError, NotPermittedError } from "../errors";
import { ListIdParam } from "../types/list";
import { ParticipantService } from "../services";
import { assertUser } from "../utils";

const verifyListAccess =
  (role?: Role) =>
  async (
    req: Request<ListIdParam, unknown, unknown>,
    res: Response,
    next: NextFunction
  ) => {
    const user = assertUser(req.user);
    const { listId } = req.params;

    const accessRole = await ParticipantService.getParticipantRole(
      listId,
      user.id
    );

    if (!accessRole) {
      return next(new ListNotFoundError());
    }

    if (role === "OWNER" && accessRole !== role) {
      return next(new NotPermittedError("Only the owner can perform this action"));
    }

    req.role = accessRole;
    next();
  };

export default verifyListAccess;
