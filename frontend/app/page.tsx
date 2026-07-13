import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ShieldCheck, Brain, HeartHandshake } from 'lucide-react';

const features = [
  {
    title: 'Gentle AI guidance',
    description: 'Supportive prompts and reflective check-ins that feel calm, clear, and human-centered.',
    icon: Sparkles,
  },
  {
    title: 'Private by design',
    description: 'A secure foundation for future wellness experiences with thoughtful data handling.',
    icon: ShieldCheck,
  },
  {
    title: 'Personal growth insights',
    description: 'A structured space to understand patterns, intentions, and meaningful next steps.',
    icon: Brain,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_55%)] px-6 py-12 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">Adara</Badge>
              <Badge variant="outline">AI-powered mental wellness</Badge>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                A more compassionate digital space for wellbeing.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600">
                Adara brings calm, intelligent support to everyday emotional care with a foundation designed for empathy, clarity, and growth.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg">Start your journey</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline">
                    Explore the concept
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Welcome to Adara</DialogTitle>
                    <DialogDescription>This dialog is ready for future wellness flows and onboarding experiences.</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-slate-700" />
                Companion overview
              </CardTitle>
              <CardDescription>Designed to feel warm, supportive, and easy to navigate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="Adara companion" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Adara Companion</p>
                  <p className="text-sm text-slate-500">Always here for calm reflection</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Input placeholder="How are you feeling today?" className="flex-1" />
                <Button>Check in</Button>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start">
                    Open support panel
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Support panel</SheetTitle>
                    <SheetDescription>Use this space for deeper actions and future wellness tools.</SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
              <TabsTrigger value="journal">Journal</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 rounded-xl border border-slate-200 p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </TabsContent>
            <TabsContent value="insights" className="mt-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              Reflection insights and personalized patterns will be introduced in future iterations.
            </TabsContent>
            <TabsContent value="journal" className="mt-4 rounded-xl border border-slate-200 p-4 text-sm text-slate-600">
              A journaling experience for habit tracking and daily care will be added here later.
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
