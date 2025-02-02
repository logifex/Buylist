import { useQuery, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { SharedList } from "@/models/List";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useGetParticipants = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ListQueryKeys.detailParticipants(listId),
    meta: { persist: true },
    refetchOnMount: "always",
    queryFn: () => ListService.fetchParticipants(listId),
    initialData: () => {
      const list: SharedList | undefined = queryClient.getQueryData(
        ListQueryKeys.detail(listId),
      );
      return list?.participants;
    },
  });
};

export default useGetParticipants;
