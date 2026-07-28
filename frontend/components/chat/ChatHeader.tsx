import { PanelLeft, ShieldCheck, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur md:px-8 md:py-6">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2 md:gap-4">

          <button
            onClick={onToggleSidebar}
            title="Conversations"
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 md:hidden"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-100 md:h-14 md:w-14">

            <Sparkles className="h-4 w-4 text-cyan-700 md:h-7 md:w-7" />

          </div>

          <div>

            <h1 className="text-base font-bold text-slate-900 md:text-2xl">
              Adara Companion
            </h1>

            <p className="mt-1 hidden text-sm text-slate-500 md:block">
              A calm, private space where you can reflect, heal and grow.
            </p>

          </div>

        </div>

        <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 md:flex">

          <ShieldCheck className="h-5 w-5 text-emerald-600" />

          <span className="text-sm font-medium text-emerald-700">
            Private & Secure
          </span>

        </div>

      </div>

    </header>
  );
}