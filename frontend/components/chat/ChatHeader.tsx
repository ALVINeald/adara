import { ShieldCheck, Sparkles } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/70 px-8 py-6 backdrop-blur">

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100">

            <Sparkles className="h-7 w-7 text-cyan-700" />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-slate-900">
              Adara Companion
            </h1>

            <p className="mt-1 text-sm text-slate-500">
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