import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductService from "../../../services/ProductService";
import ListQueryKeys from "../../../constants/QueryKeys";
import List from "../../../models/List";
import { toast } from "react-toastify";

const useDeleteProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      ProductService.deleteProduct(listId, productId),
    onSuccess: (_data, { productId }) => {
      const newList: List | undefined = queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) =>
          prevList && {
            ...prevList,
            products: prevList.products.filter((p) => p.id !== productId),
          }
      );
      queryClient.setQueryData(
        ListQueryKeys.all,
        (prevLists: List[] | undefined) =>
          prevLists?.map((l) => (l.id === listId ? newList : l))
      );
    },
    onError: (err) => {
      toast.error("שגיאה במחיקת המוצר");
      console.log(err.message);
    },
  });
};

export default useDeleteProduct;
