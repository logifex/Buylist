import TokenInvitation from "../models/Invitation";
import List, { ListPreview } from "../models/List";
import { fetchWithAuth } from "../utils/apiUtils";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const InvitationService = {
  async getInvitationList(token: string): Promise<ListPreview> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/join/${token}`
    );

    const listPreview = (await response.json()) as ListPreview;
    return listPreview;
  },
  async joinList(token: string): Promise<List> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/join/${token}`,
      { method: "POST" }
    );

    const list = (await response.json()) as List;
    return list;
  },
  async getTokenInvitation(listId: string): Promise<TokenInvitation> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/invite/token`
    );

    const invitation = (await response.json()) as {
      token: string;
      expiry: string;
    };
    return {
      ...invitation,
      expiry: new Date(invitation.expiry),
    };
  },
  async createTokenInvitation(listId: string): Promise<TokenInvitation> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/invite/token`,
      { method: "POST" }
    );

    const invitation = (await response.json()) as {
      token: string;
      expiry: string;
    };
    return {
      ...invitation,
      expiry: new Date(invitation.expiry),
    };
  },
  async deleteTokenInvitation(listId: string) {
    await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/invite/token`,
      { method: "DELETE" }
    );
  },
};

export default InvitationService;
