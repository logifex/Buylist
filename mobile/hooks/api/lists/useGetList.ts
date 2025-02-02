import { useQuery, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { SharedList } from "@/models/List";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useGetList = ({
  listId,
  enabled,
}: {
  listId: string;
  enabled: boolean;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    enabled: enabled,
    queryKey: ListQueryKeys.detail(listId),
    queryFn: () => ListService.fetchList(listId),
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    meta: { persist: true },
    initialData: () => {
      const lists: SharedList[] | undefined = queryClient.getQueryData(
        ListQueryKeys.all,
      );
      return lists?.find((l) => l.id === listId);
    },
  });
};

export default useGetList;
