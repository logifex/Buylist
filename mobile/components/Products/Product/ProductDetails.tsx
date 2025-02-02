import React, { useMemo, useCallback, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import Product from "@/models/Product";
import ProductContent from "./ProductContent";
import ProductEditForm from "./ProductEditForm";
import MaterialIcon from "@expo/vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";

interface Props extends Product {
  isSynced?: boolean;
  isShared: boolean;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
}

const ProductDetails = ({
  id,
  name,
  note,
  isChecked,
  isSynced,
  isShared,
  onEditProduct,
  onDeleteProduct,
}: Props) => {
  const [edit, setEdit] = useState(false);

  const lastItemId = useRef(id);
  if (id !== lastItemId.current) {
    lastItemId.current = id;
    setEdit(false);
  }

  const product: Product = useMemo(
    () => ({ id, name, note, isChecked }),
    [id, name, note, isChecked],
  );

  const productToggleCheckHandler = useCallback(() => {
    onEditProduct({ ...product, isChecked: !product.isChecked });
  }, [onEditProduct, product]);

  return (
    <>
      {isShared && !isSynced && (
        <MaterialIcon name="clock-outline" style={styles.iconContainer} />
      )}
      <Checkbox
        style={styles.checkbox}
        color="black"
        value={product.isChecked}
        onValueChange={productToggleCheckHandler}
      />
      {edit ? (
        <ProductEditForm
          product={product}
          onEditProduct={onEditProduct}
          setEdit={setEdit}
        />
      ) : (
        <ProductContent
          product={product}
          onDeleteProduct={onDeleteProduct}
          setEdit={setEdit}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    borderWidth: 2,
  },
  iconContainer: {
    position: "absolute",
    bottom: 4,
    right: 4,
  },
});

export default ProductDetails;
