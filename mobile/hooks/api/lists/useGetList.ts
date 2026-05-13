import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { SharedList } from "@/models/List";
import { ListQueryKeys } from "@/constants/QueryKeys";

export const listQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ListQueryKeys.detail(listId),
    queryFn: () => ListService.fetchList(listId),
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    refetchOnMount: "always",
    meta: { persist: true },
  });

export const useGetList = ({
  listId,
  enabled,
}: {
  listId: string;
  enabled: boolean;
}) => {
  const queryClient = useQueryClient();

  return useQuery({
    ...listQueryOptions(listId),
    enabled: enabled,
    initialData: () => {
      const lists = queryClient.getQueryData<SharedList[] | undefined>(
        ListQueryKeys.all,
      );
      return lists?.find((l) => l.id === listId);
    },
  });
};
