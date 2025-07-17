import React, { useCallback, useContext } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Text from "@/components/Ui/ThemedText";
import ListModel from "@/models/List";
import List from "@/components/Lists/List";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import ListsContext from "@/store/list-context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  lists: ListModel[];
  onListPress: (list: ListModel) => void;
  onStar: (listId: string, star: boolean) => void;
};

const ListList = ({ lists, onListPress, onStar }: Props) => {
  const { starredLists } = useContext(ListsContext);

  const insets = useSafeAreaInsets();

  const sortedLists = lists.slice().sort((a, b) => {
    const indexA = starredLists.indexOf(a.id);
    const indexB = starredLists.indexOf(b.id);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else {
      return indexB - indexA;
    }
  });

  const renderItem: ListRenderItem<ListModel> = useCallback(
    ({ item, index }) => (
      <List
        list={item}
        isStarred={starredLists.includes(item.id)}
        accessibilityId={(index + 1).toString()}
        onPress={onListPress}
        onStar={onStar}
      />
    ),
    [onListPress, onStar, starredLists],
  );

  return (
    <View style={styles.list}>
      <FlashList
        data={sortedLists}
        extraData={sortedLists}
        estimatedItemSize={76}
        contentContainerStyle={{ paddingBottom: insets.bottom}}
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
