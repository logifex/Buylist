import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { AuthenticationError } from "../errors";
import { firebase, pubClient } from "../config";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return next(new AuthenticationError());
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    const { uid: id, email, name, picture: photoUrl } = decodedToken;

    if (!email || !name) {
      return next(new AuthenticationError());
    }

    req.user = { id: id };

    const deleted = await pubClient.get(`deletedUser:${id}`);
    if (deleted) {
      return next(new AuthenticationError());
    }

    await UserService.upsertUser({
      id: id,
      email: email,
      name: name,
      photoUrl: photoUrl,
    });

    next();
  } catch (err: any) {
    if (
      "code" in err &&
      typeof err.code === "string" &&
      err.code.startsWith("auth")
    ) {
      return next(new AuthenticationError());
    }

    next(err);
  }
};

export default authenticate;
