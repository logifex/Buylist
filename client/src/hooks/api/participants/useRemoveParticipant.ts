import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "../../../services/ListService";
import ListQueryKeys from "../../../constants/QueryKeys";
import { toast } from "react-toastify";

const useRemoveParticipant = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ participantId }: { participantId: string }) =>
      ListService.removeParticipant(listId, participantId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ListQueryKeys.detailParticipants(listId),
      });
    },
    onError: (err) => {
      toast.error("שגיאה בהסרת משתתף");
      console.log(err.message);
    },
  });
};

export default useRemoveParticipant;
