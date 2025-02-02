import { fetchWithAuth } from "../utils/apiUtils";

const serverUrl = import.meta.env.VITE_SERVER_URL;

const AppService = {
  async fetchInstanceId(): Promise<{ instanceId: string | undefined }> {
    const response = await fetchWithAuth(`${serverUrl}/api/instance-id`);
    return (await response.json()) as { instanceId: string | undefined };
  },
};

export default AppService;
