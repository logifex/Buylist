import { useMutation, useQueryClient } from "@tanstack/react-query";
import ProductService from "../../../services/ProductService";
import type { Product } from "../../../models/Product";
import ListQueryKeys from "../../../constants/QueryKeys";
import type { List } from "../../../models/List";
import { toast } from "react-toastify";

export const useUpdateProduct = ({ listId }: { listId: string }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product }: { product: Product }) =>
      ProductService.updateProduct(listId, product),
    onSuccess: (data) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) =>
          prevList && {
            ...prevList,
            products: prevList.products.map((p) =>
              p.id === data.id ? data : p,
            ),
          },
      );
    },
    onError: (err) => {
      toast.error("שגיאה בעריכת המוצר");
      console.log(err.message);
    },
  });
};
