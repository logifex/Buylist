import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  fullListSelect,
  listDetailsSelect,
  listPreviewSelect,
} from "../utils/selects";
import {
  createListInputSchema,
  editListInputSchema,
  listIdParamSchema,
} from "../schemas/listSchema";

const listDetails = Prisma.validator<Prisma.ListDefaultArgs>()({
  select: listDetailsSelect,
});

const fullList = Prisma.validator<Prisma.ListDefaultArgs>()({
  select: fullListSelect,
});

const listPreview = Prisma.validator<Prisma.ListDefaultArgs>()({
  select: listPreviewSelect,
});

export type ListDetails = Prisma.ListGetPayload<typeof listDetails>;
export type FullList = Prisma.ListGetPayload<typeof fullList>;
export type ListPreview = Prisma.ListGetPayload<typeof listPreview>;
export type CreateListInput = z.infer<typeof createListInputSchema>;
export type EditListInput = z.infer<typeof editListInputSchema>;

export type ListIdParam = z.infer<typeof listIdParamSchema>;
