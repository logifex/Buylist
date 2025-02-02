import socket from "@/config/socket";
import { ListQueryKeys } from "@/constants/QueryKeys";
import { ListInfo, SharedList } from "@/models/List";
import Product, { ProductInput } from "@/models/Product";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const useListSocketHandlers = (
  enabled: boolean,
  listId: string,
  pendingProducts: ProductInput[],
  setPendingProducts: React.Dispatch<React.SetStateAction<ProductInput[]>>,
  refetch: () => void,
  goBack: () => void,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    socket.emit("listJoin", listId);

    const onConnection = () => {
      setPendingProducts([]);
      socket.emit("listJoin", listId);
      refetch();
    };
    socket.on("connect", onConnection);

    const onDisconnection = () => {
      setPendingProducts([]);
    };
    socket.on("disconnect", onDisconnection);

    return () => {
      socket.emit("listLeave", listId);
      socket.off("connect", onConnection);
      socket.off("disconnect", onDisconnection);
    };
  }, [enabled, listId, refetch, setPendingProducts]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const listUpdateListener = (updatedList: ListInfo) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) =>
          prevList && {
            ...prevList,
            ...updatedList,
          },
      );
    };
    socket.on("listUpdate", listUpdateListener);

    const listDeleteListener = () => {
      queryClient.setQueryData(ListQueryKeys.all, (oldLists: SharedList[]) =>
        oldLists.filter((l) => l.id !== listId),
      );
      queryClient.removeQueries({ queryKey: ListQueryKeys.detail(listId) });
      goBack();
    };
    socket.on("listDelete", listDeleteListener);
    socket.on("listKick", listDeleteListener);

    const productCreateListener = (listId: string, newProduct: Product) => {
      // need to add more fields when needed
      const existingProduct = pendingProducts.find(
        (prod) =>
          prod.name === newProduct.name &&
          prod.note === newProduct.note &&
          prod.isChecked === newProduct.isChecked,
      );
      if (existingProduct) {
        setPendingProducts((prevProducts) =>
          prevProducts.filter((p) => p !== existingProduct),
        );
      } else {
        queryClient.setQueryData(
          ListQueryKeys.detail(listId),
          (prevList: SharedList | undefined) => {
            return (
              prevList && {
                ...prevList,
                products: [
                  ...prevList.products.filter((p) => p.id !== newProduct.id),
                  { ...newProduct, isSynced: true },
                ],
              }
            );
          },
        );
      }
    };
    socket.on("productCreate", productCreateListener);

    const productUpdateListener = (listId: string, updatedProduct: Product) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) => {
          return (
            prevList && {
              ...prevList,
              products: prevList.products.map((p) =>
                p.id === updatedProduct.id
                  ? { ...updatedProduct, isSynced: true }
                  : p,
              ),
            }
          );
        },
      );
    };
    socket.on("productUpdate", productUpdateListener);

    const productDeleteListener = (listId: string, productId: string) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: SharedList | undefined) => {
          return (
            prevList && {
              ...prevList,
              products: prevList.products.filter((p) => p.id !== productId),
            }
          );
        },
      );
    };
    socket.on("productDelete", productDeleteListener);

    return () => {
      socket.off("listUpdate", listUpdateListener);
      socket.off("listDelete", listDeleteListener);
      socket.off("listKick", listDeleteListener);
      socket.off("productCreate", productCreateListener);
      socket.off("productUpdate", productUpdateListener);
      socket.off("productDelete", productDeleteListener);
    };
  }, [
    goBack,
    enabled,
    queryClient,
    listId,
    pendingProducts,
    setPendingProducts,
  ]);
};

export default useListSocketHandlers;
