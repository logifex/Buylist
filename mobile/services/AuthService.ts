import { fetchWithAuth } from "@/utils/apiUtils";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

const AuthService = {
  async deleteAccount(): Promise<void> {
    await fetchWithAuth(`${serverUrl}/api/auth`, {
      method: "DELETE",
    });
  },
};

export default AuthService;
