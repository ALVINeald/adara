"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Progress from "./Progress";
import WelcomeStep from "./WelcomeStep";
import NameStep from "./NameStep";
import FeelingStep from "./FeelingStep";
import CommunityStep from "./CommunityStep";
import CompanionStep from "./CompanionStep";

import type { OnboardingData } from "./types";

const TOTAL_STEPS = 5;

export default function OnboardingWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [data, setData] = useState<OnboardingData>({
    name: "",
    feeling: "",
    community: "",
  });

  function updateData(values: Partial<OnboardingData>) {
    setData((previous) => ({
      ...previous,
      ...values,
    }));
  }

  function nextStep() {
    if (step < TOTAL_STEPS) {
      setStep((previous) => previous + 1);
      return;
    }

    router.push("/dashboard");
  }

  function previousStep() {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  }

  function renderStep() {
    switch (step) {
      case 1:
        return (
          <WelcomeStep
            data={data}
            updateData={updateData}
          />
        );

      case 2:
        return (
          <NameStep
            data={data}
            updateData={updateData}
          />
        );

      case 3:
        return (
          <FeelingStep
            data={data}
            updateData={updateData}
          />
        );

      case 4:
        return (
          <CommunityStep
            data={data}
            updateData={updateData}
          />
        );

      case 5:
        return (
          <CompanionStep
            data={data}
            updateData={updateData}
          />
        );

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fcff_0%,#eef8fb_45%,#e8fbf8_100%)] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="animate-fadeIn rounded-[32px] border border-white/70 bg-white/80 p-10 shadow-[0_25px_80px_rgba(15,118,110,0.12)] backdrop-blur-xl">

          <Progress
            currentStep={step}
            totalSteps={TOTAL_STEPS}
          />

          <div className="min-h-[420px] transition-all duration-500">
            {renderStep()}
          </div>

          <div className="mt-10 flex items-center justify-between">

            <button
              type="button"
              onClick={previousStep}
              disabled={step === 1}
              className="rounded-xl border border-slate-300 px-6 py-3 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="button"
              onClick={nextStep}
              disabled={
                (step === 2 && data.name.trim() === "") ||
                (step === 3 && data.feeling === "") ||
                (step === 4 && data.community === "")
              }
              className="rounded-xl bg-cyan-600 px-8 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === TOTAL_STEPS ? "Finish" : "Continue"}
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}