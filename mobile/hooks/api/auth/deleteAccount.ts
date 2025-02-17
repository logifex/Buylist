import AuthService from "@/services/AuthService";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

const useDeleteAccount = () => {
  return useMutation({
    networkMode: "always",
    mutationFn: () => AuthService.deleteAccount(),
    onSuccess: () => {
      Toast.show({
        type: "base",
        text1: "המשתמש נמחק בהצלחה",
      });
    },
    onError: (err) => {
      console.log(err.message);
      Toast.show({
        type: "base",
        text1:
          "שגיאה במחיקת המשתמש. כדאי לבדוק את החיבור לרשת או לנסות שוב מאוחר יותר.",
      });
    },
  });
};

export default useDeleteAccount;
