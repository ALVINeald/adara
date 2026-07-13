import {
  Bell,
  Bot,
  BookOpen,
  Calendar,
  Heart,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const cards = [
    {
      title: "AI Companion",
      description: "Talk privately with your AI companion anytime.",
      icon: Bot,
    },
    {
      title: "Communities",
      description: "Connect with people who understand your journey.",
      icon: Users,
    },
    {
      title: "Journal",
      description: "Write your thoughts in a safe and private space.",
      icon: BookOpen,
    },
    {
      title: "Appointments",
      description: "Book sessions with mental health professionals.",
      icon: Calendar,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}

        <header className="mb-10 flex items-center justify-between">

          <div>
            <p className="text-sm font-medium text-cyan-700">
              Welcome to Adara
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Home
            </h1>
          </div>

          <button className="rounded-full bg-white p-3 shadow-md transition hover:shadow-lg">
            <Bell className="h-5 w-5 text-slate-700" />
          </button>

        </header>

        {/* Daily Inspiration */}

        <section className="mb-10 rounded-[32px] bg-cyan-600 p-10 text-white shadow-xl">

          <div className="flex items-center gap-5">

            <div className="rounded-full bg-white/20 p-4">
              <Heart className="h-8 w-8" />
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                One step at a time.
              </h2>

              <p className="mt-2 text-cyan-100">
                Healing doesn't happen overnight. Every small step matters.
              </p>

            </div>

          </div>

        </section>

        {/* Features */}

        <section className="grid gap-6 md:grid-cols-2">

          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.title}
                className="rounded-[28px] bg-white p-8 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100">
                  <Icon className="h-7 w-7 text-cyan-700" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {card.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {card.description}
                </p>
              </button>
            );
          })}

        </section>

      </div>
    </main>
  );
}