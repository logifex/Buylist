import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { ListInput, SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: "always",
    mutationFn: ({ list }: { list: ListInput }) => ListService.createList(list),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
        prevLists ? [...prevLists, data] : [data],
      );
    },
    onError: (err) => {
      console.log(err);
      Toast.show({
        type: "base",
        text1:
          "שגיאה ביצירת רשימה. כדאי לבדוק את החיבור לרשת או לנסות שוב מאוחר יותר",
      });
    },
  });
};

export default useCreateList;
