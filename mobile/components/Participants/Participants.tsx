import { StyleSheet } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SharedList } from "@/models/List";
import AuthContext from "@/store/auth-context";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import Text from "@/components/Ui/ThemedText";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Participant from "./Participant";
import BottomModal from "@/components/Ui/BottomModal";
import DialogPrompt from "@/components/Ui/Prompts/DialogPrompt";
import ParticipantModel from "@/models/Participant";
import useGetParticipants from "@/hooks/api/participants/useGetParticipants";
import useRemoveParticipant from "@/hooks/api/participants/useRemoveParticipant";
import { ListQueryKeys } from "@/constants/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  list: SharedList;
};

const Participants = ({ list }: Props) => {
  const [participantToRemove, setParticipantToRemove] = useState<
    ParticipantModel | undefined
  >();

  const queryClient = useQueryClient();
  const getParticipants = useGetParticipants({ listId: list.id });
  const removeParticipant = useRemoveParticipant({ listId: list.id });

  const { userInfo: currentUser } = useContext(AuthContext);

  const removeConfirmSheetModal = useBottomSheetRef();

  useEffect(() => {
    if (getParticipants.data) {
      queryClient.setQueryData(
        ListQueryKeys.detail(list.id),
        (prevList: SharedList | undefined) =>
          prevList && { ...prevList, participants: getParticipants.data },
      );
    }
  }, [getParticipants.data, list.id, queryClient]);

  const isUserOwner = list.participants[0].user.id === currentUser?.id;

  const currentUserParticipant: ParticipantModel | undefined = currentUser && {
    role: isUserOwner ? "OWNER" : "BASIC",
    user: {
      id: currentUser.id,
      name: "את/ה",
      photoUrl: currentUser.photoUrl,
    },
  };

  const participants: ParticipantModel[] = [];
  if (getParticipants.data && currentUserParticipant) {
    const otherParticipants = getParticipants.data.filter(
      (p) => p.user.id !== currentUserParticipant.user.id,
    );
    participants.push(...[currentUserParticipant, ...otherParticipants]);
  }

  const handleOpenRemoveDialog = (participant: ParticipantModel) => {
    setParticipantToRemove(participant);
    removeConfirmSheetModal.present();
  };

  const { mutate: mutateRemoveParticipant } = removeParticipant;
  const handleRemoveParticipant = useCallback(() => {
    if (!participantToRemove) {
      return;
    }

    mutateRemoveParticipant({ participantId: participantToRemove.user.id });
  }, [mutateRemoveParticipant, participantToRemove]);

  return (
    <>
      {getParticipants.isLoading ? (
        <Text style={styles.loadingText}>טוען משתתפים...</Text>
      ) : (
        <BottomSheetFlatList
          data={participants}
          keyExtractor={(item) => item.user.id}
          renderItem={({ item }) => (
            <Participant
              participant={item}
              isUserOwner={isUserOwner}
              onRemove={handleOpenRemoveDialog}
            />
          )}
        />
      )}
      <BottomModal
        ref={removeConfirmSheetModal.ref}
        onRequestClose={removeConfirmSheetModal.dismiss}
        snapPoints={[175]}
      >
        <DialogPrompt
          onConfirm={handleRemoveParticipant}
          onClose={removeConfirmSheetModal.dismiss}
        >
          {participantToRemove && (
            <Text style={styles.modalText}>
              האם להסיר את {participantToRemove.user.name} מהרשימה "{list.name}
              "?
            </Text>
          )}
        </DialogPrompt>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
  },
  modalText: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default Participants;
