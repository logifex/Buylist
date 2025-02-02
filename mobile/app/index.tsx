import { View, StyleSheet } from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import ListList from "@/components/Lists/ListList";
import FloatingActionButton from "@/components/Ui/FloatingActionButton";
import ThemeContext from "@/store/theme-context";
import BottomModal from "@/components/Ui/BottomModal";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import InputPrompt from "@/components/Ui/Prompts/InputPrompt";
import ListsContext from "@/store/list-context";
import useGetLists from "@/hooks/api/lists/useGetLists";
import AuthContext from "@/store/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import List, { SharedList } from "@/models/List";
import { ListQueryKeys } from "@/constants/QueryKeys";
import ListConstants from "@/constants/ListConstants";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const userCtx = useContext(AuthContext);
  const listsCtx = useContext(ListsContext);

  const queryClient = useQueryClient();
  const { refetch: refetchLists, data: sharedLists } = useGetLists({
    enabled: !!userCtx.userInfo,
  });

  const addListBottomSheet = useBottomSheetRef();

  const router = useRouter();

  const combinedLists = [...listsCtx.lists];
  if (sharedLists) {
    combinedLists.push(...sharedLists);
  }

  useEffect(() => {
    if (sharedLists) {
      const existingListQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ListQueryKeys.all });
      const staleQueries = existingListQueries.filter(
        (q) =>
          q.queryKey.length === 2 &&
          !sharedLists.some((curList) => curList.id === q.queryKey[1]),
      );
      staleQueries?.forEach((query) => {
        queryClient.removeQueries(query);
      });
    }
  }, [sharedLists, queryClient]);

  useFocusEffect(
    React.useCallback(() => {
      if (userCtx.userInfo) {
        refetchLists();
      }
    }, [refetchLists, userCtx.userInfo]),
  );

  const handleAddList = (listName: string) => {
    listsCtx.addList({ name: listName, color: "GRAY", products: [] });
  };

  const handlePressList = useCallback(
    (list: List) => {
      router.navigate({
        pathname: "/list",
        params: {
          listId: list.id,
          isShared: (!!(list as SharedList).participants).toString(),
        },
      });
    },
    [router],
  );

  return (
    <View style={styles.container}>
      <ListList lists={combinedLists} onListPress={handlePressList} />
      <FloatingActionButton
        onPress={addListBottomSheet.present}
        color={theme.secondary}
      >
        <MaterialIcon name="add" size={20} color="black" />
      </FloatingActionButton>
      <BottomModal
        ref={addListBottomSheet.ref}
        title="יצירת רשימה"
        snapPoints={[250]}
        onRequestClose={addListBottomSheet.dismiss}
      >
        <InputPrompt
          name="שם הרשימה"
          onConfirm={handleAddList}
          onClose={addListBottomSheet.dismiss}
          autoFocus
          maxLength={ListConstants.maxListNameLength}
        />
      </BottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
});

export default Home;
