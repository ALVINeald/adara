import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

import type { ChatMessage } from "./types";

const messages: ChatMessage[] = [
  {
    id: "1",
    sender: "assistant",
    content:
      "Hello, and welcome to Adara. 💙\n\nI'm really glad you're here today.\n\nThis is your private space where you can talk freely without judgment. How are you feeling right now?",
    timestamp: "09:00 AM",
  },
  {
    id: "2",
    sender: "user",
    content:
      "I've been feeling overwhelmed lately. Everything seems to be happening at once.",
    timestamp: "09:01 AM",
  },
  {
    id: "3",
    sender: "assistant",
    content:
      "Thank you for sharing that with me. It takes courage to say how you're feeling.\n\nYou don't have to carry everything alone. We can work through it together, one step at a time.",
    timestamp: "09:02 AM",
  },
];

export default function ChatWindow() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col">

      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}

      <TypingIndicator />

    </div>
  );
}