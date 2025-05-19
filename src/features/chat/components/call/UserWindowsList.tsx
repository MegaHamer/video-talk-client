import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";
import { UserWindow } from "./UserWindow";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import useParticipantsStore from "@/shared/hooks/mediasoup/paricipants/participantsStore";
import { useMemo } from "react";
import ParticipantDisplay from "./Video/Participant/DisplayElement";
import ParticipantUserMedia from "./Video/Participant/UserMediaElement";
import LocalDisplay from "./Video/LocalUser/DisplayLocalUser";
import LocalUserMedia from "./Video/LocalUser/UserMediaLocalUser";

export function UserWindowsList() {
  const {
    localUser: { isMuted, isScreenShare, isMicrophoneWork },
    getProducer,
  } = useUserStore();
  const { participants } = useParticipantsStore();
  const participantsList = useMemo(
    () => [...participants.values()],
    [participants],
  );

  const producerMic = getProducer("mic");
  console.log(producerMic);
  const track = producerMic?.track;

  // const volume = useVolumeTracker(myStream.getAudioTracks()[0]);
  return (
    <div className="grow shrink flex flex-wrap flex-row justify-center gap-3 pb-3">
      {participantsList.map((participant) => {
        // const track = participant.consumers.displaymedia.video?.track;
        // if (!track) return "";
        if (!participant.consumers.displaymedia.video?.track) {
          return;
        }
        return (
          <div key={participant.id} className="max-w-2/3">
            <ParticipantDisplay participant={participant} isMuted={false} />
          </div>
        );
      })}
      {participantsList.map((participant) => {
        return (
          <div key={participant.id} className="max-w-2/3 min-w-2/3 h-auto aspect-video">
            <ParticipantUserMedia
              participant={participant}
              showSpeakingIndicator={true}
            />
          </div>
        );
      })}
      {isScreenShare && (
        <div className="max-w-2/3 min-w-2/3 h-auto aspect-video">
          <LocalDisplay />
        </div>
      )}
      <div className="max-w-2/3 min-w-2/3 h-auto aspect-video">
        <LocalUserMedia />
      </div>
    </div>
  );
}
