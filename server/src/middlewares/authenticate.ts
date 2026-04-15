import type { NextFunction, Request, Response } from "express";
import type { DecodedIdToken } from "firebase-admin/auth";
import { UserService } from "../services/index.js";
import { AuthenticationError } from "../errors/index.js";
import { firebase, pubClient } from "../config/index.js";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization?.startsWith("Bearer ")) {
    return next(new AuthenticationError());
  }

  const idToken = req.headers.authorization.split("Bearer ")[1];

  try {
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    const {
      uid: id,
      email,
      name,
      picture: photoUrl,
    } = decodedToken as DecodedIdToken & { name?: string };

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
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
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
