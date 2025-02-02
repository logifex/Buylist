import { View, StyleSheet } from "react-native";
import React, {
  useContext,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";
import ProductAddRow from "@/components/Products/ProductAddRow";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import filterProductsChecked from "@/utils/filterProductsChecked";
import Product, { ProductInput } from "@/models/Product";
import ProductList from "@/components/Products/ProductList";
import ColorMenu from "@/components/Lists/ColorMenu";
import ListOptionMenu from "@/components/Lists/ListOptionMenu";
import List, { ListInfo } from "@/models/List";
import InvitationModal from "@/components/Invitations/InvitationModal";
import ListsContext from "@/store/list-context";
import useGetList from "@/hooks/api/lists/useGetList";
import { ApiError } from "@/models/Error";
import useUpdateList from "@/hooks/api/lists/useUpdateList";
import useDeleteList from "@/hooks/api/lists/useDeleteList";
import useCreateProduct from "@/hooks/api/products/useCreateProduct";
import useUpdateProduct from "@/hooks/api/products/useUpdateProduct";
import useDeleteProduct from "@/hooks/api/products/useDeleteProduct";
import useCreateList from "@/hooks/api/lists/useCreateList";
import useLeaveList from "@/hooks/api/lists/useLeaveList";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { RootStackParamList } from "./_layout";
import { FlashList } from "@shopify/flash-list";
import ListHeaderRight from "@/components/Lists/ListHeaderRight";
import useListSocketHandlers from "@/hooks/useListSocketHandlers";
import ThemeContext from "@/store/theme-context";

const Lists = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<RootStackParamList["list"]>();
  const id = params.listId;
  const isShared = params.isShared === "true";

  const listsCtx = useContext(ListsContext);
  const { theme } = useContext(ThemeContext);

  const getList = useGetList({ listId: id, enabled: isShared });
  const updateList = useUpdateList({ listId: id });
  const deleteList = useDeleteList({ listId: id });
  const createProduct = useCreateProduct({ listId: id });
  const updateProduct = useUpdateProduct({ listId: id });
  const deleteProduct = useDeleteProduct({ listId: id });
  const createList = useCreateList();
  const leaveList = useLeaveList({ listId: id });

  const [pendingProducts, setPendingProducts] = useState<ProductInput[]>([]);

  const menuModal = useBottomSheetRef();
  const colorPickModal = useBottomSheetRef();
  const invitationModal = useBottomSheetRef();

  const listRef = useRef<FlashList<Product | string> | null>(null);

  const list = isShared
    ? getList.data
    : listsCtx.lists.find((l) => l.id === id);

  useEffect(() => {
    if (!list) {
      router.back();
    }
  }, [list, router]);

  useEffect(() => {
    if (getList?.error) {
      const apiError = getList.error as ApiError;
      if (apiError.status === 404) {
        router.back();
      }
    }
  }, [getList?.error, router]);

  const listName = list?.name;
  useEffect(() => {
    if (!listName) {
      return;
    }

    navigation.setOptions({
      title: listName,
      headerRight: () =>
        ListHeaderRight({
          colorPickPresent: colorPickModal.present,
          invitationPresent: invitationModal.present,
          menuPresent: menuModal.present,
          theme: theme,
        }),
    });
  }, [
    navigation,
    listName,
    menuModal.present,
    colorPickModal.present,
    invitationModal.present,
    theme,
  ]);

  useListSocketHandlers(
    isShared,
    id,
    pendingProducts,
    setPendingProducts,
    getList.refetch,
    router.back,
  );

  const handleChangeListColor = async (color: List["color"]) => {
    if (!list) {
      return;
    }

    const newList: List = { ...list, color: color };
    handleEditList(newList);
  };

  const handleEditList = async (listToEdit: ListInfo) => {
    if (!isShared) {
      listsCtx.editList(id, listToEdit);
    } else {
      updateList.mutate({
        listId: id,
        list: { name: listToEdit.name, color: listToEdit.color },
      });
    }
  };

  const handleDeleteList = (listId: string) => {
    if (!isShared) {
      listsCtx.deleteList(listId);
    } else {
      deleteList.mutate();
    }
  };

  const handleLeaveList = () => {
    leaveList.mutate();
  };

  const handleAddProduct = async (product: ProductInput) => {
    if (!isShared) {
      listsCtx.addProduct(id, product);
    } else {
      createProduct.mutate({
        listId: id,
        product: product,
      });
      setPendingProducts((prevProducts) => [...prevProducts, product]);
    }
  };

  const { editProduct: updateLocalProduct, deleteProduct: deleteLocalProduct } =
    listsCtx;
  const { mutate: mutateUpdateProduct } = updateProduct;
  const handleEditProduct = useCallback(
    async (product: Product) => {
      if (!isShared) {
        updateLocalProduct(id, product);
      } else {
        mutateUpdateProduct({
          listId: id,
          product: product,
        });
      }
    },
    [isShared, updateLocalProduct, mutateUpdateProduct, id],
  );

  const { mutate: mutateDeleteProduct } = deleteProduct;
  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      if (!isShared) {
        deleteLocalProduct(id, productId);
      } else {
        mutateDeleteProduct({
          listId: id,
          productId: productId,
        });
      }
    },
    [isShared, deleteLocalProduct, mutateDeleteProduct, id],
  );

  const { mutateAsync: mutateAsyncCreateList } = createList;
  const { deleteList: deleteLocalList } = listsCtx;
  const handleShareList = useCallback(
    async (list: List) => {
      const sharedList = await mutateAsyncCreateList({ list: list });
      if (navigation.isFocused()) {
        router.setParams({ listId: sharedList.id, isShared: "true" });
      }
      deleteLocalList(id);

      return sharedList;
    },
    [mutateAsyncCreateList, id, deleteLocalList, navigation, router],
  );

  if (!list) {
    return <View style={styles.container}></View>;
  }

  const filteredProducts = filterProductsChecked(list.products);

  return (
    <View style={styles.container}>
      <ProductAddRow
        products={list.products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
      />
      <ProductList
        ref={listRef}
        filteredProducts={filteredProducts}
        listColor={list.color}
        isShared={isShared}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      <ListOptionMenu
        ref={menuModal.ref}
        onRequestClose={menuModal.dismiss}
        list={list}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
        onLeaveList={handleLeaveList}
      />
      <ColorMenu
        ref={colorPickModal.ref}
        onRequestClose={colorPickModal.dismiss}
        onPick={handleChangeListColor}
      />
      <InvitationModal
        ref={invitationModal.ref}
        onRequestClose={invitationModal.dismiss}
        onShareList={() => handleShareList(list)}
        list={list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});

export default Lists;
