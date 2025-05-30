import { useMediasoupContext } from "@/shared/components/providers/MediasoupProvider";
import { UserWindow } from "./UserWindow";
import { useVolumeTracker } from "@/shared/utils/call/useVolumeTracker";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import useParticipantsStore from "@/shared/hooks/mediasoup/paricipants/participantsStore";
import { useEffect, useMemo, useRef, useState } from "react";
import ParticipantDisplay from "./Video/Participant/DisplayElement";
import ParticipantUserMedia from "./Video/Participant/UserMediaElement";
import LocalDisplay from "./Video/LocalUser/DisplayLocalUser";
import LocalUserMedia from "./Video/LocalUser/UserMediaLocalUser";
import { calculateVideoLayout } from "../../utils/calculateVideoLayout";
import { calculateGridColumns } from "../../utils/calculateGridColumns";

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
  console.log(producerMic, isMicrophoneWork);
  const track = producerMic?.track;

  //размер контейнера
  const elementRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, []);
  //все элементы
  const allVideoElements = useMemo(() => {
    const elements = [];

    // Основные участники (видео + демонстрация экрана)
    participantsList.forEach((participant) => {
      if (participant.consumers.displaymedia.video?.track) {
        elements.push({
          type: "display",
          participant,
          aspectRatio: 16 / 9,
        });
      }

      elements.push({
        type: "userMedia",
        participant,
        aspectRatio: 16 / 9,
      });
    });

    // Локальное видео
    elements.push({
      type: "localUserMedia",
      aspectRatio: 16 / 9,
    });

    // Локальная демонстрация экрана (если есть)
    if (isScreenShare) {
      elements.push({
        type: "localDisplay",
        aspectRatio: 16 / 9,
      });
    }

    return elements;
  }, [participantsList, isScreenShare]);
  //логика размера
  const videoLayouts = useMemo(() => {
    return calculateVideoLayout(
      dimensions.width,
      dimensions.height,
      10,
      10,
      allVideoElements.length,
      16 / 9,
      "grid",
      // isScreenShare ? 'horizontal-scroll' : 'grid'
    );
  }, [dimensions, allVideoElements.length, isScreenShare]);
  //

  // const volume = useVolumeTracker(myStream.getAudioTracks()[0]);
  return (
    <div
      ref={elementRef}
      className="flex h-full w-full flex-row justify-center gap-3 pt-3 pb-3"
    >
      {/* {participantsList.map((participant) => {
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
          <div
            key={participant.id}
            className="aspect-video h-auto max-w-2/3 min-w-2/3"
          >
            <ParticipantUserMedia
              participant={participant}
              showSpeakingIndicator={true}
            />
          </div>
        );
      })}
      {isScreenShare && (
        <div className="aspect-video max-h-full w-1/3">
          <LocalDisplay />
        </div>
      )}
      <div className="aspect-video max-h-full w-1/3">
        <LocalUserMedia />
      </div> */}
      {allVideoElements.map((element, index) => {
        const layout = videoLayouts[index];
        if (!layout) return null;

        const commonStyles = {
          width: `${layout.width}px`,
          height: `${layout.height}px`,
          left: `${layout.x}px`,
          top: `${layout.y}px`,
        };

        switch (element.type) {
          case "display":
            return (
              <div
                key={`display-${element.participant.id}`}
                className="absolute aspect-video"
                style={commonStyles}
              >
                <ParticipantDisplay
                  participant={element.participant}
                  isMuted={false}
                />
              </div>
            );

          case "userMedia":
            return (
              <div
                key={`userMedia-${element.participant.id}`}
                className="absolute"
                style={commonStyles}
              >
                <ParticipantUserMedia
                  participant={element.participant}
                  showSpeakingIndicator={true}
                />
              </div>
            );

          case "localDisplay":
            return (
              <div key="localDisplay" className="absolute" style={commonStyles}>
                <LocalDisplay />
              </div>
            );

          case "localUserMedia":
            return (
              <div
                key="localUserMedia"
                className="absolute"
                style={commonStyles}
              >
                <LocalUserMedia />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
