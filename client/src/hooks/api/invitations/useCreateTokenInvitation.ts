import { useMutation, useQueryClient } from "@tanstack/react-query";
import InvitationService from "../../../services/InvitationService";
import ListQueryKeys from "../../../constants/QueryKeys";
import { toast } from "react-toastify";

const useCreateTokenInvitation = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => InvitationService.createTokenInvitation(listId),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ListQueryKeys.detailTokenInvitation(listId),
        data
      );
    },
    onError: (err) => {
      toast("שגיאה ביצירת הזמנה");
      console.log(err.message);
    },
  });
};

export default useCreateTokenInvitation;
