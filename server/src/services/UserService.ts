import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../config";
import { UserDetails, UserInput } from "../types/user";
import { userDetailsSelect } from "../utils/selects";
import { NotFoundError } from "../errors";
import { Prisma } from "@prisma/client";
import SocketService from "./SocketService";

const getUser = (userId: string): Promise<UserDetails | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: userDetailsSelect,
  });
};

const upsertUser = (userInput: UserInput): Promise<UserDetails> => {
  const { id, email, name, photoUrl } = userInput;

  return prisma.user.upsert({
    where: { id: id },
    update: { email: email, name: name, photoUrl: photoUrl },
    create: { id: id, email: email, name: name, photoUrl: photoUrl },
    select: userDetailsSelect,
  });
};

const deleteUser = async (userId: string): Promise<void> => {
  try {
    const where = {
      participants: { some: { userId: userId, role: "OWNER" } },
    } satisfies Prisma.ListWhereInput;

    const [lists] = await prisma.$transaction(
      [
        prisma.list.findMany({
          where: where,
          select: { id: true },
        }),
        prisma.list.deleteMany({
          where: where,
        }),
        prisma.user.delete({ where: { id: userId } }),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    for (const list of lists) {
      SocketService.emitListDelete(list.id);
    }
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new NotFoundError();
      }
    }
    throw err;
  }
};

export default { getUser, upsertUser, deleteUser };
