import { Prisma } from "@prisma/client";

export const productDetailsSelect = {
  id: true,
  name: true,
  note: true,
  isChecked: true,
} satisfies Prisma.ProductSelect;

export const userDetailsSelect = {
  id: true,
  name: true,
  photoUrl: true,
} satisfies Prisma.UserSelect;

export const participantDetailsSelect = {
  user: {
    select: userDetailsSelect,
  },
  role: true,
} satisfies Prisma.ListsOnUsersSelect;

export const fullListSelect = {
  id: true,
  name: true,
  color: true,
  products: {
    orderBy: { createdAt: "asc" },
    select: productDetailsSelect,
  },
  participants: {
    orderBy: { createdAt: "asc" },
    select: participantDetailsSelect,
  },
} satisfies Prisma.ListSelect;

export const listDetailsSelect = {
  id: true,
  name: true,
  color: true,
} satisfies Prisma.ListSelect;

export const listPreviewSelect = {
  id: true,
  name: true,
} satisfies Prisma.ListSelect;

export const tokenInvitationDetailsSelect = {
  token: true,
  expiry: true,
} satisfies Prisma.ListTokenInvitationSelect;
