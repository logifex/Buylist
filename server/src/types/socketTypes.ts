import type { ListDetails } from "./list.js";
import type { ProductDetails } from "./product.js";
import type { RequestUser } from "./user.js";
import { Server, Socket } from "socket.io";

interface ServerToClientEvents {
  error: (message: string) => void;
  listUpdate: (list: ListDetails) => void;
  listDelete: (listId: string) => void;
  listKick: (listId: string) => void;
  productCreate: (listId: string, product: ProductDetails) => void;
  productUpdate: (listId: string, product: ProductDetails) => void;
  productDelete: (listId: string, productId: string) => void;
}

interface ClientToServerEvents {
  listJoin: (listId: string) => void;
  listLeave: (listId: string) => void;
}

interface SocketData {
  user: RequestUser;
}

export type AppSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>;

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>;
