import { Server, Socket } from "socket.io";
import { ListDetails } from "./list";
import { ProductDetails } from "./product";
import { RequestUser } from "./user";

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

interface InterServerEvents {}

interface SocketData {
  user: RequestUser;
}

export type AppSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
