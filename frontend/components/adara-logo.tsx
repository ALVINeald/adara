import { Sparkles } from 'lucide-react';

export function AdaraLogo() {
  return (
    <div className="flex items-center justify-center" aria-label="Adara logo">
      <div className="relative flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/60 bg-gradient-to-br from-sky-400 via-cyan-400 to-teal-500 shadow-[0_20px_60px_rgba(15,118,110,0.18)] sm:h-24 sm:w-24">
        <div className="absolute inset-[3px] rounded-[25px] bg-white/80 backdrop-blur-sm" />
        <Sparkles className="relative h-8 w-8 text-slate-700 sm:h-9 sm:w-9" />
      </div>
    </div>
  );
}
