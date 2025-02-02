import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import InvitationService from "@/services/InvitationService";
import { ListQueryKeys } from "@/constants/QueryKeys";

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
      console.log(err.message);
      Toast.show({
        type: "base",
        text1: "שגיאה במחיקת הזמנה",
      });
    },
  });
};

export default useDeleteTokenInvitation;
