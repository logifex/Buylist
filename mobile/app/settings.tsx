import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import AuthContext from "@/store/auth-context";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import Category from "@/components/Settings/Category";
import Profile from "@/components/Settings/Profile";
import Text from "@/components/Ui/ThemedText";
import ThemeSelect from "@/components/Settings/ThemeSelect";
import AuthButton from "@/components/Ui/AuthButton";
import * as Application from "expo-application";
import useDeleteAccount from "@/hooks/api/auth/deleteAccount";
import useBottomSheetRef from "@/hooks/useBottomSheet";
import BottomModal from "@/components/Ui/BottomModal";
import DialogPrompt from "@/components/Ui/Prompts/DialogPrompt";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const Settings = () => {
  const { userInfo, signOut } = useContext(AuthContext);
  const deleteAccount = useDeleteAccount();
  const queryClient = useQueryClient();

  const deleteAccountSheetModal = useBottomSheetRef();

  const handleDeleteAccount = async () => {
    try {
      await queryClient.cancelQueries();
      await deleteAccount.mutateAsync();
      await signOut();
      Toast.show({
        type: "base",
        text1: "המשתמש נמחק בהצלחה",
      });
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "base",
        text1:
          "שגיאה במחיקת המשתמש. כדאי לבדוק את החיבור לרשת או לנסות שוב מאוחר יותר.",
      });
    }
  };

  return (
    <>
      <View style={styles.fullSpace}>
        <ScrollView>
          <Category title="פרופיל">
            <View style={styles.profile}>
              {userInfo && (
                <Profile
                  email={userInfo.email}
                  name={userInfo.name}
                  photoUrl={userInfo.photoUrl}
                />
              )}
              <AuthButton />
            </View>
          </Category>
          <Category title="ערכת נושא">
            <ThemeSelect />
          </Category>
          {userInfo && (
            <Category title="ניהול חשבון">
              <Text style={styles.text}>
                מחיקת החשבון היא פעולה בלתי הפיכה שתמחק גם את כל הרשימות
                המקוונות שבבעלותך.
              </Text>
              <Pressable
                onPress={deleteAccountSheetModal.present}
                disabled={deleteAccount.isPending}
              >
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.deleteAccountButton,
                      pressed && styles.deleteAccountPressed,
                    ]}
                  >
                    מחיקת חשבון
                  </Text>
                )}
              </Pressable>
            </Category>
          )}
          <Category title="אודות">
            <Text style={styles.appTitle}>Buylist</Text>
            <Text>גרסה {Application.nativeApplicationVersion}</Text>
          </Category>
        </ScrollView>
      </View>
      <BottomModal
        ref={deleteAccountSheetModal.ref}
        onRequestClose={deleteAccountSheetModal.dismiss}
        snapPoints={[200]}
      >
        <DialogPrompt
          onConfirm={handleDeleteAccount}
          onClose={deleteAccountSheetModal.dismiss}
        >
          <Text style={styles.dialogText}>
            האם למחוק את החשבון?{"\n"}
            מחיקת החשבון גם תמחק את כל הרשימות המקוונות שבבעלותך ותוציא אותך מכל
            הרשימות שהיית חלק מהן.
          </Text>
        </DialogPrompt>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  fullSpace: {
    flex: 1,
  },
  profile: {
    width: 200,
    alignSelf: "center",
  },
  appTitle: {
    textAlign: "left",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteAccountButton: {
    color: "red",
    fontSize: 16,
  },
  deleteAccountPressed: {
    opacity: 0.75,
  },
  dialogText: {
    textAlign: "center",
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default Settings;
