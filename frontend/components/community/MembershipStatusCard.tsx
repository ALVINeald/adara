import { Star } from "lucide-react";

interface MembershipStatusCardProps {
  joinedCount: number;
  maxCommunities: number;
}

export default function MembershipStatusCard({
  joinedCount,
  maxCommunities,
}: MembershipStatusCardProps) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const progress = joinedCount / maxCommunities;
  const remaining = Math.max(maxCommunities - joinedCount, 0);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

      <h3 className="text-sm font-semibold text-slate-900">
        Your Membership
      </h3>

      <div className="mt-4 flex items-center gap-4">
        <svg width="76" height="76" viewBox="0 0 76 76" className="shrink-0">
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="rgb(237 233 254)"
            strokeWidth="6"
          />
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="rgb(124 58 237)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            transform="rotate(-90 38 38)"
          />
          <text
            x="38"
            y="43"
            textAnchor="middle"
            className="fill-slate-900 text-sm font-bold"
          >
            {joinedCount}/{maxCommunities}
          </text>
        </svg>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Communities Joined
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            {remaining > 0
              ? `You can join ${remaining} more ${remaining === 1 ? "community" : "communities"}`
              : "You've reached your limit"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl bg-violet-50 p-4">
        <Star className="h-5 w-5 shrink-0 fill-violet-400 text-violet-400" />
        <div>
          <p className="text-sm font-semibold text-violet-900">
            Quality over quantity
          </p>
          <p className="mt-0.5 text-xs leading-5 text-violet-700">
            We recommend joining communities that truly resonate with you.
          </p>
        </div>
      </div>

    </div>
  );
}
