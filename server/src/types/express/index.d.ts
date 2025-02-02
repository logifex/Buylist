import "express";
import { RequestUser } from "../user";
import { ListDetails, FullList } from "../list";
import { Role } from "@prisma/client";

declare global {
  namespace Express {
    export interface Request {
      role?: Role;
      user?: RequestUser;
    }
  }
}
