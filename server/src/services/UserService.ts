import type { UserDetails, UserInput } from "../types/user.js";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace.js";
import { firebase, prisma, pubClient } from "../config/index.js";
import { userDetailsSelect } from "../utils/selects.js";
import { NotFoundError } from "../errors/index.js";
import { Prisma } from "../generated/prisma/client.js";
import SocketService from "./SocketService.js";

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

    await pubClient.set(`deletedUser:${userId}`, "1", "EX", 60 * 60);
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
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    await firebase.auth().deleteUser(userId);

    for (const list of lists) {
      SocketService.emitListDelete(list.id);
    }
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new NotFoundError();
      }
      await pubClient.del(`deletedUser:${userId}`);
    }

    throw err;
  }
};

export default { getUser, upsertUser, deleteUser };
