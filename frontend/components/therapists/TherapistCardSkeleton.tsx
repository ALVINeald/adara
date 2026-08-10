export default function TherapistCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-[#E9E8FF] bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-slate-100" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded bg-slate-100" />
          <div className="h-3 w-32 rounded bg-slate-100" />
        </div>
      </div>
      <div className="mt-4 h-3 w-full rounded bg-slate-100" />
      <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-11 flex-1 rounded-xl bg-slate-100" />
        <div className="h-11 flex-1 rounded-xl bg-slate-100" />
      </div>
    </div>
  );
}
