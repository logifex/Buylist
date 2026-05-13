import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProductInput } from "../../../models/Product";
import ProductService from "../../../services/ProductService";
import ListQueryKeys from "../../../constants/QueryKeys";
import type { List } from "../../../models/List";
import { toast } from "react-toastify";
import { ApiError } from "../../../models/Error";
import ErrorCodes from "../../../constants/ErrorCodes";

export const useCreateProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product }: { product: ProductInput }) =>
      await ProductService.createProduct(listId, product),
    onSuccess: (data) => {
      const newList = queryClient.setQueryData<List | undefined>(
        ListQueryKeys.detail(listId),
        (prevList) =>
          prevList && {
            ...prevList,
            products: [
              ...prevList.products.filter((p) => p.id !== data.id),
              data,
            ],
          },
      );
      queryClient.setQueryData(
        ListQueryKeys.all,
        (prevLists: List[] | undefined) =>
          prevLists?.map((l) => (l.id === listId ? newList : l)),
      );
    },
    onError: (err, { product }) => {
      const apiErr = err as ApiError;
      if (apiErr.error?.code === ErrorCodes.tooManyProducts) {
        toast.error(
          "אין אפשרות ליצור עוד מוצרים.\nעברת את כמות המוצרים המותרת ברשימה.",
        );
        return;
      }
      toast.error(`שגיאה ביצירת המוצר '${product.name}'`);
      console.log(err.message);
    },
  });
};
