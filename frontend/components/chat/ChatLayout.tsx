"use client";

import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";

export default function ChatLayout() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">

      <div className="mx-auto flex h-[90vh] max-w-7xl overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">

        {/* Sidebar */}

        <aside className="hidden w-80 border-r border-slate-200 bg-white/70 lg:block">
          <ChatSidebar />
        </aside>

        {/* Chat Area */}

        <section className="flex flex-1 flex-col">

          <ChatHeader />

          <div className="flex-1 overflow-y-auto px-8 py-6">
            <ChatWindow />
          </div>

          <div className="border-t border-slate-200 bg-white/60 px-8 py-6">
            <SuggestedPrompts />
            <div className="mt-5">
              <ChatInput />
            </div>
          </div>

        </section>

      </div>

    </main>
  );
}