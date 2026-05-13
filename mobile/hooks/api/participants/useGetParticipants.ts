import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { SharedList } from "@/models/List";
import { ListQueryKeys } from "@/constants/QueryKeys";

export const participantsQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ListQueryKeys.detailParticipants(listId),
    queryFn: () => ListService.fetchParticipants(listId),
    refetchOnMount: "always",
    meta: { persist: true },
  });

export const useGetParticipants = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    ...participantsQueryOptions(listId),
    initialData: () => {
      const list = queryClient.getQueryData<SharedList | undefined>(
        ListQueryKeys.detail(listId),
      );
      return list?.participants;
    },
  });
};
