export interface Message {
  messageId: number;
  chatId: string;
  user: {
    id: number;
    globalName: string;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
  content: string;
}
