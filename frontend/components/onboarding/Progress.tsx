interface ProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function Progress({
  currentStep,
  totalSteps,
}: ProgressProps) {
  return (
    <div className="mb-10">

      {/* Step Text */}
      <div className="mb-3 flex items-center justify-between">

        <span className="text-sm font-medium text-slate-500">
          Step {currentStep} of {totalSteps}
        </span>

        <span className="text-sm text-cyan-700">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>

      </div>

      {/* Progress Bar */}

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">

        <div
          className="h-full rounded-full bg-cyan-600 transition-all duration-500"
          style={{
            width: `${(currentStep / totalSteps) * 100}%`,
          }}
        />

      </div>

    </div>
  );
}