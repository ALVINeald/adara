import { CalendarCheck, Lock, ShieldCheck } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Professional & Verified",
    description: "All therapists are licensed professionals with verified credentials.",
  },
  {
    icon: Lock,
    title: "Confidential & Secure",
    description: "Your information is private, encrypted, and never shared.",
  },
  {
    icon: CalendarCheck,
    title: "Request-Based Appointments",
    description: "You send a request. The therapist responds when available.",
  },
];

export default function TrustFooter() {
  return (
    <div className="mt-10 grid gap-6 rounded-3xl border border-[#E9E8FF] bg-white p-6 sm:grid-cols-3">
      {PILLARS.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F5F3FF]">
            <Icon className="h-4 w-4 text-[#6D28D9]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
