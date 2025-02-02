import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { useContext } from "react";
import AuthContext from "@/store/auth-context";
import { ApiError } from "@/models/Error";
import { SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useLeaveList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();
  const { userInfo } = useContext(AuthContext);

  return useMutation({
    networkMode: "always",
    mutationFn: () => {
      if (!userInfo) {
        throw new ApiError("No user logged in", 401);
      }
      return ListService.removeParticipant(listId, userInfo.id);
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(
        ListQueryKeys.all,
        (previousLists: SharedList[]) =>
          previousLists.filter((l) => l.id !== listId),
      );
      queryClient.removeQueries({ queryKey: ListQueryKeys.detail(listId) });
    },
    onError: (err) => {
      console.log(err.message);
      Toast.show({
        type: "base",
        text1:
          "שגיאה בעזיבת רשימה. כדאי לבדוק את החיבור לרשת או לנסות שוב מאוחר יותר",
      });
    },
  });
};

export default useLeaveList;
