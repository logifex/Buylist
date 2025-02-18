import AuthService from "@/services/AuthService";
import { useMutation } from "@tanstack/react-query";

const useDeleteAccount = () => {
  return useMutation({
    networkMode: "always",
    mutationFn: () => AuthService.deleteAccount(),
  });
};

export default useDeleteAccount;
