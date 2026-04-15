import type { AppSocket, AppSocketServer } from "./types/socketTypes.js";
import { Server as SocketServer } from "socket.io";
import { Server } from "http";
import helmet from "helmet";
import { createAdapter } from "@socket.io/redis-adapter";
import { listSocketHandler } from "./socketHandlers/index.js";
import {
  corsOptions,
  helmetConfig,
  pubClient,
  subClient,
} from "./config/index.js";
import { authenticateSocket } from "./socketHandlers/middlewares/index.js";

export let io: AppSocketServer | undefined;

export const configSocket = (httpServer: Server) => {
  io = new SocketServer(httpServer, {
    cors: { ...corsOptions, credentials: true },
    adapter: createAdapter(pubClient, subClient),
  });

  const onConnection = (socket: AppSocket) => {
    socket.on("listJoin", listSocketHandler.joinListRoom);
    socket.on("listLeave", listSocketHandler.leaveListRoom);
  };

  io.on("connection", onConnection);
  io.engine.use(authenticateSocket);
  io.engine.use(helmet(helmetConfig));
};
