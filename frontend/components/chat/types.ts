export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}