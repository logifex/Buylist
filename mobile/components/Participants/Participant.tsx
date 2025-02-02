import { StyleSheet, View, Image } from "react-native";
import React from "react";
import Text from "@/components/Ui/ThemedText";
import Button from "@/components/Ui/Button";
import ParticipantModel from "@/models/Participant";

type Props = {
  participant: ParticipantModel;
  isUserOwner: boolean;
  onRemove: (participant: ParticipantModel) => void;
};

const Participant = ({ participant, isUserOwner, onRemove }: Props) => {
  const handleRemove = () => {
    onRemove(participant);
  };

  const roleText = participant.role === "OWNER" ? "בעלים" : "משותף";

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: participant.user.photoUrl ?? "" }}
        style={styles.profilePic}
      />
      <View style={styles.content}>
        <Text style={styles.text}>{participant.user.name}</Text>
        <Text style={styles.text}>{roleText}</Text>
      </View>
      {isUserOwner && participant.role !== "OWNER" && (
        <Button onPress={handleRemove} containerStyle={styles.button}>
          <Text>הסרה</Text>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    marginTop: 4,
    marginHorizontal: 8,
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 100,
  },
  content: {
    marginLeft: 8,
    flex: 1,
  },
  text: {
    textAlign: "left",
  },
  button: {
    padding: 8,
  },
});

export default Participant;
