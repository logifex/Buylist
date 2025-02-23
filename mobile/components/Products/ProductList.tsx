import { StyleSheet, View } from "react-native";
import React, { useCallback, useMemo } from "react";
import ProductModel, { FilteredProducts } from "@/models/Product";
import List from "@/models/List";
import Product from "./Product/Product";
import Text from "@/components/Ui/ThemedText";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

type Props = {
  filteredProducts: FilteredProducts;
  listColor: List["color"];
  isShared: boolean;
  onEditProduct: (product: ProductModel) => void;
  onDeleteProduct: (productId: string) => void;
};

const ProductList = React.forwardRef<FlashList<ProductModel | string>, Props>(
  function ProductList(
    { filteredProducts, listColor, isShared, onEditProduct, onDeleteProduct },
    ref,
  ) {
    const sectionData: (ProductModel | string)[] = useMemo(
      () => [
        ...filteredProducts.unChecked,
        ...(filteredProducts.checked.length > 0
          ? ["מסומנים", ...filteredProducts.checked]
          : []),
      ],
      [filteredProducts],
    );

    const renderItem: ListRenderItem<ProductModel | string> = useCallback(
      ({ item, index }) => {
        if (typeof item === "string") {
          return <Text style={styles.headerText}>{item}</Text>;
        } else {
          return (
            <Product
              {...item}
              color={listColor}
              isShared={isShared}
              accessibilityId={`${item.isChecked ? "checked " : ""}${index + 1}`}
              onEditProduct={onEditProduct}
              onDeleteProduct={onDeleteProduct}
            />
          );
        }
      },
      [listColor, isShared, onEditProduct, onDeleteProduct],
    );

    return (
      <View style={styles.list}>
        <FlashList
          data={sectionData}
          extraData={filteredProducts}
          renderItem={renderItem}
          getItemType={(item) =>
            typeof item === "string" ? "sectionHeader" : "row"
          }
          keyExtractor={(item) => (typeof item === "string" ? item : item.id)}
          keyboardShouldPersistTaps="handled"
          estimatedItemSize={65}
          ListEmptyComponent={
            <Text style={styles.emptyText}>אין מוצרים ברשימה.</Text>
          }
        />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  headerText: {
    marginTop: 12,
    marginHorizontal: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default ProductList;
