import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import Product, { SharedProduct } from "@/models/Product";
import ProductService from "@/services/ProductService";
import { ListMutationKeys, ListQueryKeys } from "@/constants/QueryKeys";
import { ApiError } from "@/models/Error";
import ErrorCodes from "@/constants/ErrorCodes";

export type DeleteProductVariables = { listId: string; productId: string };
export type DeleteProductContext =
  | { prevProduct: Product | undefined }
  | undefined;

export const deleteProductDefaultMutationFn = async ({
  listId,
  productId,
}: DeleteProductVariables) => {
  return ProductService.deleteProduct(listId, productId);
};

export const deleteProductDefaultOnError = (
  err: Error,
  variables: DeleteProductVariables,
  context: DeleteProductContext,
) => {
  if ((err as ApiError).error?.code === ErrorCodes.productNotFound) {
    return;
  }

  console.log(err.message);
  Toast.show({
    type: "base",
    text1: `שגיאה במחיקת המוצר '${context?.prevProduct?.name}'`,
  });
};

const useDeleteProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ListMutationKeys.productDelete(),
    meta: { persist: true },
    mutationFn: deleteProductDefaultMutationFn,
    onMutate: async ({ productId }) => {
      const previousList = queryClient.getQueryData<SharedList | undefined>(
        ListQueryKeys.detail(listId),
      );
      const prevProduct = previousList?.products.find(
        (p) => p.id === productId,
      );
      const newList = queryClient.setQueryData<SharedList | undefined>(
        ListQueryKeys.detail(listId),
        (prevList) =>
          prevList && {
            ...prevList,
            products: prevList.products.filter((p) => p.id !== productId),
          },
      );
      queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
        prevLists.map((l) => (l.id === listId ? newList : l)),
      );

      return { prevProduct };
    },
    onError: (err, variables, context) => {
      deleteProductDefaultOnError(err, variables, context);

      if (
        !context ||
        (err as ApiError).error?.code === ErrorCodes.productNotFound
      ) {
        return;
      }

      if ((context.prevProduct as SharedProduct).isSynced) {
        const newList = queryClient.setQueryData<SharedList | undefined>(
          ListQueryKeys.detail(listId),
          (prevList) =>
            prevList &&
            context.prevProduct && {
              ...prevList,
              products: [...prevList.products, context.prevProduct],
            },
        );
        queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
          prevLists.map((l) => (l.id === listId ? newList : l)),
        );
      }
    },
  });
};

export default useDeleteProduct;
