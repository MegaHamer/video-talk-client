import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import { CallButton } from "./call/buttons/CallButton";
import { FaPhoneAlt } from "react-icons/fa";
import MuteButton from "./call/buttons/MuteButton";
import DisplayButton from "./call/buttons/DisplayButton";
import DisconnectButton from "./call/buttons/disconnectButton";
import { UserWindowsList } from "./call/UserWindowsList";
import { useEffect, useState } from "react";
import useUserStore from "@/shared/hooks/mediasoup/localUser/localUserStore";
import { useMyProfile } from "@/features/friends/hooks/useGetMyProfile";
import { MdModeEditOutline } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { UpdateUserForm } from "@/features/user/components/UpdateUserForm";
import { useToast } from "@/shared/hooks/useToast";
import { MessageList } from "./chat/chatInpute";
import { twMerge } from "tailwind-merge";
import CameraButton from "./call/buttons/CameraButton";
import getDevices from "@/shared/utils/webrtc/getDevices";
import { DeviceSelector } from "./call/deviceSelector";

export function RoomWindow({
  roomId,
  className,
}: {
  roomId: string;
  className?: string;
}) {
  const { showToast } = useToast();
  const { isConnected, currentChat, produceAudio, sendTransport } =
    useMediasoupStore();

  const [chatIsShown, setChatIsShown] = useState(false);

  useEffect(() => {
    console.log(isConnected, sendTransport);
    if (isConnected && sendTransport) produceAudio();
    
  }, [isConnected, sendTransport]);

  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    speakers: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    camera: '',
    microphone: '',
    speaker: ''
  });
  useEffect(() => {
    const loadDevices = async () => {
      const deviceList = await getDevices();
      setDevices(deviceList);
      console.log(deviceList)
      
      // Устанавливаем первые устройства по умолчанию
      if (deviceList.cameras.length > 0) {
        setSelectedDevices(prev => ({
          ...prev,
          camera: deviceList.cameras[0].deviceId
        }));
      }
      
      if (deviceList.microphones.length > 0) {
        setSelectedDevices(prev => ({
          ...prev,
          microphone: deviceList.microphones[0].deviceId
        }));
      }
    };
    
    loadDevices();
  }, []);

  const { data: Profile, isSuccess, isPending } = useMyProfile();
  const [globalName, setGlobalName] = useState(Profile?.globalName || "");

  useEffect(() => {
    if (isSuccess) {
      setGlobalName(Profile?.globalName || "");
    }
  }, [isSuccess, Profile?.username]);

  const onChangeSuccess = () => {
    showToast("Данные сохраненны!", "success");
  };

  if (!isConnected) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col gap-3 rounded-2xl bg-gray-800 p-3.5">
          <Link href={"/"} className="mb-1.5 text-sm/tight text-white">
            Назад
          </Link>
          {/* Профиль */}
          {/* <div>
            загрузка фото
            <div className="relative flex justify-center pb-3">
              <input className="absolute" hidden></input>
              {Profile?.avatar && (
                <Image
                  src={process.env.SERVER_URL + Profile.avatar}
                  alt={Profile?.username}
                  width={96}
                  height={96}
                  className="rounded-2xl bg-gray-100"
                />
              )}
            </div>
            изменение имени
            <div className="relative flex items-center justify-center">
              <input
                className="w-min text-center text-white"
                disabled
                value={globalName}
              ></input>
              <button className="absolute right-0 rounded-xl bg-blue-600 p-2 text-white transition hover:bg-blue-700 active:bg-blue-500">
                <MdModeEditOutline />
              </button>
            </div>
          </div> */}
          {!isPending && <UpdateUserForm onSuccess={onChangeSuccess} />}
          {/* кнопки */}
          <div className="flex flex-row justify-around">
            {/* кнопка входа */}
            <CallButton
              className="group flex aspect-square items-center justify-center rounded-xl bg-green-500 p-2.5"
              chatId={roomId}
            >
              <FaPhoneAlt className="size-5 text-gray-800 transition group-hover:text-gray-600" />
            </CallButton>
            {/* кнопка настройки */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-row bg-blue-900">
      <div className="flex h-full shrink grow flex-col">
        {/* video content */}
        <div className="grow">
          <UserWindowsList />
        </div>
        {/* btns */}
        <div className="flex justify-center">
          <div className="mb-2 flex flex-row gap-2">
            <div className="flex flex-row items-center rounded-2xl bg-gray-400 p-1">
              <MuteButton className="rounded-xl p-2.5 transition hover:bg-white/20" />

              <DisplayButton className="rounded-xl p-2.5 transition hover:bg-white/20" />
              <CameraButton className="rounded-xl p-2.5 transition hover:bg-white/20" />
            </div>
            <div className="flex items-center justify-center overflow-auto rounded-2xl bg-gray-400">
              <button
                onClick={() => {
                  setChatIsShown(!chatIsShown);
                }}
                className="size-full px-3 font-semibold transition hover:bg-white/20"
              >
                Чат
              </button>
            </div>
            {/* <div className=" flex items-center"> */}
            <DisconnectButton className="rounded-2xl bg-red-600 p-2.5 transition hover:bg-red-500" />
            {/* </div> */}
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          "absolute h-full w-full p-0 sm:static sm:w-2xs sm:p-1",
          chatIsShown ? "sm:block" : "hidden",
        )}
      >
        <div
          className={twMerge(
            "relative h-full w-full rounded-none bg-gray-800 p-2 sm:rounded-lg",
          )}
        >
          <button
            className="absolute top-0 right-0 z-30 rounded-lg px-2 py-0.5 text-sm text-gray-300 transition hover:bg-white/10"
            onClick={() => setChatIsShown(false)}
          >
            Закрыть
          </button>
          <MessageList chatId={roomId} />
        </div>
      </div>
    </div>
  );
}
