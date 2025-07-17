import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AuthRequiredBottomModal from "../Ui/AuthRequiredBottomModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import List, { SharedList } from "@/models/List";
import Text from "../Ui/ThemedText";
import Button from "../Ui/Button";
import Toast from "react-native-toast-message";

type Props = {
  list: List;
  onRequestClose: () => void;
  onShareList: () => Promise<SharedList>;
  onChangeToLocalList: () => Promise<void>;
  ref: React.RefObject<BottomSheetModal | null>;
};

const ChangeListTypeModal = ({
  list,
  onRequestClose,
  onShareList,
  onChangeToLocalList,
  ref,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const isShared = !!(list as SharedList).participants;

  const handleChangeListType = async (shared: boolean) => {
    setLoading(true);
    try {
      if (shared) {
        await onShareList();
      } else {
        await onChangeToLocalList();
      }
      onRequestClose();
      Toast.show({ type: "base", text1: "סוג הרשימה השתנה בהצלחה" });
    } catch (error) {
      Toast.show({ type: "base", text1: "שגיאה בשינוי סוג הרשימה" });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthRequiredBottomModal
      ref={ref}
      title={isShared ? "שינוי לרשימה מקומית" : "שינוי לרשימה מקוונת"}
      snapPoints={[300]}
      onRequestClose={onRequestClose}
    >
      <View style={styles.container}>
        {isShared && (list as SharedList).participants.length > 1 ? (
          <Text style={styles.text}>
            לא ניתן להפוך רשימה עם כמה משתתפים לרשימה מקומית.
          </Text>
        ) : (
          <>
            <Text style={styles.text}>
              {isShared
                ? "רשימה מקומית היא רשימה שנשמרת במכשיר שלך ולא נשמרת בשרת.\nהיא לא מסתנכרנת בין המכשירים שלך ואי אפשר לשתף אותה עם אנשים אחרים."
                : "רשימה מקוונת היא רשימה שנשמרת בשרת ומסתנכרנת עם כל המכשירים שלך.\nאפשר לשתף רשימה מקוונת עם אנשים אחרים."}
            </Text>
            <Button
              type="primary"
              style={styles.button}
              containerStyle={styles.buttonContainer}
              onPress={handleChangeListType.bind(null, !isShared)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {isShared ? "שינוי לרשימה מקומית" : "שינוי לרשימה מקוונת"}
              </Text>
            </Button>
          </>
        )}
      </View>
    </AuthRequiredBottomModal>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 12,
  },
  text: {
    textAlign: "center",
  },
  button: {
    width: 200,
    margin: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
});

export default ChangeListTypeModal;
