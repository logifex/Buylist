import { queryOptions, useQuery } from "@tanstack/react-query";
import InvitationService from "@/services/InvitationService";
import { ListQueryKeys } from "@/constants/QueryKeys";

export const tokenInvitationQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ListQueryKeys.detailTokenInvitation(listId),
    queryFn: () => InvitationService.getTokenInvitation(listId),
    refetchOnMount: "always",
    retry: 0,
  });

export const useGetTokenInvitation = ({
  listId,
  enabled,
}: {
  listId: string;
  enabled: boolean;
}) => {
  return useQuery({
    ...tokenInvitationQueryOptions(listId),
    enabled: enabled,
  });
};
