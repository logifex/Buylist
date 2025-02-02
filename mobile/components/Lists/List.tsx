import React from "react";
import { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ListModel, { SharedList } from "@/models/List";
import ThemeContext from "@/store/theme-context";
import filterProductsChecked from "@/utils/filterProductsChecked";
import Text from "@/components/Ui/ThemedText";

interface Props {
  list: ListModel;
  onPress: (list: ListModel) => void;
}

const List = ({ list, onPress }: Props) => {
  const { theme } = useContext(ThemeContext);
  const isShared = !!(list as SharedList).participants;

  const filteredProducts = filterProductsChecked(list.products);
  let productLengthText = `${filteredProducts.unChecked.length} מוצרים`;

  if (filteredProducts.unChecked.length === 1) {
    productLengthText = "מוצר אחד";
  }

  if (filteredProducts.checked.length > 0) {
    productLengthText += ` (+${filteredProducts.checked.length} ${
      filteredProducts.checked.length === 1 ? "מסומן" : "מסומנים"
    })`;
  }

  return (
    <Pressable onPress={() => onPress(list)}>
      <View style={[styles.container, { backgroundColor: theme.primaryDark }]}>
        {isShared && (
          <Ionicons
            name="globe-outline"
            size={16}
            color={theme.text}
            style={styles.sharedIcon}
          />
        )}
        <Text style={styles.name}>{list.name}</Text>
        <Text style={styles.amount}>{productLengthText}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginVertical: 2,
    borderWidth: 1,
    width: 300,
    elevation: 1,
    alignSelf: "center",
  },
  name: {
    textAlign: "center",
    fontSize: 20,
  },
  amount: {
    textAlign: "center",
  },
  sharedIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
});

export default List;
