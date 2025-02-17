import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { assertUser } from "../utils";

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = assertUser(req.user);
  await UserService.deleteUser(user.id);

  res.status(204).send();
};

export default { deleteUser };
