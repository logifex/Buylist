import { useMutation, useQueryClient } from "@tanstack/react-query";
import Product from "@/models/Product";
import { SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import ProductService from "@/services/ProductService";
import { ListMutationKeys, ListQueryKeys } from "@/constants/QueryKeys";

export type UpdateProductVariables = { listId: string; product: Product };
export type UpdateProductContext =
  | { prevProduct: Product | undefined }
  | undefined;

export const updateProductDefaultMutationFn = async ({
  listId,
  product,
}: UpdateProductVariables) => {
  return ProductService.updateProduct(listId, product);
};

export const updateProductDefaultOnError = (
  err: Error,
  variables: UpdateProductVariables,
  context: UpdateProductContext,
) => {
  console.log(err.message);
  Toast.show({
    type: "base",
    text1: `שגיאה בעריכת המוצר '${context?.prevProduct?.name}'`,
  });
};

const useUpdateProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ListMutationKeys.productUpdate(),
    meta: { persist: true },
    mutationFn: updateProductDefaultMutationFn,
    onMutate: async ({ product }) => {
      const previousList = queryClient.getQueryData<SharedList | undefined>(
        ListQueryKeys.detail(listId),
      );
      const prevProduct = previousList?.products.find(
        (p) => p.id === product.id,
      );
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) =>
          prevList && {
            ...prevList,
            products: prevList.products.map((p) =>
              p.id === product.id ? product : p,
            ),
          },
      );

      return { prevProduct };
    },
    onSuccess: (data, { product }) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) =>
          prevList && {
            ...prevList,
            products: prevList.products.map((p) =>
              p.id === product.id ? { ...p, isSynced: true } : p,
            ),
          },
      );
    },
    onError: (err, variables, context) => {
      updateProductDefaultOnError(err, variables, context);

      if (!context) {
        return;
      }

      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) =>
          prevList && {
            ...prevList,
            products: prevList.products.map((p) =>
              p.id === variables.product.id ? context.prevProduct : p,
            ),
          },
      );
    },
  });
};

export default useUpdateProduct;
