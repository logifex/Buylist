import { auth } from "../config/firebase";
import { fetchWithAuth } from "../utils/apiUtils";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const AuthService = {
  async deleteAccount(): Promise<void> {
    await fetchWithAuth(`${serverUrl}/api/auth`, {
      method: "DELETE",
    });
    await auth.currentUser?.delete();
  },
};

export default AuthService;
