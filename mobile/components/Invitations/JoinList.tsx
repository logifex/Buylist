import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import InvitationService from "@/services/InvitationService";
import AuthContext from "@/store/auth-context";
import BottomModal from "@/components/Ui/BottomModal";
import DialogPrompt from "@/components/Ui/Prompts/DialogPrompt";
import Text from "@/components/Ui/ThemedText";
import { ApiError } from "@/models/Error";
import { useJoinList } from "@/hooks/api/invitations/useJoinList";
import { ListPreview } from "@/models/List";
import ErrorCodes from "@/constants/ErrorCodes";

const JoinList = () => {
  const url = Linking.useLinkingURL();
  const [handled, setHandled] = useState(false);
  const [invitationLinkList, setInvitationLinkList] = useState<ListPreview>();

  const {
    ref: invitationModalRef,
    present: presentInvitationModal,
    dismiss: dismissInvitationModal,
  } = useBottomSheetRef();

  const { userInfo, signIn } = useContext(AuthContext);

  const joinList = useJoinList();

  const handleInvitationLink = useCallback(async () => {
    if (!url) {
      return;
    }

    const path = Linking.parse(url).path;
    if (!path?.startsWith("invite/")) {
      return;
    }
    const invitationToken = path.split("/")[1];

    await InvitationService.getInvitationList(invitationToken)
      .then((invitationList) => {
        setHandled(true);
        setInvitationLinkList(invitationList);
        presentInvitationModal();
      })
      .catch((err: unknown) => {
        if ((err as ApiError).error?.code === ErrorCodes.invitationNotFound) {
          Toast.show({ type: "base", text1: "קישור ההזמנה כבר לא קיים" });
        } else {
          console.log(err);
          Toast.show({
            type: "base",
            text1:
              "יש בעיה בהתחברות לשרת להצטרפות לרשימה. כדאי לבדוק את החיבור.",
          });
        }
      });
  }, [presentInvitationModal, url]);

  useEffect(() => {
    const subscription = Linking.addEventListener("url", () => {
      setHandled(false);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (handled || !url) {
      return;
    }

    if (userInfo) {
      void handleInvitationLink();
    } else {
      void signIn();
    }
  }, [url, handled, userInfo, handleInvitationLink, signIn]);

  const joinLinkListHandler = async () => {
    if (!url) {
      return;
    }

    const path = Linking.parse(url).path;
    if (!path?.startsWith("invite/")) {
      return;
    }
    const token = path.split("/")[1];

    try {
      await joinList.mutateAsync({ token: token });
    } catch (err) {
      if ((err as ApiError).error?.code === ErrorCodes.invitationNotFound) {
        Toast.show({ type: "base", text1: "קישור ההזמנה כבר לא קיים" });
      } else if (
        (err as ApiError).error?.code === ErrorCodes.participantAlreadyExists
      ) {
        Toast.show({ type: "base", text1: "משתמש זה כבר נמצא ברשימה זו" });
      } else {
        console.error(err);
        Toast.show({
          type: "base",
          text1: "יש בעיה בהתחברות לשרת להצטרפות לרשימה. כדאי לבדוק את החיבור.",
        });
      }
    }
  };

  return (
    <BottomModal
      ref={invitationModalRef}
      onRequestClose={dismissInvitationModal}
      enablePanDownToClose={false}
      closeKeyboard
    >
      <DialogPrompt
        onConfirm={() => void joinLinkListHandler()}
        onClose={dismissInvitationModal}
      >
        {invitationLinkList && (
          <Text style={styles.text}>
            {`האם להצטרף אל הרשימה "${invitationLinkList.name}"?`}
          </Text>
        )}
      </DialogPrompt>
    </BottomModal>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontSize: 16,
  },
});

export default JoinList;
