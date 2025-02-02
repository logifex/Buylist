import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import InvitationService from "../../../services/InvitationService";

const useJoinList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ token }: { token: string }) =>
      InvitationService.joinList(token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ListQueryKeys.all });
    },
  });
};

export default useJoinList;
