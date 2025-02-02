import { Keyboard, StyleSheet, TextInput, View, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import Product, { ProductInput } from "@/models/Product";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import ThemeContext from "@/store/theme-context";
import Text from "@/components/Ui/ThemedText";
import ExistingProductDialog from "./ExistingProductDialog";
import ListConstants from "@/constants/ListConstants";

type Props = {
  products: Product[];
  onAddProduct: (product: ProductInput) => void;
  onEditProduct: (product: Product) => void;
};

const ProductAddRow = ({ products, onAddProduct, onEditProduct }: Props) => {
  const [enteredProductName, setEnteredProductName] = useState("");
  const [existingProduct, setExistingProduct] = useState<Product>();

  const existingProductBottomSheet = useBottomSheetRef();

  const handleAddProduct = () => {
    const newProductName = enteredProductName.trim();

    if (newProductName.length === 0) {
      return;
    }

    Keyboard.dismiss();
    setEnteredProductName("");

    const newExistingProduct = products.find((p) => p.name === newProductName);

    if (newExistingProduct) {
      setExistingProduct(newExistingProduct);
      existingProductBottomSheet.present();

      return;
    }

    addProduct(newProductName);
  };

  const addProduct = (newProductName: string) => {
    const newProduct: ProductInput = {
      name: newProductName,
      note: null,
      isChecked: false,
    };

    onAddProduct(newProduct);
  };

  const { theme } = useContext(ThemeContext);

  return (
    <View style={styles.row}>
      <TextInput
        style={[
          styles.addInput,
          { color: theme.text, borderColor: theme.placeholder },
        ]}
        placeholder="הוספת מוצר לרשימה"
        value={enteredProductName}
        maxLength={ListConstants.maxProductNameLength}
        onChangeText={setEnteredProductName}
        onSubmitEditing={handleAddProduct}
        placeholderTextColor={theme.placeholder}
      />
      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          { backgroundColor: theme.card },
          pressed && styles.addButtonPressed,
        ]}
        onPress={handleAddProduct}
      >
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
      <ExistingProductDialog
        ref={existingProductBottomSheet.ref}
        existingProduct={existingProduct}
        onAddProduct={addProduct}
        onEditProduct={onEditProduct}
        dismiss={existingProductBottomSheet.dismiss}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 500,
  },
  addInput: {
    flex: 1,
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    padding: 8,
    textAlign: "center",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 100,
    marginRight: 8,
    borderWidth: 0.5,
  },
  addButtonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default ProductAddRow;
