import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../config";
import {
  CreateListInput,
  EditListInput,
  FullList,
  ListDetails,
  ListPreview,
} from "../types/list";
import {
  fullListSelect,
  listDetailsSelect,
  listPreviewSelect,
} from "../utils/selects";
import SocketService from "./SocketService";
import { ListNotFoundError } from "../errors";
import { Prisma } from "@prisma/client";

const getUserLists = (userId: string): Promise<FullList[]> => {
  return prisma.list.findMany({
    orderBy: { createdAt: "asc" },
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
    },
    select: fullListSelect,
  });
};

const getList = (listId: string): Promise<FullList | null> => {
  return prisma.list.findUnique({
    where: { id: listId },
    select: fullListSelect,
  });
};

const getListPreview = (listId: string): Promise<ListPreview | null> => {
  return prisma.list.findUnique({
    where: { id: listId },
    select: listPreviewSelect,
  });
};

const createList = (
  listInput: CreateListInput,
  userId: string
): Promise<FullList> => {
  const { name, color, products } = listInput;

  let orderedProducts = products;
  if (products) {
    const start = new Date(Date.now() - products?.length);
    orderedProducts = products?.map((product, index) => ({
      ...product,
      createdAt: new Date(start.getTime() + index),
    }));
  }

  return prisma.list.create({
    data: {
      name: name,
      color: color,
      participants: {
        create: { userId: userId, role: "OWNER" },
      },
      products: orderedProducts && {
        createMany: { data: orderedProducts },
      },
    },
    select: fullListSelect,
  });
};

const editList = async (
  listId: string,
  listInput: EditListInput
): Promise<ListDetails> => {
  const { name, color } = listInput;

  try {
    const updatedList = await prisma.list.update({
      where: { id: listId },
      data: {
        name: name,
        color: color,
      },
      select: listDetailsSelect,
    });
    SocketService.emitListUpdate(listId, updatedList);

    return updatedList;
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new ListNotFoundError();
      }
    }
    throw err;
  }
};

const deleteList = async (listId: string): Promise<void> => {
  try {
    await prisma.list.delete({ where: { id: listId } });
    SocketService.emitListDelete(listId);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new ListNotFoundError();
      }
    }
    throw err;
  }
};

const deleteAllUserLists = async (userId: string): Promise<void> => {
  const where = {
    participants: { some: { userId, role: "OWNER" } },
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
    ],
    { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
  );

  for (const list of lists) {
    SocketService.emitListDelete(list.id);
  }
};

export default {
  getUserLists,
  getList,
  getListPreview,
  createList,
  editList,
  deleteList,
  deleteAllUserLists,
};
