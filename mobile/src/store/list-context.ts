import React from "react";
import { List, ListInput } from "@/models/List";
import { Product, ProductInput } from "@/models/Product";

export interface ListsContextType {
  lists: List[];
  starredLists: string[];
  addList: (listName: ListInput) => string;
  editList: (listId: string, list: ListInput) => void;
  deleteList: (listId: string) => void;
  addProduct: (listId: string, product: ProductInput) => void;
  editProduct: (listId: string, product: Product) => void;
  deleteProduct: (listId: string, productId: string) => void;
  starList: (listId: string, star: boolean) => void;
  updateStarListId: (oldListId: string, newListId: string) => void;
}

const ListsContext = React.createContext<ListsContextType>({
  lists: [],
  starredLists: [],
  addList: () => "",
  editList: () => {
    return;
  },
  deleteList: () => {
    return;
  },
  addProduct: () => {
    return;
  },
  editProduct: () => {
    return;
  },
  deleteProduct: () => {
    return;
  },
  starList: () => {
    return;
  },
  updateStarListId: () => {
    return;
  },
});

export default ListsContext;
