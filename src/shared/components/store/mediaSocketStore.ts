import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStore = {
  socket: Socket | null;
  isConnected: boolean;
  currentChat: string | null;
  connect: (chatId: string) => void;
  disconnect: () => void;
};

export const useMediaSocketStore = create<SocketStore>((set) => ({
  socket: null,
  isConnected: false,
  currentChat: null,
  connect: (chatId: string) => {
    console.log("connect fun");
    const socket = io(process.env.SOCKET_URL, {
      // Ваш сервер NestJS
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        chat: chatId,
      },

      // reconnectionAttempts: 3,
      // reconnectionDelay: 1000,
    });
    socket.on("connect", () => set({ isConnected: true, currentChat: chatId }));
    socket.on("disconnect", () =>
      set({ isConnected: false, currentChat: null }),
    );
    socket.connect();
    set({ socket });
  },
  disconnect: () => {
    console.log("disconnect fun");
    const { socket } = useMediaSocketStore.getState();
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));
