import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../services/AuthService";

const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => AuthService.deleteAccount(),
  });
};

export default useDeleteAccount;
