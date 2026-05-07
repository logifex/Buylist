import { StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { SharedList } from "@/models/List";
import AuthContext from "@/store/auth-context";
import Text from "@/components/Ui/ThemedText";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Participant from "./Participant";
import ParticipantModel from "@/models/Participant";
import useGetParticipants from "@/hooks/api/participants/useGetParticipants";
import { ListQueryKeys } from "@/constants/QueryKeys";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  list: SharedList;
  onRemovePress: (participant: ParticipantModel) => void;
};

const Participants = ({ list, onRemovePress }: Props) => {
  const queryClient = useQueryClient();
  const getParticipants = useGetParticipants({ listId: list.id });

  const { userInfo: currentUser } = useContext(AuthContext);

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

  return (
    <View style={styles.container}>
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
              onRemove={onRemovePress}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  loadingText: {
    textAlign: "center",
  },
});

export default Participants;
