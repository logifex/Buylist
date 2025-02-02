import { fetchWithAuth } from "@/utils/apiUtils";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

const AppService = {
  async fetchInstanceId(): Promise<{ instanceId: string | undefined }> {
    const response = await fetchWithAuth(`${serverUrl}/api/instance-id`);
    return await response.json();
  },
};

export default AppService;
