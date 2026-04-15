import "express";
import type { RequestUser } from "../user.ts";
import type { Role } from "../../generated/prisma/enums.ts";

declare global {
  namespace Express {
    export interface Request {
      role?: Role;
      user?: RequestUser;
    }
  }
}
