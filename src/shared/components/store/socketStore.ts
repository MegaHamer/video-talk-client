import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connect: () => {
    const socket = io("http://localhost:4002", {
      // Ваш сервер NestJS
      withCredentials: true,
      autoConnect: false,
    });

    socket.connect();
    set({ socket });
  },
  disconnect: () => {
    const { socket } = useSocketStore.getState();
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));

