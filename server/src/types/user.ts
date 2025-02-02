import { Prisma } from "@prisma/client";
import { userIdParamSchema } from "../schemas/userSchema";
import { z } from "zod";
import { userDetailsSelect } from "../utils/selects";

const userDetails = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: userDetailsSelect,
});
const requestUser = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: { id: true },
});

export type UserDetails = Prisma.UserGetPayload<typeof userDetails>;
export type RequestUser = Prisma.UserGetPayload<typeof requestUser>;
export type UserInput = Prisma.UserCreateWithoutListsInput;

export type UserIdParam = z.infer<typeof userIdParamSchema>;
