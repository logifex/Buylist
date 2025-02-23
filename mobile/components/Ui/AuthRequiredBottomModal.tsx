import React, { useContext } from "react";
import BottomModal, { BottomModalProps } from "./BottomModal";
import { useNetInfo } from "@react-native-community/netinfo";
import AuthContext from "@/store/auth-context";
import Text from "./ThemedText";
import AuthButton from "./AuthButton";
import { StyleSheet, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const AuthRequiredBottomModal = React.forwardRef<
  BottomSheetModal,
  BottomModalProps
>(function AuthRequiredBottomModal({ children, ...props }, ref) {
  const { isConnected } = useNetInfo();
  const { userInfo } = useContext(AuthContext);

  let message: string | undefined;

  if (!isConnected) {
    message = "אין חיבור לאינטרנט. כדאי לנסות שוב שוב מאוחר יותר.";
  } else if (!userInfo) {
    message = "יש צורך בהתחברות כדי לבצע פעולה זו.";
  }

  return (
    <BottomModal {...props} ref={ref}>
      {message ? (
        <View>
          <Text style={styles.messageText}>{message}</Text>
          {isConnected && <AuthButton />}
        </View>
      ) : (
        children
      )}
    </BottomModal>
  );
});

const styles = StyleSheet.create({
  messageText: {
    marginVertical: 8,
    textAlign: "center",
  },
});

export default AuthRequiredBottomModal;
