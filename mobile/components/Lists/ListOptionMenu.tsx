import { View, StyleSheet } from "react-native";
import React, { useContext } from "react";
import List, { ListInfo, SharedList } from "@/models/List";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import ThemeContext from "@/store/theme-context";
import BottomModal from "../Ui/BottomModal";
import MenuItem from "../Ui/MenuItem";
import DialogPrompt from "../Ui/Prompts/DialogPrompt";
import AuthContext from "@/store/auth-context";
import Text from "../Ui/ThemedText";
import Participants from "@/components/Participants/Participants";
import InputPrompt from "../Ui/Prompts/InputPrompt";
import ListConstants from "@/constants/ListConstants";
import Ionicons from "@expo/vector-icons/Ionicons";
import ChangeListTypeModal from "./ChangeListTypeModal";

type Props = {
  onRequestClose: () => void;
  list: List;
  onEditList: (list: ListInfo) => void;
  onDeleteList: (listId: string) => void;
  onLeaveList: (listId: string) => void;
  onShareList: () => Promise<SharedList>;
  onChangeToLocalList: () => Promise<void>;
  ref: React.RefObject<BottomSheetModal | null>;
};

const iconSize = 20;

const ListOptionMenu = ({
  onRequestClose,
  list,
  onEditList,
  onDeleteList,
  onLeaveList,
  onShareList,
  onChangeToLocalList,
  ref,
}: Props) => {
  const participantsModal = useBottomSheetRef();
  const editModal = useBottomSheetRef();
  const deleteModal = useBottomSheetRef();
  const leaveModal = useBottomSheetRef();
  const changeListTypeModal = useBottomSheetRef();

  const { userInfo } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const isShared = !!(list as SharedList).participants;
  const isOwner =
    isShared && (list as SharedList).participants[0].user.id === userInfo?.id;

  return (
    <>
      <BottomModal
        ref={ref}
        onRequestClose={onRequestClose}
        title="ניהול רשימה"
        snapPoints={[300]}
        showHandle
        closeKeyboard
      >
        <View>
          {isShared && (
            <MenuItem
              text="משתתפים"
              startComponent={
                <MaterialIcon
                  name="people"
                  size={iconSize}
                  color={theme.text}
                />
              }
              onPress={() => {
                onRequestClose();
                participantsModal.present();
              }}
            />
          )}
          {(!isShared || isOwner) && (
            <MenuItem
              text={isShared ? "שינוי לרשימה מקומית" : "שינוי לרשימה מקוונת"}
              startComponent={
                <Ionicons
                  name={isShared ? "cloud-offline" : "globe-outline"}
                  size={iconSize}
                  color={theme.text}
                />
              }
              onPress={() => {
                onRequestClose();
                changeListTypeModal.present();
              }}
            />
          )}
          <MenuItem
            text="עריכת רשימה"
            startComponent={
              <MaterialCommunityIcon
                name="file-edit"
                size={iconSize}
                color={theme.text}
              />
            }
            onPress={() => {
              onRequestClose();
              editModal.present();
            }}
          />
          {!isShared || isOwner ? (
            <MenuItem
              text="מחיקת רשימה"
              startComponent={
                <MaterialCommunityIcon
                  name="delete-sweep"
                  size={iconSize}
                  color={theme.text}
                />
              }
              onPress={() => {
                onRequestClose();
                deleteModal.present();
              }}
            />
          ) : (
            <MenuItem
              text="עזיבת רשימה"
              startComponent={
                <MaterialCommunityIcon
                  name="exit-to-app"
                  size={iconSize}
                  color={theme.text}
                />
              }
              onPress={() => {
                onRequestClose();
                leaveModal.present();
              }}
            />
          )}
        </View>
      </BottomModal>
      <BottomModal
        ref={editModal.ref}
        onRequestClose={editModal.dismiss}
        title="עריכת רשימה"
        snapPoints={[250]}
      >
        <InputPrompt
          name="שם הרשימה"
          onConfirm={(listName) => onEditList({ ...list, name: listName })}
          onClose={editModal.dismiss}
          defaultValue={list.name}
          maxLength={ListConstants.maxListNameLength}
          autoFocus
        />
      </BottomModal>
      <BottomModal
        ref={deleteModal.ref}
        onRequestClose={deleteModal.dismiss}
        snapPoints={[200]}
      >
        <DialogPrompt
          onConfirm={() => onDeleteList(list.id)}
          onClose={deleteModal.dismiss}
        >
          <Text style={styles.modalText}>
            האם למחוק את הרשימה "{list.name}"?
          </Text>
        </DialogPrompt>
      </BottomModal>
      <BottomModal
        ref={leaveModal.ref}
        onRequestClose={leaveModal.dismiss}
        snapPoints={[200]}
      >
        <DialogPrompt
          onConfirm={() => onLeaveList(list.id)}
          onClose={leaveModal.dismiss}
        >
          <Text style={styles.modalText}>
            האם לעזוב את הרשימה "{list.name}"?
          </Text>
        </DialogPrompt>
      </BottomModal>
      <BottomModal
        ref={participantsModal.ref}
        onRequestClose={participantsModal.dismiss}
        snapPoints={["25%", "50%", "75%"]}
        title="משתתפים"
      >
        <Participants list={list as SharedList} />
      </BottomModal>
      <ChangeListTypeModal
        ref={changeListTypeModal.ref}
        list={list}
        onRequestClose={changeListTypeModal.dismiss}
        onShareList={onShareList}
        onChangeToLocalList={onChangeToLocalList}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default ListOptionMenu;
