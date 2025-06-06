// stores/mediasoup.ts
import { create } from "zustand";
import { Device, Transport, Producer, Consumer } from "mediasoup-client/types";
import { io, Socket } from "socket.io-client";
import { types } from "mediasoup-client";
import useParticipantsStore from "./paricipants/participantsStore";
import useUserStore from "./localUser/localUserStore";

interface MediasoupState {
  // Подключение
  socket: Socket | null;
  device: Device | null;
  sendTransport: Transport | null;
  recvTransport: Transport | null;

  // Состояние
  isConnected: boolean;
  currentChat: string | null;

  // Методы
  connect: (chatId: string) => void;
  disconnect: () => void;
  produceAudio: () => Promise<Producer>;
  produceCamera: () => Promise<Producer>;
  produceVideo: () => Promise<Producer>;

  stopProduceVideo: () => Promise<void>
  stopProduceAudio: () => Promise<void>
  stopProduceCamera: () => Promise<void>

  handleRouterCapabilities: (
    rtpCapabilities: types.RtpCapabilities,
  ) => Promise<void>;
  handleTransportCreated: () => Promise<void>;
  handleParticipantCreated: () => Promise<void>;
  handleConsumerCreated: (
    participantId: string,
    mediaType: "usermedia" | "displaymedia",
    trackKind: "audio" | "video",
    producerId: string,
  ) => Promise<Consumer>;

  handleProducerCreated: (
    track: MediaStreamTrack,
    socket_producer_type: "UserMedia" | "DisplayMedia",
    local_producer_type: "mic" | "camera" | "screen" | "screen audio",
  ) => Promise<
    Producer<{
      type: "UserMedia" | "DisplayMedia";
    }>
  >;
}

