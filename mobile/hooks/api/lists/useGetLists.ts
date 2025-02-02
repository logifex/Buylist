import { useQuery } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useGetLists = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ListQueryKeys.all,
    enabled: enabled,
    queryFn: () => ListService.fetchLists(),
    refetchOnReconnect: "always",
    refetchOnWindowFocus: "always",
    meta: { persist: true },
  });
};

export default useGetLists;
