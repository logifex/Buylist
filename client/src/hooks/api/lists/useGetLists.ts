import { queryOptions, useQuery } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import ListService from "../../../services/ListService";

export const listsQueryOptions = queryOptions({
  queryKey: ListQueryKeys.all,
  queryFn: () => ListService.fetchLists(),
});

export const useGetLists = () => {
  return useQuery(listsQueryOptions);
};
