import { useQuery } from "@tanstack/react-query";
import InvitationService from "@/services/InvitationService";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useGetTokenInvitation = ({
  listId,
  enabled,
}: {
  listId: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ListQueryKeys.detailTokenInvitation(listId),
    enabled: enabled,
    refetchOnMount: "always",
    queryFn: () => InvitationService.getTokenInvitation(listId),
    retry: 0,
  });
};

export default useGetTokenInvitation;
