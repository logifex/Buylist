import { StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import Product from "@/models/Product";
import ProductButtons from "./ProductButtons";
import ListConstants from "@/constants/ListConstants";

type Props = {
  product: Product;
  accessibilityId: string;
  onEditProduct: (product: Product) => void;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

const ProductEditForm = ({
  product,
  accessibilityId,
  onEditProduct,
  setEdit,
}: Props) => {
  const [editName, setEditName] = useState(product.name);
  const [editNote, setEditNote] = useState(product.note ?? "");

  const stopEditing = useCallback(() => {
    setEdit(false);
  }, [setEdit]);

  const submitHandler = useCallback(async () => {
    const trimmedName = editName.trim();
    const trimmedNote = editNote.trim();

    if (
      trimmedName === "" ||
      (trimmedName === product.name && trimmedNote === product.note)
    ) {
      stopEditing();

      return;
    }

    const newNote = trimmedNote === "" ? null : trimmedNote;
    const updatedProduct = {
      ...product,
      name: trimmedName,
      note: newNote,
    };
    onEditProduct(updatedProduct);
    stopEditing();
  }, [editName, editNote, product, onEditProduct, stopEditing]);

  return (
    <>
      <View style={styles.contentView}>
        <TextInput
          style={[styles.input, styles.nameInput]}
          value={editName}
          onChangeText={setEditName}
          maxLength={ListConstants.maxProductNameLength}
          placeholder="שם"
          placeholderTextColor="rgb(70, 70, 70)"
          accessibilityLabel={`שם המוצר ${accessibilityId}`}
        />
        <TextInput
          style={[styles.input, styles.noteInput]}
          value={editNote}
          onChangeText={setEditNote}
          maxLength={ListConstants.maxProductNoteLength}
          placeholder="הערה"
          placeholderTextColor="rgb(70, 70, 70)"
          accessibilityLabel={`הערה למוצר ${accessibilityId}`}
        />
      </View>
      <ProductButtons
        startIconName="check"
        endIconName="close"
        startIconLabel={`שמירת מוצר ${accessibilityId}`}
        endIconLabel={`ביטול שינויים במוצר ${accessibilityId}`}
        onStartPress={submitHandler}
        onEndPress={stopEditing}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    marginHorizontal: 12,
    flex: 1,
  },
  input: {
    padding: 0,
    borderBottomWidth: 1,
    textAlign: "right",
    color: "black",
  },
  nameInput: {
    fontSize: 16,
  },
  noteInput: {
    fontSize: 16,
  },
});

export default ProductEditForm;
