import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "../../../services/ListService";
import List, { ListInput } from "../../../models/List";
import ListQueryKeys from "../../../constants/QueryKeys";
import { toast } from "react-toastify";

const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ list }: { list: ListInput }) => ListService.createList(list),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(
        ListQueryKeys.all,
        (prevLists: List[] | undefined) =>
          prevLists ? [...prevLists, data] : [data]
      );
    },
    onError: (err) => {
      toast("שגיאה ביצירת רשימה");
      console.log(err.message);
    },
  });
};

export default useCreateList;
