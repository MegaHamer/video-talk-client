// stores/participants.ts
import { create } from "zustand";
import { Consumer } from "mediasoup-client/types";
import ParticipantsState from "./Participant";

const useParticipantsStore = create<ParticipantsState>((set, get) => ({
  participants: new Map(),

  // Добавить участника
  addParticipant: (id, name) => {
    set((state) => {
      const newParticipants = new Map(state.participants);
      newParticipants.set(id, {
        id,
        name,
        consumers: {
          usermedia: { audio: null, video: null },
          displaymedia: { video: null },
        },
        isMuted: false,
      });
      return { participants: newParticipants };
    });
  },

  // Удалить участника
  removeParticipant: (id) => {
    set((state) => {
      const participant = state.participants.get(id);
      // Закрываем все consumers
      Object.values(participant?.consumers || {}).forEach((media) => {
        Object.values(media).forEach((consumer) => consumer?.close());
      });

      const newParticipants = new Map(state.participants);
      newParticipants.delete(id);
      return { participants: newParticipants };
    });
  },
  removeAll: () => {
    set((state) => {
      [...state.participants.values()].map((participant) => {
        // Закрываем все consumers
        Object.values(participant?.consumers || {}).forEach((media) => {
          Object.values(media).forEach((consumer) => consumer?.close());
        });
      });
      const newParticipants = new Map(state.participants);
      newParticipants.clear();
      return { participants: newParticipants };
    });
  },

  // Добавить consumer (аудио/видео)
  addConsumer: (participantId, mediaType, trackKind, consumer) => {
    set((state) => {
      const participant = state.participants.get(participantId);
      if (!participant) return state;

      const newParticipants = new Map(state.participants);
      newParticipants.set(participantId, {
        ...participant,
        consumers: {
          ...participant.consumers,
          [mediaType]: {
            ...participant.consumers[mediaType],
            [trackKind]: consumer,
          },
        },
      });
      return { participants: newParticipants };
    });
  },
  removeConsumer: (participantId, mediaType, trackKind) => {
    set((state) => {
      const participant = state.participants.get(participantId);
      if (!participant) return state;

      const consumer = participant.consumers[mediaType][trackKind];
      consumer?.close();

      const newParticipants = new Map(state.participants);
      newParticipants.set(participantId, {
        ...participant,
        consumers: {
          ...participant.consumers,
          [mediaType]: {
            ...participant.consumers[mediaType],
            [trackKind]: null,
          },
        },
      });
      return { participants: newParticipants };
    });
  },

  // Заглушить конкретного участника
  muteParticipant: (participantId) => {
    set((state) => {
      const participant = state.participants.get(participantId);
      if (!participant) return state;

      const audioConsumer = participant.consumers.usermedia.audio;
      audioConsumer?.pause();

      const newParticipants = new Map(state.participants);
      newParticipants.set(participantId, {
        ...participant,
        isMuted: true,
      });
      return { participants: newParticipants };
    });
  },
  unmuteParticipant: (participantId) => {
    set((state) => {
      const participant = state.participants.get(participantId);
      if (!participant) return state;

      const audioConsumer = participant.consumers.usermedia.audio;
      audioConsumer?.resume();

      const newParticipants = new Map(state.participants);
      newParticipants.set(participantId, {
        ...participant,
        isMuted: false,
      });
      return { participants: newParticipants };
    });
  },

  // Заглушить всех
  muteAll: () => {
    set((state) => {
      const newParticipants = new Map(state.participants);
      newParticipants.forEach((participant) => {
        participant.consumers.usermedia.audio?.pause();
        participant.isMuted = true;
      });
      return { participants: newParticipants };
    });
  },

  // Включить звук у всех
  unmuteAll: () => {
    set((state) => {
      const newParticipants = new Map(state.participants);
      newParticipants.forEach((participant) => {
        participant.consumers.usermedia.audio?.resume();
        participant.isMuted = false;
      });
      return { participants: newParticipants };
    });
  },
  getVideoParticipants: () => {
    const { participants } = get();
    return [...participants.values()].filter(
      (p) => p.consumers.displaymedia.video?.track,
    );
  },
  getConsumers: (participantId) => {
    const { participants } = get();
    return Array.from(participants.entries()).filter(
      ([_, producer]) => producer !== null,
    );
  },
  findConsumerById: (consumerId) => {
    const { participants } = get();
    type MediaType = "usermedia" | "displaymedia";
    type TrackKind = "audio" | "video";
    console.log(participants)
    for (const [participantId, participant] of participants.entries()) {
      for (const mediaType of ["usermedia", "displaymedia"] as MediaType[]) {
        for (const trackKind of ["audio", "video"] as TrackKind[]) {
          const consumer = participant.consumers[mediaType][trackKind];
          if (consumer?.id === consumerId) {
            return {
              participantId,
              mediaType,
              trackKind,
              consumer,
            };
          }
        }
      }
    }

    return undefined;
  },
}));

export default useParticipantsStore;
