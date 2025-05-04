import Input from "@/shared/components/ui/Input";
import useSendFrienshipMutation from "../hooks/useSendFrienship";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FriendSearchForm() {
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { sendRequest, isLoading, error, isError, data } =
    useSendFrienshipMutation();

  useEffect(() => {
    if (axios.isAxiosError(error)) {
      console.log(error);
      console.log(error.response?.data?.message);
      setErrorMessage(
        "Кажется, что-то не так. Проверьте правильное ли имя пользователя вы ввели.",
      );
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await sendRequest(username.trim());
      if (!isError) {
        setUsername("");
      }
    }
  };
  return (
    <div className="flex flex-col gap-3 p-3">
      <div>
        <h1 className="text-xl/tight">Добавить в друзья</h1>
        <p className="text-base/tight">
          Вы можете добавить друзей по имени пользователя
        </p>
      </div>
      <div className="">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage("");
              }}
            />
            <button
              type="submit"
              className="text-background absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-blue-400 px-2 py-1"
            >
              Найти
            </button>
          </div>
          <p>{errorMessage}</p>
        </form>
      </div>
    </div>
  );
}
