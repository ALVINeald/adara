"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface ChatSidebarContextValue {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  triggerNewConversation: () => void;
  registerNewConversationHandler: (handler: () => void) => void;
}

const ChatSidebarContext = createContext<ChatSidebarContextValue | null>(
  null
);

// Wraps AppShell + ChatLayout together on the /chat page only, so
// DesktopRail (a sibling of ChatLayout, not a parent or child of it)
// can read/control the same sidebar state.
export function ChatSidebarProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // A ref, not state -- ChatLayout re-registers its latest
  // startNewConversation closure on every render (cheap, since
  // useConversations doesn't memoize it), and a ref update doesn't
  // trigger a re-render, so this can't cascade into a render loop.
  const newConversationHandlerRef = useRef<() => void>(() => {});

  const registerNewConversationHandler = useCallback((handler: () => void) => {
    newConversationHandlerRef.current = handler;
  }, []);

  const triggerNewConversation = useCallback(() => {
    newConversationHandlerRef.current();
  }, []);

  return (
    <ChatSidebarContext.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        triggerNewConversation,
        registerNewConversationHandler,
      }}
    >
      {children}
    </ChatSidebarContext.Provider>
  );
}

// For ChatLayout -- throws if used outside the provider, since that
// would mean a real bug (the page forgot to wrap in the provider).
export function useChatSidebar() {
  const ctx = useContext(ChatSidebarContext);
  if (!ctx) {
    throw new Error(
      "useChatSidebar must be used within a ChatSidebarProvider"
    );
  }
  return ctx;
}

// For DesktopRail -- renders on every page, most of which have no
// provider, so this returns null instead of throwing.
export function useOptionalChatSidebar() {
  return useContext(ChatSidebarContext);
}
