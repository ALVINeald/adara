export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  // Raw ISO date, used for grouping messages by day in the UI.
  // Optional so anywhere that already constructs a ChatMessage
  // without it (like the live streaming placeholder) doesn't break --
  // absence just means "treat as today" in the grouping logic.
  createdAt?: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}