export const useMediasoupStore = create<MediasoupState>((set, get) => ({
  socket: null,
  device: null,
  sendTransport: null,
  recvTransport: null,
  isConnected: false,
  currentChat: null,

  // Подключение к серверу
  connect: (chatId: string) => {
    const socket = io("http://localhost:4002/media", {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket"],
      auth: {
        chat: chatId,
      },
    });
    const device = new Device();

    //setup on connection

    socket.on("connect", () =>
      set({ currentChat: chatId, device }),
    );
    socket.on("disconnect", () => {
      const { recvTransport, sendTransport } = get();
      const { closeProducers } = useUserStore.getState();
      const { removeAll } = useParticipantsStore.getState();
      sendTransport?.close();
      recvTransport?.close();
      closeProducers();
      removeAll();
      set({
        socket: null,
        device: null,
        sendTransport: null,
        recvTransport: null,
        isConnected: false,
        currentChat: null,
      });
    });
    socket.on("rtpCapabilities", async (data, callback) => {
      await get().handleRouterCapabilities(data.rtp);
      callback({ rtpCapabilities: device.rtpCapabilities });
    });
    socket.on("member-created", async () => {
      const { initLocalUser } = useUserStore.getState();
      initLocalUser();
      await get().handleTransportCreated();
      set({ isConnected: true})
    });

    //participants

    socket.on("new-member", ({ memberId }) => {
      const { addParticipant } = useParticipantsStore.getState();
      addParticipant(memberId, "");
    });
    socket.on("member-disconnect", ({ memberId }) => {
      const { removeParticipant } = useParticipantsStore.getState();
      console.log("paricipant dissconnetcted")
      removeParticipant(memberId);
    });
    socket.on("new-producer", async ({ id, producer }) => {
      console.log("new producer", producer);
      const { addConsumer } = useParticipantsStore.getState();
      const consumer = await get().handleConsumerCreated(
        id,
        producer.type == "UserMedia" ? "usermedia" : "displaymedia",
        producer.kind,
        producer.id,
      );

      addConsumer(
        id,
        producer.type == "UserMedia" ? "usermedia" : "displaymedia",
        producer.kind,
        consumer,
      );
    });
    socket.on("consumer-close", ({ consumerId, kind }) => {
      console.log("consumer-close", consumerId);
      const { removeConsumer, findConsumerById } =
        useParticipantsStore.getState();
      const consumer = findConsumerById(consumerId);
      if (consumer){
        removeConsumer(
          consumer.participantId,
          consumer.mediaType,
          consumer.trackKind,
        );

      }
    });

    socket.connect();
    set({ socket });
  },

  // Обработка capabilities роутера
  handleRouterCapabilities: async (
    routerRtpCapabilities: types.RtpCapabilities,
  ) => {
    const { device, socket, currentChat } = get();
    if (!device || !socket) return;

    try {
      await device.load({ routerRtpCapabilities });
    } catch (error) {
      console.error("Device load failed:", error);
    }
  },

  // Создание транспортов
  handleTransportCreated: async () => {
    const { device, socket, handleParticipantCreated } = get();
    if (!device || !socket) return;
    socket.emit("create-transport", (response) => {
      const sendTransport = device.createSendTransport({ ...response });
      setupTransport(sendTransport, "send");

      socket.emit("create-transport", (response) => {
        const recvTransport = device.createRecvTransport({ ...response });
        setupTransport(recvTransport, "recv");
        set({ recvTransport, sendTransport });
        handleParticipantCreated();
      });
    });

    // Настройка обработчиков транспорта
    const setupTransport = (
      transport: Transport,
      direction: "send" | "recv",
    ) => {
      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        // console.log("connect recv transport");
        try {
          await socket.emit("transport-connect", {
            transportId: transport.id,
            dtlsParameters,
          });

          callback();
        } catch (error) {
          errback(error);
        }
      });

      if (direction === "send") {
        transport.on("produce", async (parameters, callback, errback) => {
          try {
            await socket.emit(
              "transport-produce",
              {
                transportId: transport.id,
                kind: parameters.kind,
                rtpParameters: parameters.rtpParameters,
                type: parameters.appData.type,
              },
              ({ id }) => {
                console.log("produce send transport", id);
                callback({ id });
              },
            );
          } catch (error) {
            errback(error);
          }
        });
      }
    };
  },

  handleParticipantCreated: async () => {
    const { socket, handleConsumerCreated } = get();
    const { addParticipant, addConsumer } = useParticipantsStore.getState();
    socket.emit("members-info", ({ membersInfo }) => {
      console.log(membersInfo);

      membersInfo.forEach(
        (memberInfo: {
          id: string;
          producers: {
            display: {
              audio: string | undefined;
              video: string | undefined;
            };
            user: {
              audio: string | undefined;
              video: string | undefined;
            };
          };
        }) => {
          type MediaType = "display" | "user";
          type TrackKind = "audio" | "video";
          const mediaTypes: MediaType[] = ["display", "user"];
          const trackKinds: TrackKind[] = ["audio", "video"];

          const id = memberInfo.id;
          const producers = memberInfo.producers;

          addParticipant(id, "");

          mediaTypes.forEach((mediaType) => {
            trackKinds.forEach(async (trackKind) => {
              const producerId = producers[mediaType][trackKind];
              if (producerId) {
                addConsumer(
                  id,
                  mediaType == "display" ? "displaymedia" : "usermedia",
                  trackKind == "audio" ? "audio" : "video",
                  await handleConsumerCreated(
                    id,
                    mediaType == "display" ? "displaymedia" : "usermedia",
                    trackKind == "audio" ? "audio" : "video",
                    producerId,
                  ),
                );
              }
            });
          });
        },
      );
    });
  },

  handleConsumerCreated: async (
    participantId,
    mediaType,
    trackKind,
    producerId,
  ) => {
    const { socket, recvTransport } = get();

    if (!recvTransport) {
      throw new Error("Receive transport not initialized");
    }
    console.log("1 handle consumer create");
    return new Promise((resolve, reject) => {
      const { removeConsumer } = useParticipantsStore.getState();
      console.log("2 handle consumer create");
      socket.emit(
        "transport-consume",
        { transportId: recvTransport.id, producerId },
        async ({ consumerParams }) => {
          try {
            const consumer = await recvTransport.consume({
              id: consumerParams.id,
              producerId: consumerParams.producerId,
              kind: consumerParams.kind,
              rtpParameters: consumerParams.rtpParameters,
            });

            consumer.on("trackended", () => {
              console.log("trackended");
              removeConsumer(participantId, mediaType, trackKind);
            });
            consumer.on("transportclose", () => {
              console.log("transportclose");
              removeConsumer(participantId, mediaType, trackKind);
            });

            socket.emit("consumer-resume", { consumerId: consumer.id });

            resolve(consumer);
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  },

  handleProducerCreated: async (
    track: MediaStreamTrack,
    socket_producer_type: "UserMedia" | "DisplayMedia",
    local_producer_type: "mic" | "camera" | "screen" | "screen audio",
  ) => {
    if (!track) {
      console.log("not track");
      return;
    }
    const { sendTransport, socket } = get();

    const producer = await sendTransport.produce({
      track: track,
      appData: { type: socket_producer_type },
    });

    producer.on("trackended", () => {
      console.log("track ended");
      const { closeProducer } = useUserStore.getState();
      closeProducer(local_producer_type);
      socket.emit("producer_closed", {
        producerId: producer.id,
      });
    });
    producer.on("transportclose", () => {
      console.log("transport ended");
      const { closeProducer } = useUserStore.getState();
      closeProducer(local_producer_type);
      socket.emit("producer_closed", {
        producerId: producer.id,
      });
    });
    producer.on("@close",()=>{
      console.log("producer closed");
      const { closeProducer } = useUserStore.getState();
      closeProducer(local_producer_type);
      socket.emit("producer_closed", {
        producerId: producer.id,
      });
    })

    return producer;
  },

  // Создание аудио producer
  produceAudio: async () => {
    const { sendTransport, handleProducerCreated } = get();
    if (!sendTransport) throw new Error("Transport not ready");

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const producer = await handleProducerCreated(
      stream.getAudioTracks()[0],
      "UserMedia",
      "mic",
    );

    const { startMicrophone } = useUserStore.getState();
    await startMicrophone(producer);

    return producer;
  },
  //screen
  produceVideo: async () => {
    const { sendTransport, handleProducerCreated } = get();
    if (!sendTransport) throw new Error("Transport not ready");

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    console.log("stream", stream, stream.getVideoTracks);

    const producerSreen = await handleProducerCreated(
      stream.getVideoTracks()[0],
      "DisplayMedia",
      "screen",
    );
    if (stream.getAudioTracks()[0]) {
      const producerAudio = await handleProducerCreated(
        stream.getAudioTracks()[0],
        "DisplayMedia",
        "screen audio",
      );
      const { startScreenShare } = useUserStore.getState();
      await startScreenShare(producerSreen, producerAudio);
      return producerSreen;
    }

    const { startScreenShare } = useUserStore.getState();
    await startScreenShare(producerSreen);

    return producerSreen;
  },
  //camera
  produceCamera:async ()=>{
    const { sendTransport, handleProducerCreated } = get();
    if (!sendTransport) throw new Error("Transport not ready");
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    console.log("stream", stream, stream.getVideoTracks);

    const producer = await handleProducerCreated(
      stream.getVideoTracks()[0],
      "UserMedia",
      "camera",
    );

    const { startCamera } = useUserStore.getState();
    await startCamera(producer);

    return producer;
  },
  stopProduceCamera: async ()=>{
    const { stopCamera } = useUserStore.getState();
    await stopCamera()
  },
  stopProduceAudio:async()=>{
    const { stopMicrophone } = useUserStore.getState();
    await stopMicrophone()
  },
  stopProduceVideo:async()=>{
    const { stopScreenShare } = useUserStore.getState();
    await stopScreenShare()
  },

  // Отключение
  disconnect: () => {
    const { socket } = get();
    if (socket) socket.disconnect();
    set({ socket: null });
  },
}));
