import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import Toast from "react-native-toast-message";
import { ListQueryKeys } from "@/constants/QueryKeys";

const useRemoveParticipant = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    networkMode: "always",
    mutationFn: ({ participantId }: { participantId: string }) =>
      ListService.removeParticipant(listId, participantId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ListQueryKeys.detailParticipants(listId),
      });
    },
    onError: (err) => {
      console.log(err.message);
      Toast.show({
        type: "base",
        text1:
          "שגיאה בהסרת משתתף. כדאי לבדוק את החיבור לרשת או לנסות שוב מאוחר יותר",
      });
    },
  });
};

export default useRemoveParticipant;
