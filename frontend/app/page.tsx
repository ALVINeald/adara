"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { AdaraLogo } from '@/components/adara-logo';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/welcome');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,_#f9fdff_0%,_#e7f5fb_45%,_#e6fbf7_100%)] px-6 py-10 text-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="animate-[fadeIn_900ms_ease-out] space-y-5">
          <AdaraLogo />
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Adara</h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              No one should have to face life&apos;s challenges alone.
            </p>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-center gap-2 text-slate-500">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.3s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500 [animation-delay:-0.15s]" />
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-500" />
        </div>
      </div>
    </main>
  );
}
