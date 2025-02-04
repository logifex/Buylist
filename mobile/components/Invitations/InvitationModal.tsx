import { StyleSheet, View, Pressable } from "react-native";
import React, { useContext, useState } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Button from "../Ui/Button";
import Text from "../Ui/ThemedText";
import ThemeContext from "@/store/theme-context";
import Toast from "react-native-toast-message";
import AuthContext from "@/store/auth-context";
import AuthButton from "../Ui/AuthButton";
import List, { SharedList } from "@/models/List";
import { useNetInfo } from "@react-native-community/netinfo";
import useGetTokenInvitation from "@/hooks/api/invitations/useGetTokenInvitation";
import useCreateTokenInvitation from "@/hooks/api/invitations/useCreateTokenInvitation";
import useDeleteTokenInvitation from "@/hooks/api/invitations/useDeleteTokenInvitation";
import BottomModal from "../Ui/BottomModal";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";

type Props = {
  onRequestClose: () => void;
  onShareList: () => Promise<SharedList>;
  list: List;
};

const InvitationModal = React.forwardRef<BottomSheetModal, Props>(
  function InvitationModal({ onRequestClose, onShareList, list }, ref) {
    const { isConnected } = useNetInfo();
    const [loading, setLoading] = useState(false);

    const isShared = !!(list as SharedList).participants;
    const getTokenInvitation = useGetTokenInvitation({
      listId: list.id,
      enabled: isShared,
    });
    const createTokenInvitation = useCreateTokenInvitation();
    const deleteTokenInvitation = useDeleteTokenInvitation({ listId: list.id });

    const linkHost = process.env.EXPO_PUBLIC_SERVER_URL;
    const invitationLink = getTokenInvitation.data?.token
      ? `${linkHost}/invite/${getTokenInvitation.data?.token}`
      : undefined;

    const handleCreateInvitationToken = async () => {
      setLoading(true);
      let curList = list as SharedList;
      try {
        if (!isShared) {
          curList = await onShareList();
        }
        await createTokenInvitation.mutateAsync({
          sharedListId: curList.id,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    const handleCopyLink = async () => {
      if (!invitationLink) {
        return;
      }

      await Clipboard.setStringAsync(invitationLink);
      Toast.show({ type: "linkToast" });
    };

    const handleDeleteLink = () => {
      deleteTokenInvitation.mutate();
    };

    const userCtx = useContext(AuthContext);
    const { theme } = useContext(ThemeContext);

    let message: string | undefined;

    if (!isConnected) {
      message = "אין חיבור לאינטרנט. נסו שוב מאוחר יותר.";
    } else if (!userCtx.userInfo) {
      message = "יש צורך בהתחברות כדי להזמין לרשימה.";
    }

    const isExpired =
      getTokenInvitation.data?.expiry &&
      getTokenInvitation.data.expiry < new Date();

    return (
      <BottomModal
        ref={ref}
        title="הזמנה לרשימה"
        snapPoints={[300]}
        showHandle
        closeKeyboard
        onRequestClose={onRequestClose}
      >
        {message ? (
          <View>
            <Text style={styles.messageText}>{message}</Text>
            {isConnected && <AuthButton />}
          </View>
        ) : (
          userCtx.userInfo && (
            <View style={styles.invitationLinkContainer}>
              {!invitationLink && (
                <Button
                  type="primary"
                  style={styles.button}
                  containerStyle={styles.buttonContainer}
                  disabled={loading}
                  onPress={handleCreateInvitationToken}
                >
                  <MaterialIcon name="link" size={20} color="black" />
                  <Text style={styles.buttonText}>
                    {loading ? "טוען..." : "צור קישור הזמנה"}
                  </Text>
                </Button>
              )}
              {invitationLink && (
                <View
                  style={[
                    styles.linkContainer,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Pressable style={styles.link} onPress={handleCopyLink}>
                    <MaterialIcon
                      style={[
                        styles.linkIcon,
                        { backgroundColor: theme.secondary },
                      ]}
                      name="link"
                      size={20}
                      color={theme.text}
                    />
                    <Text style={styles.linkText}>{invitationLink}</Text>
                  </Pressable>
                </View>
              )}
              {isExpired && (
                <Text style={styles.deleteText}>פג תוקף הקישור</Text>
              )}
              {getTokenInvitation.data && !loading && (
                <Pressable
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deletePressed,
                  ]}
                  onPress={handleDeleteLink}
                >
                  <Text style={styles.deleteText}>מחיקת קישור</Text>
                </Pressable>
              )}
            </View>
          )
        )}
      </BottomModal>
    );
  },
);

export default InvitationModal;

const styles = StyleSheet.create({
  messageText: {
    marginBottom: 8,
    textAlign: "center",
  },
  invitationLinkContainer: {
    alignItems: "center",
    paddingTop: 12,
  },
  linkContainer: {
    padding: 8,
    width: "90%",
  },
  link: {
    flexDirection: "row",
  },
  linkIcon: {
    alignSelf: "center",
    marginRight: 8,
    borderRadius: 4,
    padding: 4,
  },
  linkText: {
    flex: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  button: {
    width: 200,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },
  deleteButton: {
    marginTop: 4,
  },
  deleteText: {
    color: "red",
  },
  deletePressed: {
    opacity: 0.5,
  },
});
