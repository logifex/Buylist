import { StyleSheet } from "react-native";
import React from "react";
import Product from "@/models/Product";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import BottomModal from "@/components/Ui/BottomModal";
import DialogPrompt from "@/components/Ui/Prompts/DialogPrompt";
import Text from "@/components/Ui/ThemedText";

type Props = {
  existingProduct?: Product;
  onAddProduct: (productName: string) => void;
  onEditProduct: (product: Product) => void;
  dismiss: () => void;
};

const ExistingProductDialog = React.forwardRef<BottomSheetModal, Props>(
  function ExistingProductDialog(
    { existingProduct, onAddProduct, onEditProduct, dismiss },
    ref,
  ) {
    const handleAddProduct = () => {
      if (existingProduct) {
        onAddProduct(existingProduct.name);
      }
    };

    const handleUncheckProduct = () => {
      if (existingProduct) {
        onEditProduct({ ...existingProduct, isChecked: false });
      }
    };

    const checked = existingProduct && existingProduct.isChecked;
    const text = checked
      ? `המוצר ${existingProduct.name} כבר קיים במסומנים,\nהאם להחזיר אותו לרשימה?`
      : `המוצר ${existingProduct?.name} כבר קיים ברשימה,\nהאם להוסיף בכל זאת?`;

    return (
      <BottomModal
        ref={ref}
        snapPoints={[200]}
        showHandle
        backdropBehavior="none"
        onRequestClose={dismiss}
      >
        <DialogPrompt
          onConfirm={checked ? handleUncheckProduct : handleAddProduct}
          onSecondary={checked ? handleAddProduct : undefined}
          confirmTitle={checked ? "להחזיר" : "אישור"}
          secondaryTitle={checked ? "להוסיף" : undefined}
          cancelType={checked ? "empty" : "primary"}
          secondaryType="empty"
          onClose={dismiss}
        >
          <Text style={styles.text}>{text}</Text>
        </DialogPrompt>
      </BottomModal>
    );
  },
);

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default ExistingProductDialog;
