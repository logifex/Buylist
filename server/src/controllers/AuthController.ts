import type { Request, Response } from "express";
import { UserService } from "../services/index.js";
import { assertUser } from "../utils/index.js";

const deleteUser = async (req: Request, res: Response) => {
  const user = assertUser(req.user);
  await UserService.deleteUser(user.id);

  res.status(204).send();
};

export default { deleteUser };
