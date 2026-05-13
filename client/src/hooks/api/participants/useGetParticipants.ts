import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import ListService from "../../../services/ListService";
import type { List } from "../../../models/List";

export const participantsQueryOptions = (listId: string) =>
  queryOptions({
    queryKey: ListQueryKeys.detailParticipants(listId),
    queryFn: () => ListService.fetchParticipants(listId),
    refetchOnMount: "always",
  });

export const useGetParticipants = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    ...participantsQueryOptions(listId),
    initialData: () => {
      const list = queryClient.getQueryData<List | undefined>(
        ListQueryKeys.detail(listId),
      );
      return list?.participants;
    },
  });
};
