import { io } from "socket.io-client";
import AppService from "@/services/AppService";
import { auth } from "./firebase";
import { onIdTokenChanged, getIdToken } from "@react-native-firebase/auth";

const socket = io(process.env.EXPO_PUBLIC_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

onIdTokenChanged(auth, async (user) => {
  if (!user) {
    socket.disconnect();
    return;
  }

  const token = await getIdToken(user);

  socket.io.opts.extraHeaders = {
    ...socket.io.opts.extraHeaders,
    Authorization: `Bearer ${token}`,
  };
});

export const connectSocket = async () => {
  if (socket.connected) {
    return;
  }

  try {
    const { instanceId } = await AppService.fetchInstanceId();
    if (instanceId) {
      socket.io.opts.query = {
        ...socket.io.opts.query,
        fly_instance_id: instanceId,
      };
      socket.io.opts.extraHeaders = {
        ...socket.io.opts.extraHeaders,
        "fly-force-instance-id": instanceId,
      };
    }
    socket.connect();
  } catch (err) {
    console.error(err);
  }
};

export default socket;
