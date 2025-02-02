import { useQuery } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import InvitationService from "../../../services/InvitationService";
import { ApiError } from "../../../models/Error";
import ErrorCodes from "../../../constants/ErrorCodes";

const useGetTokenInvitation = ({ listId }: { listId: string }) => {
  return useQuery({
    queryKey: ListQueryKeys.detailTokenInvitation(listId),
    queryFn: () => InvitationService.getTokenInvitation(listId),
    retry: (_, error) => {
      const apiError = error as ApiError;
      return apiError.error?.code !== ErrorCodes.invitationNotFound;
    },
  });
};

export default useGetTokenInvitation;
