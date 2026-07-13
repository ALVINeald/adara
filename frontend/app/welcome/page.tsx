import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const highlights = [
  {
    title: 'Gentle guidance',
    description: 'Supportive prompts that help you pause and reflect.',
    icon: Sparkles,
  },
  {
    title: 'Safe and private',
    description: 'A calm foundation built with care and trust in mind.',
    icon: ShieldCheck,
  },
  {
    title: 'Compassionate support',
    description: 'A welcoming experience designed for emotional wellbeing.',
    icon: HeartHandshake,
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#f8fcff_0%,_#eef8fb_45%,_#e8fbf8_100%)] px-6 py-10 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="rounded-[32px] border border-white/70 bg-white/70 p-8 shadow-[0_20px_80px_rgba(15,118,110,0.10)] backdrop-blur xl:p-12">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
              Welcome to Adara
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                A calmer way to care for yourself.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Adara is a thoughtful space for reflection, support, and hope — designed to feel simple, warm, and deeply human.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn more
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-white/70 bg-white/70 shadow-sm backdrop-blur">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50">
                    <Icon className="h-5 w-5 text-cyan-700" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
