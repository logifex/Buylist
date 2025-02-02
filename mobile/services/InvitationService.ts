import { ListPreview, SharedList } from "@/models/List";
import { fetchWithAuth } from "@/utils/apiUtils";
import TokenInvitation from "@/models/Invitation";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

const InvitationService = {
  async getInvitationList(token: string): Promise<ListPreview> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/join/${token}`,
    );

    return await response.json();
  },
  async joinList(token: string): Promise<SharedList> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/join/${token}`,
      { method: "POST" },
    );

    return await response.json();
  },
  async getTokenInvitation(listId: string): Promise<TokenInvitation> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/invite/token`,
    );

    const json = await response.json();
    return {
      ...json,
      expiry: new Date(json.expiry),
    };
  },
  async createTokenInvitation(listId: string): Promise<TokenInvitation> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/invite/token`,
      { method: "POST" },
    );

    const json = await response.json();
    return {
      ...json,
      expiry: new Date(json.expiry),
    };
  },
  async deleteTokenInvitation(listId: string) {
    await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/invite/token`,
      { method: "DELETE" },
    );
  },
};

export default InvitationService;
