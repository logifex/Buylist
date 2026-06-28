import { View, StyleSheet } from "react-native";
import React, { useContext, useEffect, useCallback, useState } from "react";
import ProductAddRow from "@/components/Products/ProductAddRow";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import filterProductsChecked from "@/utils/filterProductsChecked";
import { Product, ProductInput } from "@/models/Product";
import ProductList from "@/components/Products/ProductList";
import ColorMenu from "@/components/Lists/ColorMenu";
import ListOptionMenu from "@/components/Lists/ListOptionMenu";
import { List, ListInfo } from "@/models/List";
import InvitationModal from "@/components/Invitations/InvitationModal";
import ListsContext from "@/store/list-context";
import { useGetList } from "@/hooks/api/lists/useGetList";
import { ApiError } from "@/models/Error";
import { useUpdateList } from "@/hooks/api/lists/useUpdateList";
import { useDeleteList } from "@/hooks/api/lists/useDeleteList";
import { useCreateProduct } from "@/hooks/api/products/useCreateProduct";
import { useUpdateProduct } from "@/hooks/api/products/useUpdateProduct";
import { useDeleteProduct } from "@/hooks/api/products/useDeleteProduct";
import { useCreateList } from "@/hooks/api/lists/useCreateList";
import { useLeaveList } from "@/hooks/api/lists/useLeaveList";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { RootStackParamList } from "./_layout";
import ListHeaderRight from "@/components/Lists/ListHeaderRight";
import useListSocketHandlers from "@/hooks/useListSocketHandlers";
import ThemeContext from "@/store/theme-context";
import ListConstants from "@/constants/ListConstants";
import Toast from "react-native-toast-message";
import PageContainer from "@/components/Ui/PageContainer";

const ListScreen = () => {
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

  const {
    ref: menuModalRef,
    present: presentMenuModal,
    dismiss: dismissMenuModal,
  } = useBottomSheetRef();
  const {
    ref: colorPickModalRef,
    present: presentColorPickModal,
    dismiss: dismissColorPickModal,
  } = useBottomSheetRef();
  const {
    ref: invitationModalRef,
    present: presentInvitationModal,
    dismiss: dismissInvitationModal,
  } = useBottomSheetRef();

  const list = isShared
    ? getList.data
    : listsCtx.lists.find((l) => l.id === id);

  useEffect(() => {
    if (getList.error) {
      const apiError = getList.error as ApiError;
      if (apiError.status === 404) {
        router.back();
      }
    }
  }, [getList.error, router]);

  const listName = list?.name;
  useEffect(() => {
    if (!listName) {
      return;
    }

    navigation.setOptions({
      title: listName,
      headerRight: () =>
        ListHeaderRight({
          colorPickPresent: presentColorPickModal,
          invitationPresent: presentInvitationModal,
          menuPresent: presentMenuModal,
          theme: theme,
        }),
    });
  }, [
    navigation,
    listName,
    presentColorPickModal,
    presentInvitationModal,
    presentMenuModal,
    theme,
  ]);

  const { refetch: refetchAsync } = getList;
  const refetch = useCallback(() => void refetchAsync(), [refetchAsync]);
  useListSocketHandlers(
    isShared,
    id,
    pendingProducts,
    setPendingProducts,
    refetch,
    router.back,
  );

  const handleChangeListColor = (color: List["color"]) => {
    if (!list) {
      return;
    }

    const newList: List = { ...list, color: color };
    handleEditList(newList);
  };

  const handleEditList = (listToEdit: ListInfo) => {
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
      router.back();
    } else {
      deleteList.mutate();
    }
    listsCtx.starList(listId, false);
  };

  const handleLeaveList = () => {
    leaveList.mutate();
    listsCtx.starList(id, false);
  };

  const handleAddProduct = (product: ProductInput) => {
    if (list && list.products.length >= ListConstants.maxProductAmount) {
      Toast.show({
        type: "base",
        text1:
          "אין אפשרות ליצור עוד מוצרים.\nעברת את כמות המוצרים המותרת ברשימה.",
      });
      return;
    }

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
    (product: Product) => {
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
    (productId: string) => {
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

  if (!list) {
    return <View style={styles.container}></View>;
  }

  const handleIdChanged = (oldId: string, newId: string) => {
    listsCtx.updateStarListId(oldId, newId);
  };

  const handleShareList = async () => {
    const sharedList = await createList.mutateAsync({ list: list });
    if (navigation.isFocused()) {
      router.setParams({ listId: sharedList.id, isShared: "true" });
    }
    listsCtx.deleteList(id);
    handleIdChanged(id, sharedList.id);

    return sharedList;
  };

  const handleChangeToLocalList = async () => {
    await deleteList.mutateAsync();
    const newListId = listsCtx.addList({
      name: list.name,
      color: list.color,
      products: list.products,
    });

    handleIdChanged(id, newListId);
    if (navigation.isFocused()) {
      router.setParams({ listId: newListId, isShared: "false" });
    }
  };

  const filteredProducts = filterProductsChecked(list.products);

  return (
    <PageContainer style={styles.container}>
      <ProductAddRow
        products={list.products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
      />
      <ProductList
        filteredProducts={filteredProducts}
        listColor={list.color}
        isShared={isShared}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      <ListOptionMenu
        ref={menuModalRef}
        onRequestClose={dismissMenuModal}
        list={list}
        onEditList={handleEditList}
        onDeleteList={handleDeleteList}
        onLeaveList={handleLeaveList}
        onShareList={handleShareList}
        onChangeToLocalList={handleChangeToLocalList}
      />
      <ColorMenu
        ref={colorPickModalRef}
        onRequestClose={dismissColorPickModal}
        onPick={handleChangeListColor}
      />
      <InvitationModal
        ref={invitationModalRef}
        onRequestClose={dismissInvitationModal}
        onShareList={handleShareList}
        list={list}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});

export default ListScreen;
