import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "../../../services/ListService";
import ListQueryKeys from "../../../constants/QueryKeys";
import List from "../../../models/List";

const useDeleteList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ListService.deleteList(listId),
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(
        ListQueryKeys.all,
        (previousLists: List[] | undefined) =>
          previousLists?.filter((l) => l.id !== listId)
      );
      queryClient.removeQueries({ queryKey: ListQueryKeys.detail(listId) });
    },
  });
};

export default useDeleteList;
