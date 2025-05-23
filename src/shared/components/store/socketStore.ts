import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
};

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  connect: () => {
    const socket = io("http://localhost:4002/chat", {
      withCredentials: true,
      autoConnect: false,
      transports:["websocket"],
      // reconnectionAttempts: 3,
      // reconnectionDelay: 1000,
      
    });
    socket.on("connect", () => set({ isConnected: true }));
    socket.on("disconnect", () => set({ isConnected: false }));
    socket.connect();
    set({ socket });
  },
  disconnect: () => {
    const { socket } = useSocketStore.getState();
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));
