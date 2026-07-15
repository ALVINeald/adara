import AuthGuard from "@/components/auth/AuthGuard";
import ChatLayout from "@/components/chat/ChatLayout";

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatLayout />
    </AuthGuard>
  );
}