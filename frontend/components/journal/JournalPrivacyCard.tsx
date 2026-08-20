import { Lock } from "lucide-react";

export default function JournalPrivacyCard() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
        <Lock className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800">Private by default</p>
        <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
          Only you can see your reflections. They&apos;re tied to your account
          and protected by the same access rules as the rest of your Adara
          data.
        </p>
      </div>
    </div>
  );
}
