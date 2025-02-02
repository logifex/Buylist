import React, { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Text from "@/components/Ui/ThemedText";
import ListModel from "@/models/List";
import List from "@/components/Lists/List";
import { FlashList, ListRenderItem } from "@shopify/flash-list";

type Props = {
  lists: ListModel[];
  onListPress: (list: ListModel) => void;
};

const ListList = ({ lists, onListPress }: Props) => {
  const renderItem: ListRenderItem<ListModel> = useCallback(
    ({ item }) => <List list={item} onPress={onListPress} />,
    [onListPress],
  );

  return (
    <View style={styles.list}>
      <FlashList
        data={lists}
        extraData={lists}
        estimatedItemSize={76}
        contentContainerStyle={styles.container}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, styles.center]}>הרשימות שלך</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.center}>
            אין רשימות.{"\n"}
            אפשר להוסיף רשימות בלחיצה על כפתור ה-+.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: Dimensions.get("screen").width,
    justifyContent: "center",
  },
  container: {
    paddingBottom: 4,
  },
  header: {
    flex: 1,
    width: "100%",
  },
  center: {
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    padding: 8,
  },
});

export default ListList;
