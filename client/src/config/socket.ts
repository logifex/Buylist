import { io } from "socket.io-client";
import { auth } from "./firebase";
import AppService from "../services/AppService";

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false,
  withCredentials: true,
});

auth.onIdTokenChanged((user) => {
  const connect = async () => {
    const token = await user?.getIdToken();

    if (!token) {
      socket.disconnect();
      return;
    }

    socket.io.opts.extraHeaders = {
      ...socket.io.opts.extraHeaders,
      Authorization: `Bearer ${token}`,
    };
    void connectSocket();
  };

  void connect();
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
