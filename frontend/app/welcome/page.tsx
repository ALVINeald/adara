import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const highlights = [
  {
    title: "AI Companion",
    description:
      "A private conversation space that listens, encourages, and helps you reflect whenever you need support.",
    icon: Sparkles,
  },
  {
    title: "Support Communities",
    description:
      "Join welcoming communities of people who truly understand your journey and remind you that you're never alone.",
    icon: HeartHandshake,
  },
  {
    title: "Professional Care",
    description:
      "Connect with licensed therapists and access professional support whenever you're ready.",
    icon: ShieldCheck,
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#f8fcff_0%,_#eef8fb_45%,_#e8fbf8_100%)] text-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-6 py-10 sm:px-8 lg:px-12">
        {/* Top Navigation */}
        <header className="flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-cyan-700">
            Adara
          </div>

          <Link
            href="/auth/login"
            className="text-sm font-medium text-slate-600 transition hover:text-cyan-700"
          >
            Sign In
          </Link>
        </header>

        {/* Hero */}
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
              ✨ Welcome to Adara
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight tracking-tight">
                You don't have to face life's challenges alone.
              </h1>

              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Adara is a trusted space where compassionate AI, supportive
                communities, and professional care come together to help you
                find hope, one day at a time.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/auth/login">
                <Button size="lg" className="gap-2 rounded-xl px-8">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                variant="outline"
                size="lg"
                className="rounded-xl px-8"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <div className="relative flex h-[360px] w-[360px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 via-sky-50 to-teal-100 shadow-2xl">
              <div className="absolute h-64 w-64 rounded-full bg-white/50 blur-2xl" />

              <div className="relative z-10 text-center">
                <div className="mb-6 text-7xl">🫂</div>

                <h3 className="text-2xl font-semibold text-slate-800">
                  Hope begins here.
                </h3>

                <p className="mt-3 px-10 text-slate-600">
                  Compassion, connection, and support whenever you need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="rounded-3xl border-white/70 bg-white/80 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl backdrop-blur"
              >
                <CardHeader className="space-y-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
                    <Icon className="h-7 w-7 text-cyan-700" />
                  </div>

                  <CardTitle className="text-xl">
                    {item.title}
                  </CardTitle>

                  <CardDescription className="leading-7 text-slate-600">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        {/* Trust Section */}
        <section className="grid gap-6 rounded-3xl bg-white/70 p-8 shadow-sm md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">
              🔒 Private by Design
            </h3>

            <p className="mt-3 text-slate-600">
              Your conversations remain personal and protected.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              🤖 AI Available
            </h3>

            <p className="mt-3 text-slate-600">
              Support is available whenever you need it, day or night.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">
              ❤️ Built Around Hope
            </h3>

            <p className="mt-3 text-slate-600">
              Every feature is designed to remind you that you are never alone.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Adara • Privacy • Terms • Contact
        </footer>
      </div>
    </main>
  );
}