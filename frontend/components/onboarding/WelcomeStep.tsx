import { HeartHandshake, Sparkles } from "lucide-react";

import { StepProps } from "./types";

export default function WelcomeStep({
  data,
  updateData,
}: StepProps) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center text-center animate-fadeIn">

      {/* Icon */}

      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-cyan-100 shadow-lg">

        <HeartHandshake className="h-12 w-12 text-cyan-700" />

      </div>

      {/* Badge */}

      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">

        <Sparkles className="h-4 w-4" />

        Welcome to Adara

      </div>

      {/* Title */}

      <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900">

        Your journey begins here.

      </h1>

      {/* Description */}

      <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">

        Thank you for choosing Adara.

        <br />

        You're entering a space built for hope, understanding,
        and genuine human connection.

      </p>

      <div className="mt-10 rounded-2xl bg-cyan-50 px-6 py-5">

        <p className="text-sm leading-7 text-cyan-800">

          This onboarding takes less than a minute
          and helps us personalize your experience.

        </p>

      </div>

    </div>
  );
}