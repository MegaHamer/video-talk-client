import { AppData, Producer } from "mediasoup-client/types";
import LocalUser from "./localUser";
import { create } from "zustand";

interface UserStore {
  localUser: LocalUser;
  initLocalUser: () => void;
  toggleMute: () => void;
  startMicrophone: (producer: any) => Promise<void>;
  stopMicrophone: () => Promise<void>;
  startScreenShare: (
    producerScreen: Producer,
    producerAudio?: Producer,
  ) => void;
  stopScreenShare: () => Promise<void>;
  closeProducers: () => Promise<void>;
  closeProducer: (
    type: "mic" | "camera" | "screen" | "screen audio",
  ) => Promise<void>;
  getProducer: (type: "mic" | "camera" | "screen" | "screen audio") => Producer<AppData>
}

const useUserStore = create<UserStore>((set, get) => ({
  localUser: new LocalUser(),

  initLocalUser: (name = "") => {
    console.log("Initializing local user:", name);
    set({ localUser: new LocalUser(name) });
  },

  toggleMute: async () => {
    const { localUser } = get();
    try {
      localUser.toggleMute();
      set({ localUser }); // Обновляем ссылку для триггера ререндера
    } catch (error) {
      console.error("Failed to toggle mute:", error);
      throw error;
    }
  },
  //Mictophone
  startMicrophone: async (producer) => {
    const { localUser } = get();
    try {
      await localUser.addProducer("mic", producer);
      set({ localUser });
    } catch (error) {
      console.error("Failed to start microphone:", error);
      throw error;
    }
  },
  stopMicrophone: async () => {
    const { localUser } = get();
    try {
      localUser.removeProducer("mic");
      set({ localUser });
    } catch (error) {
      console.error("Failed to stop microphone:", error);
      throw error;
    }
  },
  //screen
  startScreenShare: async (producerScreen, producerAudio) => {
    const { localUser } = get();
    try {
      await localUser.addProducer("screen", producerScreen);
      if (producerAudio) {
        await localUser.addProducer("screen audio", producerAudio);
      }
      set({ localUser });
    } catch (error) {
      console.error("Failed to start screen share:", error);
      throw error;
    }
  },
  stopScreenShare: async () => {
    const { localUser } = get();
    try {
      localUser.removeProducer("screen");
      set({ localUser });
    } catch (error) {
      console.error("Failed to stop screen share:", error);
      throw error;
    }
  },
  closeProducers: async () => {
    const { localUser } = get();
    localUser.getProducers().forEach(([type, producer]) => {
      producer?.close();
    });
    set({ localUser: new LocalUser("") });
  },
  closeProducer: async (type) => {
    const { localUser } = get();
    try {
      localUser.removeProducer(type);
      set({ localUser });
    } catch (error) {
      console.error("Failed to stop producer:", error);
      throw error;
    }
  },
  getProducer: (type) => {
    const { localUser } = get();
    try {
      return localUser.getProducer(type);
    } catch (error) {
      console.error("Failed to get producer:", error);
      throw error;
    }
  },
}));
export default useUserStore;
