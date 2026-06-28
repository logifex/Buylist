import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import { List, ListInfo, SharedList } from "@/models/List";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons/static";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import { MaterialIcons } from "@react-native-vector-icons/material-icons/static";
import ThemeContext from "@/store/theme-context";
import BottomModal from "../Ui/BottomModal";
import MenuItem from "../Ui/MenuItem";
import DialogPrompt from "../Ui/Prompts/DialogPrompt";
import AuthContext from "@/store/auth-context";
import Text from "../Ui/ThemedText";
import InputPrompt from "../Ui/Prompts/InputPrompt";
import ListConstants from "@/constants/ListConstants";
import { Ionicons } from "@react-native-vector-icons/ionicons/static";
import ChangeListTypeModal from "./ChangeListTypeModal";
import ParticipantsModal from "../Participants/ParticipantsModal";
import isSharedList from "@/utils/isSharedList";

interface Props {
  onRequestClose: () => void;
  list: List;
  onEditList: (list: ListInfo) => void;
  onDeleteList: (listId: string) => void;
  onLeaveList: (listId: string) => void;
  onShareList: () => Promise<SharedList>;
  onChangeToLocalList: () => Promise<void>;
  ref: React.RefObject<BottomSheetModal | null>;
}

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
  const { ref: editModalRef, ...editModal } = useBottomSheetRef();
  const { ref: deleteModalRef, ...deleteModal } = useBottomSheetRef();
  const { ref: leaveModalRef, ...leaveModal } = useBottomSheetRef();
  const { ref: changeListTypeModalRef, ...changeListTypeModal } =
    useBottomSheetRef();

  const { userInfo } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  const isShared = isSharedList(list);
  const isOwner = isShared && list.participants[0].user.id === userInfo?.id;

  return (
    <>
      <BottomModal
        ref={ref}
        onRequestClose={onRequestClose}
        title="ניהול רשימה"
        snapPoints={["40%", "75%"]}
        enableDynamicSizing={false}
        closeKeyboard
      >
        <BottomSheetScrollView>
          {isShared && (
            <MenuItem
              text="משתתפים"
              startComponent={
                <MaterialIcons
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
              <MaterialDesignIcons
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
                <MaterialDesignIcons
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
                <MaterialDesignIcons
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
        </BottomSheetScrollView>
      </BottomModal>
      <BottomModal
        ref={editModalRef}
        onRequestClose={editModal.dismiss}
        title="עריכת רשימה"
      >
        <InputPrompt
          name="שם הרשימה"
          onConfirm={(listName) => {
            onEditList({ ...list, name: listName });
          }}
          onClose={editModal.dismiss}
          defaultValue={list.name}
          maxLength={ListConstants.maxListNameLength}
          autoFocus
        />
      </BottomModal>
      <BottomModal ref={deleteModalRef} onRequestClose={deleteModal.dismiss}>
        <DialogPrompt
          onConfirm={() => {
            onDeleteList(list.id);
          }}
          onClose={deleteModal.dismiss}
        >
          <Text style={styles.modalText}>
            {`האם למחוק את הרשימה "${list.name}"?`}
          </Text>
        </DialogPrompt>
      </BottomModal>
      <BottomModal ref={leaveModalRef} onRequestClose={leaveModal.dismiss}>
        <DialogPrompt
          onConfirm={() => {
            onLeaveList(list.id);
          }}
          onClose={leaveModal.dismiss}
        >
          <Text style={styles.modalText}>
            {`האם לעזוב את הרשימה "${list.name}"?`}
          </Text>
        </DialogPrompt>
      </BottomModal>
      <ParticipantsModal
        list={list as SharedList}
        participantsModalRef={participantsModal.ref}
        onParticipantsRequestClose={participantsModal.dismiss}
      />
      <ChangeListTypeModal
        ref={changeListTypeModalRef}
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
