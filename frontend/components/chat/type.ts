export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SuggestedPrompt {
  id: string;
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}