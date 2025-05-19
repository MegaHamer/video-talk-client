import { Device, types } from "mediasoup-client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useMediaSocketStore } from "../components/store/mediaSocketStore";
import { MediaKind } from "mediasoup-client/types";

type ProducerInfo = {
  audio: string | null;
  video: string | null;
};

export const useMediasoup = () => {
  // mediasoup
  const [device, setDevice] = useState<types.Device | null>(null);
  const { socket, connect, disconnect, isConnected, currentChat } =
    useMediaSocketStore();
  // const [socket, setSocket] = useState<Socket | null>(null);
  // const [isConnect, setIsConnect] = useState(false);
  const [producerTransport, setProducerTransport] =
    useState<types.Transport | null>(null);
  const [consumerTransport, setConsumerTransport] =
    useState<types.Transport | null>(null);
  const [producers, setProducers] = useState<Map<string, types.Producer>>(
    new Map(),
  );
  const [consumers, setConsumers] = useState<Map<string, types.Consumer>>(
    new Map(),
  );
  //users
  //<userId,{producers:<consumerId,consumerId>}
  const [members, setMembers] = useState<
    Map<
      string,
      {
        memberId: string;
        DisplayProducers: ProducerInfo;
        UserProducers: ProducerInfo;
      }
    >
  >(new Map());
  const [localProducers, setLocalProducers] = useState<{
    DisplayProducers: ProducerInfo;
    UserProducers: ProducerInfo;
  }>({
    DisplayProducers: { audio: null, video: null },
    UserProducers: { audio: null, video: null },
  });

  const refLocalProducers = useRef(localProducers);
  useEffect(() => {
    refLocalProducers.current = localProducers;
  }, [localProducers]);

  const [isVideoBroadcast, setIsVideoBroadcast] = useState(false);
  const [isMicrophoneBroadcast, setIsMicrophoneBroadcast] = useState(false);
  const [isCameraBroadcast, setIsCameraBroadcast] = useState(false);

  useEffect(() => {
    const displayProducers = localProducers.DisplayProducers;
    if (displayProducers.audio || displayProducers.video) {
      setIsVideoBroadcast(true);
    } else {
      setIsVideoBroadcast(false);
    }
    const userProducers = localProducers.UserProducers;
    setIsMicrophoneBroadcast(!!userProducers.audio);
    setIsCameraBroadcast(!!userProducers.video);
  }, [localProducers]);

  const [isReadyToCreateTransport, setIsReadyToCreateTransport] =
    useState(false);

  const refConsumerTransport = useRef(consumerTransport);
  useEffect(() => {
    refConsumerTransport.current = consumerTransport;
  }, [consumerTransport]);
  const refProducerTransport = useRef(producerTransport);
  useEffect(() => {
    refProducerTransport.current = producerTransport;
  }, [producerTransport]);

  const [isMicMuted, setIsMicMuted] = useState(false);

  // useEffect(() => {
  //   console.log("34 members change", members);
  // }, [members]);

  useEffect(() => {
    if (socket) {
      socket.on("rtpCapabilities", async (data, callback) => {
        //console.log("1 rtpCapabilities");
        const newDevice = new Device();
        await newDevice.load({ routerRtpCapabilities: data.rtp });
        setDevice(newDevice);
        callback({ rtpCapabilities: newDevice.rtpCapabilities });
      });
      socket.on("member-created", () => {
        //console.log("member-created");
        setIsReadyToCreateTransport(true);
      });
      socket.on("new-producer", ({ id, producer }) => {
        //console.log("new producer id", producer);
        createConsumer(id, producer.id, producer.type);
      });
      socket.on("consumer-close", ({ consumerId }) => {
        console.log("consumer-close", consumerId);
        deleteConsumer(String(consumerId));
      });
      socket.on("new-member", ({ memberId }) => {
        console.log("new-member", memberId);
        getOrCreateMember(memberId);
      });
      socket.on("member-disconnect", ({ memberId }) => {
        console.log("member-disconnect", memberId);
        deleteMember(memberId);
      });
      socket.on("disconnect", () => {
        console.log("disconnect");
        stopTracks();
        setProducerTransport(null);
        setConsumerTransport(null);
        setDevice(null);
        setProducers(new Map());
        setConsumers(new Map());
        setMembers(new Map());
        setIsMicMuted(false);
        setIsReadyToCreateTransport(false);
      });
    }
  }, [socket]);

  //create transports
  useEffect(() => {
    if (device && socket && isReadyToCreateTransport) {
      //console.log("create transports");
      //console.log("2 device");
      createSendTransport();
      createConsumerTransport();
    }
  }, [device, socket, isReadyToCreateTransport]);
  //при создании consumer transpport запросить информацию об участниках
  useEffect(() => {
    if (consumerTransport) {
      //console.log("3 consuem transport");
      socket.emit("members-info", ({ membersInfo }) => {
        // console.log(membersInfo);
        membersInfo.forEach((memberInfo) => {
          console.log(memberInfo);
          getOrCreateMember(memberInfo.id);
          const userAudio = memberInfo.producers.user.audio;
          const userVideo = memberInfo.producers.user.video;
          const displayAudio = memberInfo.producers.display.audio;
          const displayVideo = memberInfo.producers.display.video;
          if (userAudio) createConsumer(memberInfo.id, userAudio, "UserMedia");
          if (userVideo) createConsumer(memberInfo.id, userVideo, "UserMedia");
          if (displayAudio)
            createConsumer(memberInfo.id, displayAudio, "DisplayMedia");
          if (displayVideo)
            createConsumer(memberInfo.id, displayVideo, "DisplayMedia");
          //
        });
      });
    }
  }, [consumerTransport]);
  //  createSendTransport
  const createSendTransport = async () => {
    socket.emit("create-transport", (response) => {
      const producerTransport = device.createSendTransport({ ...response });
      //console.log("create send transport", producerTransport);

      producerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            //console.log("connect send transport");
            //подтверждение
            await socket.emit("transport-connect", {
              transportId: producerTransport.id,
              dtlsParameters: dtlsParameters,
            });
            //успех
            callback();
          } catch (error) {
            errback(error);
          }
        },
      );

      producerTransport.on("produce", async (parameters, callback, errback) => {
        try {
          await socket.emit(
            "transport-produce",
            {
              transportId: producerTransport.id,
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
      setProducerTransport(producerTransport);
    });
  };
  // createConsumerTransport
  const createConsumerTransport = () => {
    socket.emit("create-transport", (response) => {
      const consumerTransport = device.createRecvTransport({ ...response });
      // console.log("create recv transport");

      consumerTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          // console.log("connect recv transport");
          try {
            await socket.emit("transport-connect", {
              transportId: consumerTransport.id,
              dtlsParameters,
            });

            callback();
          } catch (error) {
            errback(error);
          }
        },
      );
      setConsumerTransport(consumerTransport);
    });
  };
  //добавить участника
  const getOrCreateMember = (memberId) => {
    const stringId = String(memberId);
    if (!members.has(stringId)) {
      members.set(stringId, {
        memberId: stringId,
        DisplayProducers: { audio: null, video: null },
        UserProducers: { audio: null, video: null },
      });
      setMembers(new Map(members));
    }
    return members.get(stringId);
  };
  //
  const deleteMember = (memberId) => {
    const stringId = String(memberId);
    console.log("delete member");
    if (members.has(stringId)) {
      members.delete(stringId);
      setMembers(new Map(members));
    }
  };
  // получить consumer
  const createConsumer = async (
    memberId,
    producerId,
    type: "UserMedia" | "DisplayMedia",
  ) => {
    await socket.emit(
      "transport-consume",
      { transportId: refConsumerTransport.current.id, producerId },
      async ({ consumerParams }) => {
        // console.log("create consume", consumerParams);
        // console.log("rtpPasrams", consumerParams.rtpParameters);
        const consumer = await refConsumerTransport.current.consume({
          id: consumerParams.id,
          producerId: consumerParams.producerId,
          kind: consumerParams.kind,
          rtpParameters: consumerParams.rtpParameters,
        });
        consumer.on("trackended", () => {
          console.log("trackended");
          consumers.delete(consumer.id);
          if (type == "DisplayMedia") {
            if (kind == "audio") member.DisplayProducers.audio = null;
            if (kind == "video") member.DisplayProducers.video = null;
          }
          if (type == "UserMedia") {
            if (kind == "audio") member.UserProducers.audio = null;
            if (kind == "video") member.UserProducers.video = null;
          }
          setMembers(new Map(members));
        });
        consumer.on("transportclose", () => {
          console.log("transportclose");
          consumers.delete(consumer.id);
          if (type == "DisplayMedia") {
            if (kind == "audio") member.DisplayProducers.audio = null;
            if (kind == "video") member.DisplayProducers.video = null;
          }
          if (type == "UserMedia") {
            if (kind == "audio") member.UserProducers.audio = null;
            if (kind == "video") member.UserProducers.video = null;
          }
          setMembers(new Map(members));
        });
        consumer.observer.on("close", () => {
          console.log("consumer close");
        });
        consumer.on("@close", () => {
          console.log("consumer close");
        });
        consumers.set(consumer.id, consumer);

        getOrCreateMember(memberId);

        const member = members.get(memberId);
        const kind = consumer.kind;

        if (type == "DisplayMedia") {
          if (kind == "audio") member.DisplayProducers.audio = consumer.id;
          if (kind == "video") member.DisplayProducers.video = consumer.id;
        }
        if (type == "UserMedia") {
          if (kind == "audio") member.UserProducers.audio = consumer.id;
          if (kind == "video") member.UserProducers.video = consumer.id;
        }

        setMembers(new Map(members));

        socket.emit("consumer-resume", { consumerId: consumer.id });
      },
    );
  };
  const deleteConsumer = (consumerId: string) => {
    if (consumers.has(consumerId)) {
      consumers.get(consumerId).close();
      consumers.delete(consumerId);
    }
    for (const [key, member] of members) {
      if (member.DisplayProducers.audio === consumerId) {
        member.DisplayProducers.audio = null;
      }
      if (member.DisplayProducers.video === consumerId) {
        member.DisplayProducers.video = null;
      }
      if (member.UserProducers.audio === consumerId) {
        member.UserProducers.audio = null;
      }
      if (member.UserProducers.video === consumerId) {
        member.UserProducers.video = null;
      }
    }
    setMembers(new Map(members));
  };
  // отправлять медиа
  const createProducer = async (
    track: MediaStreamTrack,
    { type }: { type: "UserMedia" | "DisplayMedia" },
  ) => {
    if (!track) {
      console.log("not track");
      return;
    }
    const producer = await refProducerTransport.current.produce({
      track: track,
      appData: { type },
    });

    producer.on("trackended", () => {
      console.log("track ended");
      deleteProducer(type, producer.kind);
    });

    producer.on("transportclose", () => {
      console.log("transport ended");
      deleteProducer(type, producer.kind);
    });

    producer.on("@close", () => {
      console.log("producer @close");
    });

    producers.set(producer.id, producer);

    if (type == "DisplayMedia") {
      if (producer.kind == "audio")
        setLocalProducers((prev) => ({
          ...prev,
          DisplayProducers: { ...prev.DisplayProducers, audio: producer.id },
        }));
      if (producer.kind == "video")
        setLocalProducers((prev) => ({
          ...prev,
          DisplayProducers: { ...prev.DisplayProducers, video: producer.id },
        }));
    }
    if (type == "UserMedia") {
      if (producer.kind == "audio")
        setLocalProducers((prev) => ({
          ...prev,
          UserProducers: { ...prev.UserProducers, audio: producer.id },
        }));
      if (producer.kind == "video")
        setLocalProducers((prev) => ({
          ...prev,
          UserProducers: { ...prev.UserProducers, video: producer.id },
        }));
    }

    console.log("producers created", producer.id, ...producers.values());
  };
  const deleteProducer = (
    type: "UserMedia" | "DisplayMedia",
    kind: MediaKind,
  ) => {
    var producerId;
    if (type == "DisplayMedia") {
      if (kind == "audio") {
        producerId = refLocalProducers.current.DisplayProducers.audio;
        setLocalProducers((prev) => ({
          ...prev,
          DisplayProducers: { ...prev.DisplayProducers, audio: null },
        }));
      }
      if (kind == "video") {
        producerId = refLocalProducers.current.DisplayProducers.video;
        setLocalProducers((prev) => ({
          ...prev,
          DisplayProducers: { ...prev.DisplayProducers, video: null },
        }));
      }
    }
    if (type == "UserMedia") {
      if (kind == "audio") {
        producerId = refLocalProducers.current.UserProducers.audio;
        setLocalProducers((prev) => ({
          ...prev,
          UserProducers: { ...prev.UserProducers, audio: null },
        }));
      }
      if (kind == "video") {
        producerId = refLocalProducers.current.UserProducers.video;
        setLocalProducers((prev) => ({
          ...prev,
          UserProducers: { ...prev.UserProducers, video: null },
        }));
      }
    }
    console.log("delte producer", producers.has(producerId), producerId);
    if (producers.has(producerId)) {
      const producer = producers.get(producerId);
      producer.track.stop();
      console.log(producer.track);
      producer.close();
      producers.delete(producerId);
      socket.emit("producer_closed", {
        producerId: producer.id,
      });
    }
  };
  //отпарвить медиа микрофона
  const broadcastMicro = async () => {
    var track: MediaStreamTrack | null = null;
    await navigator.mediaDevices
      .getUserMedia({
        audio: {
          noiseSuppression: true, // подавление шума
          echoCancellation: true, // устранение эха
          autoGainControl: true, // автоматическая регулировка громкости
        },
      })
      .then((stream) => {
        const tracks = stream.getAudioTracks();
        track = tracks[0];
      })
      .catch((error) => {
        console.log(error.message);
      });
    console.log(track);
    await createProducer(track, { type: "UserMedia" });
    // return track;
  };
  const muteMicrophone = async () => {
    if (isMicMuted) {
      await producers
        .get(refLocalProducers.current.UserProducers.audio)
        ?.resume();
    } else {
      await producers
        .get(refLocalProducers.current.UserProducers.audio)
        ?.pause();
    }
    setIsMicMuted(!isMicMuted);
  };
  //отправить медиа камеры
  const brodcastCamera = async () => {
    var track: MediaStreamTrack | null = null;
    await navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        const tracks = stream.getAudioTracks();
        track = tracks[0];
      })
      .catch((error) => {
        console.log(error.message);
      });

    await createProducer(track, { type: "UserMedia" });
    return track;
  };
  const brodcastVideo = async () => {
    var audioTrack: MediaStreamTrack | null = null;
    var videoTrack: MediaStreamTrack | null = null;
    await navigator.mediaDevices
      .getDisplayMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        audioTrack = stream.getAudioTracks()[0];
        videoTrack = stream.getVideoTracks()[0];
      })
      .catch((error) => {
        console.log(error.message);
      });

    await createProducer(audioTrack, { type: "DisplayMedia" });
    await createProducer(videoTrack, { type: "DisplayMedia" });
    return videoTrack;
  };
  const stopTracks = () => {
    const producersArr = [...producers.values()];
    console.log("producers", producersArr);
    producersArr.forEach((producer) => {
      producer.track.stop();
      // producer.track = null
      producer.close();
    });
  };
  const stopBroadcastVideo = () => {
    // const stream = getMyStream("DisplayMedia")
    // if (stream){
    //   stream.getTracks().forEach(track=>{
    //     track.stop()
    //     stream.removeTrack(track)
    //   })
    // }
    deleteProducer("DisplayMedia", "audio");
    deleteProducer("DisplayMedia", "video");
  };
  const stopBroadcastMicrophone = () => {
    deleteProducer("UserMedia", "audio");
  };
  const stopBroadcastCamera = () => {
    deleteProducer("UserMedia", "video");
  };

  //извлечь медиа
  const getStream = (memberId: string, type: "UserMedia" | "DisplayMedia") => {
    const member = members.get(memberId);
    if (!member) return null;
    if (type == "UserMedia") {
      const stream = new MediaStream();
      const audio = consumers.get(member.UserProducers.audio)?.track;
      const video = consumers.get(member.UserProducers.video)?.track;
      if (audio) stream.addTrack(audio.clone());
      if (video) stream.addTrack(video.clone());
      if (stream.getTracks().length > 0) return stream;
    }
    if (type == "DisplayMedia") {
      const stream = new MediaStream();
      const audio = consumers.get(member.DisplayProducers.audio)?.track;
      const video = consumers.get(member.DisplayProducers.video)?.track;
      if (audio) stream.addTrack(audio.clone());
      if (video) stream.addTrack(video.clone());
      if (stream.getTracks().length > 0) return stream;
    }
    return null;
  };

  const userStreamRef = useRef<MediaStream | null>(null);
  const displayStreamRef = useRef<MediaStream | null>(null);

  const getMyStream = (type: "UserMedia" | "DisplayMedia") => {
    // Выбираем нужный поток
    const streamRef = type === "UserMedia" ? userStreamRef : displayStreamRef;

    // Получаем текущие треки
    const audioProducer = producers.get(
      type === "UserMedia"
        ? localProducers.UserProducers.audio
        : localProducers.DisplayProducers.audio,
    );
    const videoProducer = producers.get(
      type === "UserMedia"
        ? localProducers.UserProducers.video
        : localProducers.DisplayProducers.video,
    );

    // Если поток не создан — инициализируем
    if (!streamRef.current) {
      streamRef.current = new MediaStream();
    }

    // Удаляем старые треки
    streamRef.current
      .getTracks()
      .forEach((track) => streamRef.current!.removeTrack(track));

    // Добавляем актуальные треки
    if (audioProducer?.track) streamRef.current.addTrack(audioProducer.track);
    if (videoProducer?.track) streamRef.current.addTrack(videoProducer.track);

    return streamRef.current;

    // if (type == "UserMedia") {
    //   const stream = new MediaStream();
    //   const audio = producers.get(localProducers.UserProducers.audio)?.track;
    //   const video = producers.get(localProducers.UserProducers.video)?.track;
    //   if (audio) stream.addTrack(audio);
    //   if (video) stream.addTrack(video);
    //   return stream;
    // }
    // if (type == "DisplayMedia") {
    //   const stream = new MediaStream();
    //   const audio = producers.get(localProducers.DisplayProducers.audio)?.track;
    //   const video = producers.get(localProducers.DisplayProducers.video)?.track;
    //   if (audio) stream.addTrack(audio);
    //   if (video) stream.addTrack(video);
    //   return stream;
    // }
    // return null;
  };

  const checkMediaDevices = async () => {
    try {
      // Запрашиваем список устройств
      const devices = await navigator.mediaDevices.enumerateDevices();

      const hasMicrophone = devices.some(
        (device) => device.kind === "audioinput",
      );
      const hasCamera = devices.some((device) => device.kind === "videoinput");

      console.log("Микрофон доступен:", hasMicrophone);
      console.log("Камера доступна:", hasCamera);

      return { hasMicrophone, hasCamera };
    } catch (error) {
      console.log("Ошибка при проверке устройств:", error);
      return { hasMicrophone: false, hasCamera: false };
    }
  };

  const listCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind === "videoinput");

    if (cameras.length === 0) {
      console.log("Камеры не найдены");
      return;
    }

    console.log("Доступные камеры:");
    cameras.forEach((camera, index) => {
      console.log(`${index + 1}: ${camera.label || `Камера ${index + 1}`}`);
    });
  };
  const listMicrophone = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const microphones = devices.filter(
      (device) => device.kind === "audioinput",
    );

    if (microphones.length === 0) {
      console.log("Микрофоны не найдены");
      return;
    }

    console.log("Доступные камеры:");
    microphones.forEach((camera, index) => {
      console.log(`${index + 1}: ${camera.label || `Микрофон ${index + 1}`}`);
    });
  };

  const check = () => {
    socket.emit("check", (data) => {
      console.log(data);
    });
  };
  const localCheck = () => {
    console.log("socket", socket);
    console.log("device", device);
    console.log("producerTransport", producerTransport);
    console.log("consumerTransport", consumerTransport);
    console.log("producers", producers);
    console.log("consumers", consumers);
    console.log("members", [...members.values()]);
  };

  return {
    connect,
    disconnect,
    isConnected,
    broadcastMicro,
    muteMicrophone,
    isMicMuted,
    brodcastCamera,
    brodcastVideo,
    members,
    getStream,
    check,
    localCheck,
    stopTracks,
    stopBroadcastVideo,
    stopBroadcastMicrophone,
    stopBroadcastCamera,
    isVideoBroadcast,
    isCameraBroadcast,
    isMicrophoneBroadcast,
    currentChat,
    getMyStream,
  };
};
