import { StyleSheet } from "react-native";
import React, { useContext } from "react";
import Text from "./ThemedText";
import Button from "./Button";
import AuthContext from "@/store/auth-context";

const AuthButton = () => {
  const userCtx = useContext(AuthContext);

  return (
    <Button
      onPress={userCtx.userInfo ? userCtx.signOut : userCtx.signIn}
      style={styles.button}
      containerStyle={styles.buttonContainer}
    >
      <Text>{userCtx.userInfo ? "התנתקות" : "התחברות"}</Text>
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
  },
  buttonContainer: {
    width: 200,
    padding: 12,
  },
});

export default AuthButton;
