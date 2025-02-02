import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useDeleteList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: "always",
    mutationFn: () => ListService.deleteList(listId),
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
          "שגיאה במחיקת רשימה. כדאי לבדוק את החיבור לרשת או לנסות שוב מאוחר יותר",
      });
    },
  });
};

export default useDeleteList;
