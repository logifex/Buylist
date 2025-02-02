import { StyleSheet, View, Image } from "react-native";
import React from "react";
import Text from "@/components/Ui/ThemedText";

type Props = {
  name: string | null;
  email: string | null;
  photoUrl: string | null;
};

const Profile = ({ name, email, photoUrl }: Props) => {
  return (
    <View style={styles.container}>
      {photoUrl && (
        <Image source={{ uri: photoUrl }} style={styles.profilePic} />
      )}
      <Text>{email}</Text>
      <Text>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: 4,
  },
  profilePic: {
    width: 128,
    height: 128,
    borderRadius: 100,
  },
});

export default Profile;
