import List, { ListInfo, ListInput } from "../models/List";
import Participant from "../models/Participant";
import { fetchWithAuth } from "../utils/apiUtils";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const ListService = {
  async fetchLists(): Promise<List[]> {
    const response = await fetchWithAuth(`${serverUrl}/api/lists`);
    const list = (await response.json()) as List[];

    return list;
  },
  async fetchList(listId: string): Promise<List> {
    const response = await fetchWithAuth(`${serverUrl}/api/lists/${listId}`);
    const list = (await response.json()) as List;

    return list;
  },
  async createList(listInput: ListInput): Promise<List> {
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

    const newList = (await response.json()) as List;
    return newList;
  },
  async updateList(listId: string, listInput: ListInput) {
    const response = await fetchWithAuth(`${serverUrl}/api/lists/${listId}`, {
      method: "PATCH",
      body: JSON.stringify({ name: listInput.name, color: listInput.color }),
    });

    const listDetails = (await response.json()) as ListInfo;
    return listDetails;
  },
  async deleteList(listId: string) {
    await fetchWithAuth(`${serverUrl}/api/lists/${listId}`, {
      method: "DELETE",
    });
  },
  async fetchParticipants(listId: string): Promise<Participant[]> {
    const response = await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants`
    );

    const participants = (await response.json()) as Participant[];
    return participants;
  },
  async removeParticipant(listId: string, participantId: string) {
    await fetchWithAuth(
      `${serverUrl}/api/lists/${listId}/participants/${participantId}`,
      { method: "DELETE" }
    );
  },
};

export default ListService;
