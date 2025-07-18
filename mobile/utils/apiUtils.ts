import { auth } from "@/config/firebase";
import { ApiError, BackendError } from "@/models/Error";
import { getIdToken } from "@react-native-firebase/auth";

export const getAuthHeader = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new ApiError("Not authenticated", 401);
  }

  const token = await getIdToken(user);

  return { Authorization: `Bearer ${token}` };
};

export const createTimeoutSignal = (timeout: number) => {
  const controller = new AbortController();

  const abort = setTimeout(() => {
    controller.abort();
  }, timeout);

  return { signal: controller.signal, abort: abort };
};

export const transformResponseError = async (
  response: Response,
): Promise<ApiError> => {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json: { error: BackendError } = await response.json();
    console.log(json.error.message);
    return new ApiError(json.error.message, response.status, json.error);
  }

  return new ApiError("Response error", response.status);
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  timeout = 7.5 * 1000,
) => {
  const authHeader = await getAuthHeader();
  const headers = { ...authHeader, ...options.headers };
  const { signal, abort } = createTimeoutSignal(timeout);

  const response = await fetch(url, {
    ...options,
    headers: options.body
      ? { "Content-Type": "application/json", ...headers }
      : headers,
    signal: signal,
  });

  clearTimeout(abort);

  if (!response.ok) {
    throw await transformResponseError(response);
  }

  return response;
};
