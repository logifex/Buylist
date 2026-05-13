import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../services/AuthService";

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: () => AuthService.deleteAccount(),
  });
};
