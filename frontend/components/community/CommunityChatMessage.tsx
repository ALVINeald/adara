import type { CommunityMessage } from "@/hooks/useCommunityMessages";

interface CommunityChatMessageProps {
  message: CommunityMessage;
  isOwnMessage: boolean;
}

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CommunityChatMessage({
  message,
  isOwnMessage,
}: CommunityChatMessageProps) {
  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isOwnMessage
            ? "bg-cyan-600 text-white"
            : "bg-white text-slate-800 shadow-sm"
        }`}
      >
        <p className="text-sm leading-6">{message.content}</p>
        <p
          className={`mt-1 text-xs ${
            isOwnMessage ? "text-cyan-100" : "text-slate-400"
          }`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}