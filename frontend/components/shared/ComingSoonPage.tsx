import type { LucideIcon } from "lucide-react";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/navigation/AppShell";

interface ComingSoonPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function ComingSoonPage({
  icon: Icon,
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <AuthGuard>
      <AppShell>
        <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] px-6 py-10">
          <div className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/80 p-10 text-center shadow-[0_25px_80px_rgba(15,118,110,0.10)] backdrop-blur-xl">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100">
              <Icon className="h-8 w-8 text-cyan-700" />
            </div>

            <h1 className="text-xl font-bold text-slate-900">{title}</h1>

            <p className="mt-2 text-sm text-slate-500">{description}</p>

            <span className="mt-6 inline-block rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
              Coming soon
            </span>

          </div>
        </main>
      </AppShell>
    </AuthGuard>
  );
}
