"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Headphones, BookOpenText, Wind, Sparkles } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { useWellnessSessions } from "@/hooks/useWellnessSessions";

export default function WellnessHubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { sessions } = useWellnessSessions(user?.id);

  const sessionsThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessions.filter(
      (session) => new Date(session.completedAt) >= weekAgo
    ).length;
  }, [sessions]);

  const sections = [
    {
      title: "Breathing Exercises",
      description: "Guided breathing patterns to calm your mind and body.",
      icon: Wind,
      href: "/wellness/breathing",
    },
    {
      title: "Meditation",
      description: "Timed, guided sessions to help you find stillness.",
      icon: Sparkles,
      href: "/wellness/meditation",
    },
    {
      title: "Meditation Playlists",
      description: "Curated calming audio to listen to anytime.",
      icon: Headphones,
      href: "/wellness/playlists",
    },
    {
      title: "Resources",
      description: "Short articles on coping, sleep, and emotional wellbeing.",
      icon: BookOpenText,
      href: "/wellness/articles",
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Wellness Hub</h1>
          <p className="mt-1 text-sm text-slate-500">
            {sessionsThisWeek > 0
              ? `You've completed ${sessionsThisWeek} session${
                  sessionsThisWeek === 1 ? "" : "s"
                } this week. Keep going.`
              : "Take a few minutes for yourself today."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.title}
                onClick={() => router.push(section.href)}
                className="rounded-[28px] bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
                  <Icon className="h-7 w-7 text-cyan-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {section.title}
                </h3>
                <p className="mt-2 leading-7 text-slate-600">
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}