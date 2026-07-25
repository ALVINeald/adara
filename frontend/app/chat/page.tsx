import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/navigation/AppShell";
import ChatLayout from "@/components/chat/ChatLayout";

export default function ChatPage() {
  return (
    <AuthGuard>
      <AppShell>
        <ChatLayout />
      </AppShell>
    </AuthGuard>
  );
}