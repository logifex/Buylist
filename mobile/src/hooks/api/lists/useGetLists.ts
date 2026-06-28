import { queryOptions, useQuery } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { ListQueryKeys } from "@/constants/QueryKeys";

export const listsQueryOptions = queryOptions({
  queryKey: ListQueryKeys.all,
  queryFn: () => ListService.fetchLists(),
  refetchOnReconnect: "always",
  refetchOnWindowFocus: "always",
  meta: { persist: true },
});

export const useGetLists = ({ enabled }: { enabled: boolean }) => {
  return useQuery({ ...listsQueryOptions, enabled: enabled });
};
