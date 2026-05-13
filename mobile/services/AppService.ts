import { fetchWithAuth } from "@/utils/apiUtils";

const serverUrl = process.env.EXPO_PUBLIC_SERVER_URL;

if (!serverUrl) {
  throw new Error("Server URL is not defined");
}

const AppService = {
  async fetchInstanceId(): Promise<{ instanceId: string | undefined }> {
    const response = await fetchWithAuth(`${serverUrl}/api/instance-id`);
    return (await response.json()) as { instanceId: string };
  },
};

export default AppService;
