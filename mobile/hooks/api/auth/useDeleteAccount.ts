import AuthService from "@/services/AuthService";
import { useMutation } from "@tanstack/react-query";

export const useDeleteAccount = () => {
  return useMutation({
    networkMode: "always",
    mutationFn: () => AuthService.deleteAccount(),
  });
};
