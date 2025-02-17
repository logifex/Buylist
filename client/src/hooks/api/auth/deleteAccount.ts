import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../services/AuthService";
import { toast } from "react-toastify";

const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => AuthService.deleteAccount(),
    onSuccess: () => {
      toast.success("המשתמש נמחק בהצלחה");
    },
    onError: (err) => {
      console.log(err.message);
      toast.error("שגיאה במחיקת המשתמש. כדאי לנסות שוב מאוחר יותר.");
    },
  });
};

export default useDeleteAccount;
