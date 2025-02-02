import { ListInput, SharedList } from "@/models/List";
import Product from "@/models/Product";
import Participant from "@/models/Participant";
import { fetchWithAuth } from "@/utils/apiUtils";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

const ListService = {
  async fetchLists(): Promise<SharedList[]> {
    const response = await fetchWithAuth(`${serverUrl}/api/lists`);
    const json = await response.json();
    return json.map((l: SharedList) => ({
      ...l,
      products: l.products.map((p) => ({ ...p, isSynced: true })),
    }));
  },
  async fetchList(listId: string): Promise<SharedList> {
    const response = await fetchWithAuth(`${serverUrl}/api/lists/${listId}`);
    const json = await response.json();
    return {
      ...json,
      products: json.products.map((p: Product) => ({ ...p, isSynced: true })),
    };
  },
  async createList(listInput: ListInput): Promise<SharedList> {
    const response = await fetchWithAuth(`${serverUrl}/api/lists`, {
      method: "POST",
      body: JSON.stringify({
        name: listInput.name,
        color: listInput.color,
        products: listInput.products?.map((p) => ({
          name: p.name,
          note: p.note,
          isChecked: p.isChecked,
        })),
      }),
    });

    const json: SharedList = await response.json();
    return {
      ...json,
      products: json.products.map((p) => ({ ...p, isSynced: true })),
    };
  },
  async updateList(listId: string, listInput: ListInput) {
    await fetchWithAuth(`${serverUrl}/api/lists/${listId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: listInput.name, color: listInput.color }),
    });
  },
  async deleteList(listId: string) {
    await fetchWithAuth(`${serverUrl}/api/lists/${listId}`, {
      method: "DELETE",
    });
  },
  async fetchParticipants(listId: string): Promise<Participant[]> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants`,
    );

    return await response.json();
  },
  async removeParticipant(listId: string, participantId: string) {
    await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/${participantId}`,
      { method: "DELETE" },
    );
  },
};

export default ListService;
