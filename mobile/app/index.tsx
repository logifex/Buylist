import { StyleSheet } from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import ListList from "@/components/Lists/ListList";
import FloatingActionButton from "@/components/Ui/FloatingActionButton";
import ThemeContext from "@/store/theme-context";
import BottomModal from "@/components/Ui/BottomModal";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import InputPrompt from "@/components/Ui/Prompts/InputPrompt";
import ListsContext from "@/store/list-context";
import { useGetLists } from "@/hooks/api/lists/useGetLists";
import AuthContext from "@/store/auth-context";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect, useRouter } from "expo-router";
import { List } from "@/models/List";
import { ListQueryKeys } from "@/constants/QueryKeys";
import ListConstants from "@/constants/ListConstants";
import Toast from "react-native-toast-message";
import PageContainer from "@/components/Ui/PageContainer";
import isSharedList from "@/utils/isSharedList";

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const userCtx = useContext(AuthContext);
  const listsCtx = useContext(ListsContext);

  const queryClient = useQueryClient();
  const { refetch: refetchLists, data: sharedLists } = useGetLists({
    enabled: !!userCtx.userInfo,
  });

  const { ref: addListModalRef, ...addListModal } = useBottomSheetRef();

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
      staleQueries.forEach((query) => {
        queryClient.removeQueries(query);
      });
    }
  }, [sharedLists, queryClient]);

  useFocusEffect(
    useCallback(() => {
      if (userCtx.userInfo) {
        void refetchLists();
      }
    }, [refetchLists, userCtx.userInfo]),
  );

  const handleAddList = (listName: string) => {
    if (listsCtx.lists.length >= ListConstants.maxListAmount) {
      Toast.show({
        type: "base",
        text1: "אין אפשרות ליצור עוד רשימות.\nעברת את כמות הרשימות המותרת.",
      });
      return;
    }
    listsCtx.addList({ name: listName, color: "GRAY", products: [] });
  };

  const handlePressList = useCallback(
    (list: List) => {
      router.navigate({
        pathname: "/list",
        params: {
          listId: list.id,
          isShared: isSharedList(list).toString(),
        },
      });
    },
    [router],
  );

  const { starList } = listsCtx;
  const handleStarList = useCallback(
    (listId: string, star: boolean) => {
      starList(listId, star);
    },
    [starList],
  );

  return (
    <PageContainer style={styles.container}>
      <ListList
        lists={combinedLists}
        onListPress={handlePressList}
        onStar={handleStarList}
      />
      <FloatingActionButton
        onPress={addListModal.present}
        color={theme.secondary}
      >
        <MaterialIcons
          name="add"
          size={20}
          color="black"
          accessibilityLabel="יצירת רשימה"
        />
      </FloatingActionButton>
      <BottomModal
        ref={addListModalRef}
        title="יצירת רשימה"
        onRequestClose={addListModal.dismiss}
      >
        <InputPrompt
          name="שם הרשימה"
          onConfirm={handleAddList}
          onClose={addListModal.dismiss}
          autoFocus
          maxLength={ListConstants.maxListNameLength}
        />
      </BottomModal>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});

export default Home;
