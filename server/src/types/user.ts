import type {
  UserCreateWithoutListsInput,
  UserGetPayload,
} from "../generated/prisma/models/User.js";
import { z } from "zod";
import { userIdParamSchema } from "../schemas/userSchema.js";
import { userDetailsSelect, userIdSelect } from "../utils/selects.js";

export type UserDetails = UserGetPayload<{ select: typeof userDetailsSelect }>;
export type RequestUser = UserGetPayload<{ select: typeof userIdSelect }>;
export type UserInput = UserCreateWithoutListsInput;

export type UserIdParam = z.infer<typeof userIdParamSchema>;
