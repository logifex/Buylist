import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import InvitationService from "@/services/InvitationService";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useCreateTokenInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sharedListId }: { sharedListId: string }) =>
      InvitationService.createTokenInvitation(sharedListId),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ListQueryKeys.detailTokenInvitation(variables.sharedListId),
        data,
      );
    },
    onError: (err) => {
      Toast.show({ type: "base", text1: "שגיאה ביצירת הזמנה" });
      console.log(err.message);
    },
  });
};

export default useCreateTokenInvitation;
