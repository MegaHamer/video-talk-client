import { Consumer } from "mediasoup-client/types";

type MediaType = "usermedia" | "displaymedia";
type TrackKind = "audio" | "video";

export interface Participant {
  id: string;
  name: string;
  consumers: {
    [key in MediaType]: {
      [key in TrackKind]?: Consumer | null; // displaymedia обычно не имеет audio
    };
  };

  isMuted: boolean;
}
interface ParticipantsState {
  participants: Map<string, Participant>;
  addParticipant: (id: string, name: string) => void;
  removeParticipant: (id: string) => void;
  addConsumer: (
    participantId: string,
    mediaType: MediaType,
    trackKind: TrackKind,
    consumer: Consumer,
  ) => void;
  removeAll: () => void;
  removeConsumer: (
    participantId: string,
    mediaType: MediaType,
    trackKind: TrackKind,
  ) => void;
  muteParticipant: (participantId: string) => void;
  muteAll: () => void;
  unmuteAll: () => void;

  getVideoParticipants: () => Participant[];

  getConsumers: (participantId: string) => [string, Participant][];

  findConsumerById: (consumerId: string) =>
    | {
        participantId: string;
        mediaType: MediaType;
        trackKind: TrackKind;
        consumer: Consumer;
      }
    | undefined;
}

export default ParticipantsState;
