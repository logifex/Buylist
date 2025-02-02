import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import ListService from "../../../services/ListService";
import ListQueryKeys from "../../../constants/QueryKeys";
import List from "../../../models/List";
import { ApiError } from "../../../models/Error";
import AuthContext from "../../../store/auth-context";

const useLeaveList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();
  const { userInfo } = useContext(AuthContext);

  return useMutation({
    mutationFn: () => {
      if (!userInfo) {
        throw new ApiError("No user logged in", 401);
      }
      return ListService.removeParticipant(listId, userInfo.id);
    },
    onSuccess: async () => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(
        ListQueryKeys.all,
        (previousLists: List[] | undefined) =>
          previousLists?.filter((l) => l.id !== listId)
      );
      queryClient.removeQueries({ queryKey: ListQueryKeys.detail(listId) });
    },
  });
};

export default useLeaveList;
