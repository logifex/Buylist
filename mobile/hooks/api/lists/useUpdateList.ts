import { useMutation, useQueryClient } from "@tanstack/react-query";
import ListService from "@/services/ListService";
import { ListInput, SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import { ListMutationKeys, ListQueryKeys } from "@/constants/QueryKeys";

export type UpdateListVariables = { listId: string; list: ListInput };
export type UpdateListContext =
  | { previousList: SharedList | undefined }
  | undefined;

export const updateListDefaultMutationFn = ({
  listId,
  list,
}: UpdateListVariables) => {
  return ListService.updateList(listId, { name: list.name, color: list.color });
};

export const updateListDefaultOnError = (
  err: Error,
  variables: UpdateListVariables,
  context: UpdateListContext,
) => {
  const previousList = context?.previousList;
  console.log(err.message);
  Toast.show({
    type: "base",
    text1: `שגיאה בעריכת פרטי הרשימה '${previousList?.name}'`,
  });
};

const useUpdateList = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateListDefaultMutationFn,
    mutationKey: ListMutationKeys.update(),
    meta: { persist: true },
    onMutate: async ({ list }) => {
      const previousList: SharedList | undefined = queryClient.getQueryData(
        ListQueryKeys.detail(listId),
      );
      const newList: SharedList | undefined = queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) => {
          return (
            prevList && {
              ...prevList,
              ...list,
            }
          );
        },
      );
      queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
        prevLists.map((l) => (l.id === listId ? newList : l)),
      );

      return { previousList };
    },
    onError: (err, variables, context) => {
      updateListDefaultOnError(err, variables, context);

      if (!context?.previousList) {
        return;
      }

      const { previousList } = context;
      const previousDetails: ListInput = {
        name: previousList.name,
        color: previousList.color,
      };

      const newOldList: SharedList | undefined = queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) =>
          prevList && {
            ...prevList,
            ...previousDetails,
          },
      );
      queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
        prevLists.map((l) => (l.id === listId ? newOldList : l)),
      );
    },
  });
};

export default useUpdateList;
