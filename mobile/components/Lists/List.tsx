import React from "react";
import { useContext } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ListModel, { SharedList } from "@/models/List";
import ThemeContext from "@/store/theme-context";
import filterProductsChecked from "@/utils/filterProductsChecked";
import Text from "@/components/Ui/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  list: ListModel;
  isStarred: boolean;
  accessibilityId: string;
  onPress: (list: ListModel) => void;
  onStar: (listId: string, star: boolean) => void;
}

const List = ({ list, isStarred, accessibilityId, onPress, onStar }: Props) => {
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
    <View style={[styles.container, { backgroundColor: theme.primaryDark }]}>
      <View style={styles.sideIcons}>
        <Pressable onPress={() => onStar(list.id, !isStarred)} hitSlop={16}>
          <MaterialIcons
            name={isStarred ? "star" : "star-border"}
            size={20}
            color={theme.text}
            accessibilityLabel={
              isStarred
                ? `רשימה ${accessibilityId} מסומנת בכוכב`
                : `רשימה ${accessibilityId} לא מסומנת בכוכב`
            }
          />
        </Pressable>
      </View>
      <View style={styles.listInfo}>
        <Pressable onPress={() => onPress(list)}>
          <View>
            <Text style={styles.name}>{list.name}</Text>
            <Text style={styles.amount}>{productLengthText}</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.sideIcons}></View>
      {isShared && (
        <Ionicons
          name="globe-outline"
          size={16}
          color={theme.text}
          accessibilityLabel={`רשימה ${accessibilityId} מקוונת`}
          style={styles.sharedIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginVertical: 2,
    borderWidth: 1,
    width: 300,
    elevation: 2,
    alignSelf: "center",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  listInfo: {
    flex: 1,
  },
  name: {
    textAlign: "center",
    fontSize: 20,
  },
  amount: {
    textAlign: "center",
  },
  sideIcons: {
    width: 20,
  },
  sharedIcon: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
});

export default List;
