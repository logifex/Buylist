import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import Product from "../models/Product";
import socket from "../config/socket";
import List, { ListInfo } from "../models/List";
import ListQueryKeys from "../constants/QueryKeys";

const useListSocketHandlers = (listId: string, refetch: () => void) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.emit("listJoin", listId);

    const onConnection = () => {
      socket.emit("listJoin", listId);
      refetch();
    };
    socket.on("connect", onConnection);

    return () => {
      socket.emit("listLeave", listId);
      socket.off("connect", onConnection);
    };
  }, [listId, refetch]);

  useEffect(() => {
    const listUpdateListener = (updatedList: ListInfo) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) =>
          prevList && {
            ...prevList,
            ...updatedList,
          }
      );
    };
    socket.on("listUpdate", listUpdateListener);

    const listDeleteListener = () => {
      queryClient.setQueryData(
        ListQueryKeys.all,
        (oldLists: List[] | undefined) =>
          oldLists?.filter((l) => l.id !== listId)
      );
      void queryClient.invalidateQueries({
        queryKey: ListQueryKeys.detail(listId),
      });
    };
    socket.on("listDelete", listDeleteListener);
    socket.on("listKick", listDeleteListener);

    const productCreateListener = (listId: string, newProduct: Product) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) => {
          return (
            prevList && {
              ...prevList,
              products: [
                ...prevList.products.filter((p) => p.id !== newProduct.id),
                newProduct,
              ],
            }
          );
        }
      );
    };
    socket.on("productCreate", productCreateListener);

    const productUpdateListener = (listId: string, updatedProduct: Product) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) => {
          return (
            prevList && {
              ...prevList,
              products: prevList.products.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p
              ),
            }
          );
        }
      );
    };
    socket.on("productUpdate", productUpdateListener);

    const productDeleteListener = (listId: string, productId: string) => {
      queryClient.setQueryData(
        ListQueryKeys.detail(listId),
        (prevList: List | undefined) => {
          return (
            prevList && {
              ...prevList,
              products: prevList.products.filter((p) => p.id !== productId),
            }
          );
        }
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
  }, [queryClient, listId]);
};

export default useListSocketHandlers;
