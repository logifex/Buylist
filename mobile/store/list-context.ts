import React from "react";
import List, { ListInput } from "@/models/List";
import Product, { ProductInput } from "@/models/Product";

export type ListsContextType = {
  lists: List[];
  starredLists: string[];
  addList: (listName: ListInput) => string;
  editList: (listId: string, list: ListInput) => void;
  deleteList: (listId: string) => void;
  addProduct: (listId: string, product: ProductInput) => void;
  editProduct: (listId: string, product: Product) => void;
  deleteProduct: (listId: string, productId: string) => void;
  starList: (listId: string, star: boolean) => void;
  updateListStar: (oldListId: string, newListId: string) => void;
};

const ListsContext = React.createContext<ListsContextType>({
  lists: [],
  starredLists: [],
  addList: () => "",
  editList: () => {},
  deleteList: () => {},
  addProduct: () => {},
  editProduct: () => {},
  deleteProduct: () => {},
  starList: () => {},
  updateListStar: () => {},
});

export default ListsContext;
