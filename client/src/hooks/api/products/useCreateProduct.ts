import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductInput } from "../../../models/Product";
import ProductService from "../../../services/ProductService";
import ListQueryKeys from "../../../constants/QueryKeys";
import List from "../../../models/List";
import { toast } from "react-toastify";
import { ApiError } from "../../../models/Error";
import ErrorCodes from "../../../constants/ErrorCodes";

const useCreateProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ product }: { product: ProductInput }) =>
      await ProductService.createProduct(listId, product),
    onSuccess: (data) => {
      const newList: List | undefined = queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) =>
          prevList && {
            ...prevList,
            products: [
              ...prevList.products.filter((p) => p.id !== data.id),
              data,
            ],
          }
      );
      queryClient.setQueryData(
        ListQueryKeys.all,
        (prevLists: List[] | undefined) =>
          prevLists?.map((l) => (l.id === listId ? newList : l))
      );
    },
    onError: (err, { product }) => {
      const apiErr = err as ApiError;
      if (apiErr.error?.code === ErrorCodes.tooManyProducts) {
        toast.error(
          "אין אפשרות ליצור עוד מוצרים.\nעברת את כמות המוצרים המותרת ברשימה."
        );
        return;
      }
      toast.error(`שגיאה ביצירת המוצר '${product.name}'`);
      console.log(err.message);
    },
  });
};

export default useCreateProduct;
