import { useQuery, useQueryClient } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import ListService from "../../../services/ListService";
import List from "../../../models/List";

const useGetParticipants = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ListQueryKeys.detailParticipants(listId),
    refetchOnMount: "always",
    queryFn: () => ListService.fetchParticipants(listId),
    initialData: () => {
      const list = queryClient.getQueryData<List | undefined>(
        ListQueryKeys.detail(listId)
      );
      return list?.participants;
    },
  });
};

export default useGetParticipants;
