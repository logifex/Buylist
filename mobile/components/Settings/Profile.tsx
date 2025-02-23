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
      <Text style={styles.center}>{email}</Text>
      <Text style={styles.center}>{name}</Text>
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
    marginBottom: 4,
  },
  center: {
    textAlign: "center",
  },
});

export default Profile;
