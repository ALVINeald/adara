import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/navigation/AppShell";
import ChatLayout from "@/components/chat/ChatLayout";
import { ChatSidebarProvider } from "@/lib/chatSidebarContext";

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatSidebarProvider>
        <AppShell noBottomPadding>
          <ChatLayout />
        </AppShell>
      </ChatSidebarProvider>
    </AuthGuard>
  );
}