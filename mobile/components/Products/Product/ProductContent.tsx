import { View, StyleSheet } from "react-native";
import React, { useCallback } from "react";
import Product from "@/models/Product";
import Text from "@/components/Ui/ThemedText";
import ProductButtons from "./ProductButtons";

type Props = {
  product: Product;
  onDeleteProduct: (productId: string) => void;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductContent = ({ product, onDeleteProduct, setEdit }: Props) => {
  const { id, name, note, isChecked } = product;

  const handleEditMode = useCallback(() => {
    setEdit((prevState) => !prevState);
  }, [setEdit]);

  const handleDeleteProduct = useCallback(() => {
    onDeleteProduct(id);
  }, [onDeleteProduct, id]);

  return (
    <>
      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.text,
            styles.nameText,
            isChecked && styles.checkedText,
          ]}
        >
          {name}
        </Text>
        <Text
          style={[
            styles.text,
            styles.noteText,
            !note && styles.emptyNote,
            isChecked && styles.checkedText,
          ]}
        >
          {note && note !== "" ? note : "הערה"}
        </Text>
      </View>
      <ProductButtons
        startIconName="edit"
        endIconName="delete"
        onStartPress={handleEditMode}
        onEndPress={handleDeleteProduct}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 12,
    flex: 5,
  },
  text: {
    color: "black",
    textAlign: "left",
  },
  nameText: {
    fontSize: 16,
  },
  noteText: {
    fontSize: 16,
  },
  emptyNote: {
    color: "rgb(70, 70, 70)",
  },
  checkedText: {
    textDecorationLine: "line-through",
  },
});

export default ProductContent;
