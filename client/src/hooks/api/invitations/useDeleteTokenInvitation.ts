import { useMutation, useQueryClient } from "@tanstack/react-query";
import InvitationService from "../../../services/InvitationService";
import ListQueryKeys from "../../../constants/QueryKeys";
import { toast } from "react-toastify";

const useDeleteTokenInvitation = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => InvitationService.deleteTokenInvitation(listId),
    onSuccess: async () => {
      await queryClient.cancelQueries({
        queryKey: ListQueryKeys.detailTokenInvitation(listId),
      });
      queryClient.removeQueries({
        queryKey: ListQueryKeys.detailTokenInvitation(listId),
      });
    },
    onError: (err) => {
      toast.error("שגיאה במחיקת הזמנה");
      console.log(err.message);
    },
  });
};

export default useDeleteTokenInvitation;
