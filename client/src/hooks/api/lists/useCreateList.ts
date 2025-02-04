import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "../../../services/ListService";
import List, { ListInput } from "../../../models/List";
import ListQueryKeys from "../../../constants/QueryKeys";
import { toast } from "react-toastify";
import { ApiError } from "../../../models/Error";
import ErrorCodes from "../../../constants/ErrorCodes";

const useCreateList = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ list }: { list: ListInput }) => ListService.createList(list),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ListQueryKeys.all });
      queryClient.setQueryData(
        ListQueryKeys.all,
        (prevLists: List[] | undefined) =>
          prevLists ? [...prevLists, data] : [data]
      );
    },
    onError: (err) => {
      const apiErr = err as ApiError;
      if (apiErr.error?.code === ErrorCodes.tooManyLists) {
        toast.error(
          "אין אפשרות ליצור עוד רשימות.\nעברת את כמות הרשימות המותרת."
        );
        return;
      }
      toast.error("שגיאה ביצירת רשימה");
      console.log(err.message);
    },
  });
};

export default useCreateList;
