import { useQuery, useQueryClient } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import ListService from "../../../services/ListService";
import List from "../../../models/List";

const useGetList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ListQueryKeys.detail(listId),
    gcTime: Infinity,
    staleTime: Infinity,
    refetchOnMount: "always",
    retry: false,
    queryFn: () => ListService.fetchList(listId),
    initialData: () => {
      const lists: List[] | undefined = queryClient.getQueryData(
        ListQueryKeys.all
      );
      return lists?.find((l) => l.id === listId);
    },
  });
};

export default useGetList;
