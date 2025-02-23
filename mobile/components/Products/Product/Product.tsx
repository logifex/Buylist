import { StyleSheet, View } from "react-native";
import React, { memo } from "react";
import ProductModel from "@/models/Product";
import List from "@/models/List";
import ProductDetails from "./ProductDetails";
import getGradientColor from "@/utils/getGradientColor";
import { LinearGradient } from "expo-linear-gradient";

interface Props extends ProductModel {
  isShared: boolean;
  color: List["color"];
  accessibilityId: string;
  onEditProduct: (product: ProductModel) => void;
  onDeleteProduct: (productId: string) => void;
}

const Product = ({
  isShared,
  color,
  accessibilityId,
  onEditProduct,
  onDeleteProduct,
  ...product
}: Props) => {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={getGradientColor(color)}
        style={styles.container}
      >
        <ProductDetails
          {...product}
          accessibilityId={accessibilityId}
          isShared={isShared}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 2,
    overflow: "hidden",
    alignSelf: "center",
    width: 500,
    maxWidth: "95%",
    elevation: 2,
  },
  container: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
});

export default memo(Product);
