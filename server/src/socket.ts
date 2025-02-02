import { Server as SocketServer } from "socket.io";
import { Server } from "http";
import { listSocketHandler } from "./socketHandlers";
import { AppSocket, AppSocketServer } from "./types/socketTypes";
import helmet from "helmet";
import { corsOptions, helmetConfig, pubClient, subClient } from "./config";
import { authenticateSocket } from "./socketHandlers/middlewares";
import { createAdapter } from "@socket.io/redis-adapter";

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
