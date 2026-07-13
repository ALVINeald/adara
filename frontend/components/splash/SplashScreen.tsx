"use client";

import { AdaraLogo } from '@/components/adara-logo';
import { LoadingIndicator } from '@/components/splash/LoadingIndicator';

export function SplashScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,_#f9fdff_0%,_#e7f5fb_45%,_#e6fbf7_100%)] px-6 py-10 text-slate-900">
      <div className="flex w-full max-w-md flex-col items-center justify-center text-center">
        <div className="space-y-5">
          <AdaraLogo />
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl">
              Adara
            </h1>
            <p className="mx-auto max-w-sm text-base leading-7 text-slate-600 sm:text-lg">
              No one should have to face life&apos;s challenges alone.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <LoadingIndicator />
        </div>
      </div>
    </main>
  );
}
