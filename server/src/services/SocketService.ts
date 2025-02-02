import { io } from "../socket";
import { ListDetails } from "../types/list";
import { ProductDetails } from "../types/product";

const emitListUpdate = (listId: string, updatedList: ListDetails) => {
  io?.to(`listRoom-${listId}`).emit("listUpdate", updatedList);
};

const emitListDelete = (listId: string) => {
  io?.to(`listRoom-${listId}`).emit("listDelete", listId);
};

const emitProductAdd = (listId: string, product: ProductDetails) => {
  io?.to(`listRoom-${listId}`).emit("productCreate", listId, product);
};

const emitProductUpdate = (listId: string, updatedProduct: ProductDetails) => {
  io?.to(`listRoom-${listId}`).emit("productUpdate", listId, updatedProduct);
};

const emitProductDelete = (listId: string, productId: string) => {
  io?.to(`listRoom-${listId}`).emit("productDelete", listId, productId);
};

const disconnectParticipantSocket = async (listId: string, userId: string) => {
  const participantSockets = await io?.in(`listRoom-${listId}`).fetchSockets();

  if (!participantSockets) {
    return;
  }

  const socket = participantSockets.find(
    (socket) => socket.data.user.id === userId
  );
  socket?.leave(`listRoom-${listId}`);
  socket?.emit("listKick", listId);
};

export default {
  emitListUpdate,
  emitListDelete,
  emitProductAdd,
  emitProductUpdate,
  emitProductDelete,
  disconnectParticipantSocket,
};
