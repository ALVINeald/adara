"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SplashScreen } from '@/components/splash/SplashScreen';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/welcome');
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
