import { useQuery } from "@tanstack/react-query";
import ListQueryKeys from "../../../constants/QueryKeys";
import ListService from "../../../services/ListService";

const useGetLists = () => {
  return useQuery({
    queryKey: ListQueryKeys.all,
    queryFn: () => ListService.fetchLists(),
  });
};

export default useGetLists;
