import useCreateTokenInvitation from "@/hooks/api/invitations/useCreateTokenInvitation";
import useDeleteTokenInvitation from "@/hooks/api/invitations/useDeleteTokenInvitation";
import useGetTokenInvitation from "@/hooks/api/invitations/useGetTokenInvitation";
import List, { SharedList } from "@/models/List";
import ThemeContext from "@/store/theme-context";
import React, { useContext, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import Button from "../Ui/Button";
import Text from "../Ui/ThemedText";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from "expo-clipboard";

type Props = {
  onShareList: () => Promise<SharedList>;
  list: List;
};

const Invitation = ({ onShareList, list }: Props) => {
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
      Toast.show({ type: "base", text1: "שגיאה ביצירת קישור הזמנה" });
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

  const { theme } = useContext(ThemeContext);

  const isExpired =
    getTokenInvitation.data?.expiry &&
    getTokenInvitation.data.expiry < new Date();

  return (
    <View style={styles.invitationLinkContainer}>
      {!invitationLink && (
        <>
          {!isShared && (
            <Text style={styles.text}>
              יצירת קישור ההזמנה תהפוך את הרשימה הזו לרשימה מקוונת.{"\n"}
              הרשימה תישמר בשרת ותסונכרן בין המכשירים שלך.
            </Text>
          )}
          <Button
            type="primary"
            style={styles.button}
            containerStyle={styles.buttonContainer}
            disabled={loading}
            onPress={handleCreateInvitationToken}
          >
            <MaterialIcon name="link" size={20} color="black" />
            <Text style={styles.buttonText}>
              {loading ? "טוען..." : "יצירת קישור הזמנה"}
            </Text>
          </Button>
        </>
      )}
      {invitationLink && (
        <View
          style={[styles.linkContainer, { backgroundColor: theme.background }]}
        >
          <Pressable style={styles.link} onPress={handleCopyLink}>
            <MaterialIcon
              style={[styles.linkIcon, { backgroundColor: theme.secondary }]}
              name="link"
              size={20}
              color="black"
            />
            <Text style={styles.linkText}>{invitationLink}</Text>
          </Pressable>
        </View>
      )}
      {isExpired && (
        <Text style={[styles.deleteText, { color: theme.danger }]}>
          פג תוקף הקישור
        </Text>
      )}
      {getTokenInvitation.data && !loading && (
        <Pressable
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deletePressed,
          ]}
          onPress={handleDeleteLink}
        >
          <Text style={[styles.deleteText, { color: theme.danger }]}>
            מחיקת קישור
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  invitationLinkContainer: {
    alignItems: "center",
    paddingTop: 12,
  },
  linkContainer: {
    padding: 16,
    width: "90%",
  },
  link: {
    flexDirection: "row",
  },
  linkIcon: {
    alignSelf: "center",
    marginRight: 16,
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
    padding: 8,
  },
  deletePressed: {
    opacity: 0.5,
  },
  text: {
    marginBottom: 8,
    textAlign: "center",
  },
});

export default Invitation;
