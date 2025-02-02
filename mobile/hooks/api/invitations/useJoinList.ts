import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SharedList } from "@/models/List";
import InvitationService from "@/services/InvitationService";
import Toast from "react-native-toast-message";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useJoinList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: "always",
    mutationFn: async ({ token }: { token: string }) =>
      InvitationService.joinList(token),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
        prevLists ? [...prevLists, data] : [data],
      );
    },
    onError: (err) => {
      console.log(err.message);
      Toast.show({
        type: "base",
        text1: "שגיאה בהצטרפות לרשימה",
      });
    },
  });
};

export default useJoinList;
