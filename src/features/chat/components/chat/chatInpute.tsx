import React, { useEffect, useRef, useState } from "react";
import {
  useCreateMessage,
  useDeleteMessage,
  useMessages,
  useUpdateMessage,
} from "../../hooks/useMessages";
import { Message } from "../../types/message.type";
import { useMyProfile } from "@/features/friends/hooks/useGetMyProfile";
import { FaCheck, FaXmark } from "react-icons/fa6";
import { useMediasoupStore } from "@/shared/hooks/mediasoup/newUseMediasoup";
import { useQueryClient } from "@tanstack/react-query";

const ChatMessage = ({
  message,
  currentUserId,
  onSave,
  onDelete,
}: {
  message: Message;
  currentUserId: number;
  onSave: (content: string) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [isOwnMessage] = useState(message.user.id === currentUserId);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Закрытие контекстного меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target as Node)
      ) {
        setIsContextMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOwnMessage) {
      setIsContextMenuOpen(true);
    }
  };

  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleEditStart = () => {
    setEditedContent(message.content);
    setIsEditing(true);
    setIsContextMenuOpen(false);
  };

  const handleSave = () => {
    if (editedContent.trim() && editedContent !== message.content) {
      onSave(editedContent);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  // useEffect(() => {
  //   if (inputRef.current) {
  //     inputRef.current.style.height = "auto";
  //     inputRef.current.style.height = inputRef.current.scrollHeight + "px";
  //   }
  // }, [editedContent]);

  return (
    <div
      className="relative rounded-sm p-2 transition-colors hover:bg-gray-700 dark:hover:bg-gray-700"
      onContextMenu={handleContextMenu}
    >
      <div className="flex items-baseline justify-end gap-2">
        <span
          className="me-auto truncate font-semibold text-blue-400 dark:text-gray-900"
          title={message.user.globalName}
        >
          {message.user.globalName}
        </span>
        <span className="text-xs/tight text-gray-500 dark:text-gray-400">
          {formatMessageTime(message.createdAt)}
          {message.createdAt !== message.updatedAt && (
            <span className="ml-1 text-gray-400 dark:text-gray-500">
              (Измен.)
            </span>
          )}
        </span>
        {isOwnMessage && !isEditing && (
          <button
            onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Действия с сообщением"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="relative mt-1">
          <div className="w-full rounded border border-blue-400 bg-white">
            <textarea
              ref={inputRef}
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              // onBlur={handleSave}
              className="scrollbar scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-w-1.5 scrollbar-hover:scrollbar-thumb-gray-500 me-5 h-full w-full resize-none overflow-y-auto p-2 text-black outline-none dark:bg-gray-800"
              rows={Math.min(Math.max(editedContent.split("\n").length, 6))}
              wrap="soft"
            />
          </div>
          <div className="absolute top-2 right-1 flex flex-col gap-1">
            <button
              onClick={handleSave}
              className="p-1 text-blue-500 hover:text-blue-700"
              title="Сохранить"
            >
              <FaCheck />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-1 text-red-500 hover:text-red-700"
              title="Отменить"
            >
              <FaXmark />
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-1 break-words whitespace-pre-wrap">
          {message.content}
        </p>
      )}

      {isContextMenuOpen && isOwnMessage && (
        <div
          ref={contextMenuRef}
          className="absolute top-8 right-0 z-20 w-40 rounded-md border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800"
        >
          <button
            onClick={handleEditStart}
            className="w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Редактировать
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsContextMenuOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Удалить
          </button>
        </div>
      )}
    </div>
  );
};

export const MessageList = ({ chatId }: { chatId: string }) => {
  const { data: messages, isLoading, error } = useMessages(chatId);
  const createMessage = useCreateMessage(chatId);
  const updateMessage = useUpdateMessage(chatId);
  const deleteMessage = useDeleteMessage(chatId);

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useMyProfile();

  const [canSend, setCanSend] = useState(false);

  const { socket } = useMediasoupStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      // Оптимистичное обновление кэша
      queryClient.setQueryData<Message[]>(
        ["messages", message.chatId],
        (oldMessages = []) => {
          // Проверяем, нет ли уже такого сообщения в кэше
          if (oldMessages.some((m) => m.messageId === message.messageId)) {
            return oldMessages;
          }
          return [...oldMessages, message];
        },
      );

      // Инвалидация для фонового обновления (если нужно)
      queryClient.invalidateQueries({
        queryKey: ["messages", message.chatId],
        exact: true,
      });
    };

    // Подписываемся на событие
    socket.on("new_message", handleNewMessage);

    // Отписываемся при размонтировании
    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [chatId, queryClient]);

  // const handleSubmit = (content: string) => {
  //   createMessage.mutate(content);
  // };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim()) {
      // Отправка сообщения
      createMessage.mutate(inputValue.trim());
      setInputValue(""); // Очищаем textarea
    }
  };

  const handleUpdate = (messageId: number, newContent: string) => {
    updateMessage.mutate({ messageId, content: newContent });
  };

  const handleDelete = (messageId: number) => {
    deleteMessage.mutate(messageId);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
    if (inputValue.trim()) {
      setCanSend(true);
    } else {
      setCanSend(false);
    }
  }, [inputValue]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const atBottom = scrollHeight - scrollTop === clientHeight;
    setAutoScroll(atBottom);
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Группировка сообщений по датам
  const groupMessagesByDate = () => {
    const grouped: Record<string, Message[]> = {};
    if (messages)
      messages.forEach((message) => {
        const date = new Date(message.createdAt).toDateString();
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(message);
      });
    return grouped;
  };

  const groupedMessages = groupMessagesByDate();

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);

    // Проверяем, сегодня ли это
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return "Сегодня";
    }

    // Проверяем, вчера ли это
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return "Вчера";
    }

    // Форматируем другие даты
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };

    return date.toLocaleDateString("ru-RU", options);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        className="scrollbar scrollbar-thumb-gray-300 scrollbar-track-gray-700 scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-w-1 scrollbar-hover:scrollbar-thumb-gray-400 relative -me-1.5 mt-0.5 flex grow flex-col overflow-y-auto pe-1 text-gray-200 transition"
        onScroll={handleScroll}
      >
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <React.Fragment key={date}>
            <div className="sticky top-0 z-10 bg-gray-800 px-3 py-1 text-center text-xs text-gray-400 dark:bg-gray-800 dark:text-gray-400">
              {formatDateHeader(date)}
            </div>
            {dateMessages.map((message) => (
              <ChatMessage
                key={message.messageId}
                message={message}
                currentUserId={currentUser.id}
                onSave={(content) => handleUpdate(message.messageId, content)}
                onDelete={() => {
                  if (confirm("Удалить это сообщение?")) {
                    handleDelete(message.messageId);
                  }
                }}
              />
            ))}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <div className="rounded-lg bg-white py-1 ps-2 pe-1">
            <textarea
              className="scrollbar scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded-full scrollbar-w-1.5 scrollbar-hover:scrollbar-thumb-gray-500 max-h-24 min-h-12 w-full resize-none overflow-y-auto pe-1 outline-none"
              name="content"
              wrap="soft"
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button
            className="rounded-lg bg-blue-500 px-2 py-1 transition-colors duration-100 hover:bg-blue-600 active:bg-blue-400 disabled:bg-gray-400"
            disabled={!canSend}
            type="submit"
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};
