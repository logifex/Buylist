import type { ListGetPayload } from "../generated/prisma/models/List.js";
import { z } from "zod";
import {
  fullListSelect,
  listDetailsSelect,
  listPreviewSelect,
} from "../utils/selects.js";
import {
  createListInputSchema,
  editListInputSchema,
  listIdParamSchema,
} from "../schemas/listSchema.js";

export type ListDetails = ListGetPayload<{
  select: typeof listDetailsSelect;
}>;

export type FullList = ListGetPayload<{
  select: typeof fullListSelect;
}>;

export type ListPreview = ListGetPayload<{
  select: typeof listPreviewSelect;
}>;

export type CreateListInput = z.infer<typeof createListInputSchema>;
export type EditListInput = z.infer<typeof editListInputSchema>;

export type ListIdParam = z.infer<typeof listIdParamSchema>;
