import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import List, { ListInput } from "@/models/List";
import Product, { ProductInput } from "@/models/Product";
import ListsContext, { ListsContextType } from "@/store/list-context";
import AppDataService from "@/services/AppDataService";
import * as Crypto from "expo-crypto";

type ListsReducerActionType =
  | { type: "LOAD_LISTS"; payload: { lists: List[] } }
  | { type: "ADD_LIST"; payload: { list: List } }
  | {
      type: "EDIT_LIST";
      payload: { listId: string; list: ListInput };
    }
  | { type: "DELETE_LIST"; payload: { listId: string } }
  | { type: "ADD_PRODUCT"; payload: { listId: string; product: Product } }
  | { type: "EDIT_PRODUCT"; payload: { listId: string; product: Product } }
  | { type: "DELETE_PRODUCT"; payload: { listId: string; productId: string } };

const ListsReducer = (
  state: List[],
  action: ListsReducerActionType,
): List[] => {
  switch (action.type) {
    case "LOAD_LISTS": {
      return action.payload.lists;
    }
    case "ADD_LIST": {
      const newState = state.concat(action.payload.list);

      return newState;
    }
    case "EDIT_LIST": {
      const { name, color } = action.payload.list;
      const newState = state.slice();
      const editList = newState.find((l) => l.id === action.payload.listId);

      if (editList) {
        editList.name = name;
        editList.color = color ?? editList.color;
      }

      return newState;
    }
    case "DELETE_LIST": {
      const newState = state.filter((l) => l.id !== action.payload.listId);

      return newState;
    }
    case "ADD_PRODUCT": {
      const newState = state.slice();
      const newCurList = newState.find((l) => l.id === action.payload.listId);
      newCurList?.products.push(action.payload.product);

      return newState;
    }
    case "EDIT_PRODUCT": {
      const { id: productId, name, note, isChecked } = action.payload.product;
      const newState = state.slice();
      const newCurList = newState.find((l) => l.id === action.payload.listId);
      const editProduct = newCurList?.products.find((p) => p.id === productId);

      if (editProduct) {
        editProduct.name = name;
        editProduct.note = note;
        editProduct.isChecked = isChecked;
      }

      return newState;
    }
    case "DELETE_PRODUCT": {
      const newState = state.slice();
      const newCurList = newState.find((l) => l.id === action.payload.listId);

      if (newCurList) {
        newCurList.products = newCurList.products.filter(
          (p) => p.id !== action.payload.productId,
        );
      }

      return newState;
    }
    default: {
      throw new Error("Invalid action");
    }
  }
};

const ListsProvider = ({ children }: PropsWithChildren) => {
  const [listsState, dispatchLists] = useReducer(ListsReducer, []);
  const [starredLists, setStarredLists] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  const handleAddList = useCallback((list: ListInput) => {
    const listId = Crypto.randomUUID();
    dispatchLists({
      type: "ADD_LIST",
      payload: { list: { color: "GRAY", products: [], ...list, id: listId } },
    });

    return listId;
  }, []);

  const handleEditList = useCallback((listId: string, list: ListInput) => {
    dispatchLists({
      type: "EDIT_LIST",
      payload: { listId: listId, list: list },
    });
  }, []);

  const handleDeleteList = useCallback((listId: string) => {
    dispatchLists({ type: "DELETE_LIST", payload: { listId } });
  }, []);

  const handleAddProduct = useCallback(
    (listId: string, product: ProductInput) => {
      const productId = Crypto.randomUUID();
      dispatchLists({
        type: "ADD_PRODUCT",
        payload: {
          listId,
          product: { isChecked: false, note: null, ...product, id: productId },
        },
      });
    },
    [],
  );

  const handleEditProduct = useCallback((listId: string, product: Product) => {
    dispatchLists({ type: "EDIT_PRODUCT", payload: { listId, product } });
  }, []);

  const handleDeleteProduct = useCallback(
    (listId: string, productId: string) => {
      dispatchLists({ type: "DELETE_PRODUCT", payload: { listId, productId } });
    },
    [],
  );

  const handleStarList = useCallback((listId: string, star: boolean) => {
    if (!star) {
      setStarredLists((prevLists) => prevLists.filter((id) => id !== listId));
    } else {
      setStarredLists((prevLists) => [...prevLists, listId]);
    }
  }, []);

  const updateListStar = useCallback((oldListId: string, newListId: string) => {
    setStarredLists((prevLists) =>
      prevLists.map((id) => (id === oldListId ? newListId : id)),
    );
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const listsData = await AppDataService.readLists();
      const starredListsData = await AppDataService.readStarredLists();

      if (listsData.length > 0) {
        dispatchLists({ type: "LOAD_LISTS", payload: { lists: listsData } });
      }

      if (starredListsData.length > 0) {
        setStarredLists(starredListsData);
      }

      setLoaded(true);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (loaded) {
      AppDataService.writeLists(listsState);
    }
  }, [listsState, loaded]);

  useEffect(() => {
    if (loaded) {
      AppDataService.writeStarredLists(starredLists);
    }
  }, [starredLists, loaded]);

  const listsContext: ListsContextType = {
    lists: listsState,
    starredLists: starredLists,
    addList: handleAddList,
    editList: handleEditList,
    deleteList: handleDeleteList,
    addProduct: handleAddProduct,
    editProduct: handleEditProduct,
    deleteProduct: handleDeleteProduct,
    starList: handleStarList,
    updateListStar: updateListStar,
  };

  return (
    <ListsContext.Provider value={listsContext}>
      {children}
    </ListsContext.Provider>
  );
};

export default ListsProvider;
