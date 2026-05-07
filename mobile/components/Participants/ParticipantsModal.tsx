import { StyleSheet } from "react-native";
import React, { useCallback, useState } from "react";
import BottomModal from "../Ui/BottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Participants from "./Participants";
import { SharedList } from "@/models/List";
import useRemoveParticipant from "@/hooks/api/participants/useRemoveParticipant";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import Participant from "@/models/Participant";
import DialogPrompt from "../Ui/Prompts/DialogPrompt";
import Text from "../Ui/ThemedText";

type Props = {
  list: SharedList;
  onParticipantsRequestClose: () => void;
  participantsModalRef: React.RefObject<BottomSheetModal | null>;
};

const ParticipantsModal = ({
  list,
  onParticipantsRequestClose,
  participantsModalRef,
}: Props) => {
  const [participantToRemove, setParticipantToRemove] = useState<
    Participant | undefined
  >();

  const removeParticipant = useRemoveParticipant({ listId: list.id });

  const removeConfirmSheetModal = useBottomSheetRef();

  const { mutate: mutateRemoveParticipant } = removeParticipant;
  const handleRemoveParticipant = useCallback(() => {
    if (!participantToRemove) {
      return;
    }

    mutateRemoveParticipant({ participantId: participantToRemove.user.id });
  }, [mutateRemoveParticipant, participantToRemove]);

  const handleOpenRemoveDialog = (participant: Participant) => {
    setParticipantToRemove(participant);
    removeConfirmSheetModal.present();
  };

  return (
    <>
      <BottomModal
        ref={participantsModalRef}
        onRequestClose={onParticipantsRequestClose}
        snapPoints={["25%", "50%", "75%"]}
        enableDynamicSizing={false}
        title="משתתפים"
      >
        <Participants list={list} onRemovePress={handleOpenRemoveDialog} />
      </BottomModal>
      <BottomModal
        ref={removeConfirmSheetModal.ref}
        onRequestClose={removeConfirmSheetModal.dismiss}
      >
        <DialogPrompt
          onConfirm={handleRemoveParticipant}
          onClose={removeConfirmSheetModal.dismiss}
        >
          {participantToRemove && (
            <Text style={styles.modalText}>
              {`האם להסיר את ${participantToRemove.user.name} מהרשימה "${list.name}"?`}
            </Text>
          )}
        </DialogPrompt>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default ParticipantsModal;
