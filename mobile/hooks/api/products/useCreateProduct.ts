import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ProductInput } from "@/models/Product";
import { SharedList } from "@/models/List";
import Toast from "react-native-toast-message";
import * as Crypto from "expo-crypto";
import ProductService from "@/services/ProductService";
import { ListMutationKeys, ListQueryKeys } from "@/constants/QueryKeys";
import { ApiError } from "@/models/Error";
import ErrorCodes from "@/constants/ErrorCodes";

export type CreateProductVariables = { listId: string; product: ProductInput };
export type CreateProductContext = { tempId: string } | undefined;

export const createProductDefaultMutationFn = async ({
  listId,
  product,
}: CreateProductVariables) => {
  return ProductService.createProduct(listId, product);
};

export const createProductDefaultOnError =
  (queryClient: QueryClient) =>
  (
    err: Error,
    variables: CreateProductVariables,
    context: CreateProductContext,
  ) => {
    console.log(err.message);
    const newList: SharedList | undefined = queryClient.setQueryData(
      ListQueryKeys.detail(variables.listId),
      (prevList: SharedList | undefined) =>
        prevList && {
          ...prevList,
          products: prevList.products.filter((p) => p.id !== context?.tempId),
        },
    );
    queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
      prevLists.map((l) => (l.id === variables.listId ? newList : l)),
    );
    const apiErr = err as ApiError;
    if (apiErr.error?.code === ErrorCodes.tooManyProducts) {
      Toast.show({
        type: "base",
        text1: `שגיאה ביצירת המוצר ${variables.product.name}.\nאין אפשרות ליצור עוד מוצרים ברשימה זו.`,
      });
      return;
    }
    Toast.show({
      type: "base",
      text1: `שגיאה ביצירת המוצר '${variables.product.name}'`,
    });
  };

const useCreateProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ListMutationKeys.productCreate(),
    meta: { persist: true },
    scope: { id: `${listId}-productCreate` },
    mutationFn: createProductDefaultMutationFn,
    onMutate: async ({ product }) => {
      const tempId = Crypto.randomUUID();
      const newList: SharedList | undefined = queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) => {
          return (
            prevList && {
              ...prevList,
              products: [
                ...prevList.products,
                { isChecked: false, note: null, ...product, id: tempId },
              ],
            }
          );
        },
      );
      queryClient.setQueryData(ListQueryKeys.all, (prevLists: SharedList[]) =>
        prevLists.map((l) => (l.id === listId ? newList : l)),
      );

      return { tempId: tempId };
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(variables.listId),
        (prevList: SharedList | undefined) =>
          prevList && {
            ...prevList,
            products: prevList.products
              .filter((p) => p.id !== data.id)
              .map((p) =>
                p.id === context.tempId
                  ? { ...p, id: data.id, isSynced: true }
                  : p,
              ),
          },
      );
    },
    onError: createProductDefaultOnError(queryClient),
  });
};

export default useCreateProduct;
