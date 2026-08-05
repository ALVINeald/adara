import { CheckCircle2 } from "lucide-react";

const GUIDELINES = [
  "Be kind and respectful",
  "Share from your own experience",
  "What's shared here stays here",
  "Together, we grow stronger",
];

export default function CommunityGuidelinesCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

      <h3 className="text-sm font-semibold text-slate-900">
        Community Guidelines
      </h3>

      <ul className="mt-4 flex flex-col gap-3">
        {GUIDELINES.map((guideline) => (
          <li
            key={guideline}
            className="flex items-start gap-2.5 text-sm text-slate-600"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
            {guideline}
          </li>
        ))}
      </ul>

    </div>
  );
}
