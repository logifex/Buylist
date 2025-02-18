import React from "react";
import List, { ListInput } from "@/models/List";
import Product, { ProductInput } from "@/models/Product";

export type ListsContextType = {
  lists: List[];
  addList: (listName: ListInput) => string;
  editList: (listId: string, list: ListInput) => void;
  deleteList: (listId: string) => void;
  addProduct: (listId: string, product: ProductInput) => void;
  editProduct: (listId: string, product: Product) => void;
  deleteProduct: (listId: string, productId: string) => void;
};

const ListsContext = React.createContext<ListsContextType>({
  lists: [],
  addList: () => "",
  editList: () => {},
  deleteList: () => {},
  addProduct: () => {},
  editProduct: () => {},
  deleteProduct: () => {},
});

export default ListsContext;
