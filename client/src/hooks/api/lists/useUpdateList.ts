import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "../../../services/ListService";
import List, { ListInput } from "../../../models/List";
import ListQueryKeys from "../../../constants/QueryKeys";
import { toast } from "react-toastify";

const useUpdateList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ list }: { list: ListInput }) =>
      ListService.updateList(listId, { name: list.name, color: list.color }),
    onSuccess: (data) => {
      const newList = queryClient.setQueryData<List | undefined>(
        ListQueryKeys.detail(listId),
        (prevList) => prevList && { ...prevList, ...data }
      );
      queryClient.setQueryData(
        ListQueryKeys.all,
        (prevLists: List[] | undefined) =>
          prevLists?.map((l) => (l.id === listId ? newList : l))
      );
    },
    onError: (err) => {
      toast.error("שגיאה בעריכת פרטי הרשימה");
      console.log(err.message);
    },
  });
};

export default useUpdateList;
