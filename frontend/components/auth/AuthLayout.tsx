import { ReactNode } from "react";

import AuthHeader from "./AuthHeader";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] px-6 py-10">
      {/* Background Glow */}
      <div className="absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="absolute -right-32 top-0 h-96 w-96 rounded-full bg-teal-200/30 blur-3xl" />

      <div className="w-full max-w-md">

        <div className="animate-fadeIn rounded-[32px] border border-white/60 bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,118,110,0.15)] backdrop-blur-xl">

          <AuthHeader
            title={title}
            subtitle={subtitle}
          />

          {children}

        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Adara
        </p>

      </div>

    </main>
  );
}