import "express";
import { RequestUser } from "../user";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      role?: Role;
      user?: RequestUser;
    }
  }
}
