export const ListQueryKeys = {
  all: ["lists"],
  detail: (id: string) => [...ListQueryKeys.all, id],
  detailParticipants: (id: string) => [
    ...ListQueryKeys.detail(id),
    "participants",
  ],
  detailTokenInvitation: (id: string) => [
    ...ListQueryKeys.detail(id),
    "token-invitation",
  ],
};

export const ListMutationKeys = {
  all: ["list"],
  update: () => [...ListMutationKeys.all, "update"],
  productCreate: () => [...ListMutationKeys.all, "product-create"],
  productUpdate: () => [...ListMutationKeys.all, "product-update"],
  productDelete: () => [...ListMutationKeys.all, "product-delete"],
};
