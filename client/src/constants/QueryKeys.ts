const ListQueryKeys = {
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

export default ListQueryKeys;
