"use client";

import { Calendar } from "lucide-react";

import type { AppointmentRequest } from "@/hooks/useAppointmentRequests";
import type { Therapist } from "@/hooks/useTherapists";

interface AppointmentSummaryCardProps {
  requests: AppointmentRequest[];
  therapists: Therapist[];
}

export default function AppointmentSummaryCard({
  requests,
  therapists,
}: AppointmentSummaryCardProps) {
  const mostRecent = requests[0];
  const therapist = mostRecent
    ? therapists.find((t) => t.id === mostRecent.therapistId)
    : null;

  return (
    <div className="rounded-3xl border border-[#E9E8FF] bg-white p-5">
      <h2 className="mb-3 font-semibold text-slate-900">Your Appointments</h2>

      {mostRecent && therapist ? (
        <div className="rounded-2xl bg-[#F5F3FF] p-3">
          <p className="text-xs font-medium capitalize text-[#6D28D9]">
            {mostRecent.status} Request
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {therapist.name}
          </p>
          <p className="flex items-center gap-1 text-xs text-slate-500">
            <Calendar className="h-3 w-3" />
            Requested on{" "}
            {new Date(mostRecent.createdAt).toLocaleDateString([], {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      ) : (
        <p className="text-sm text-slate-400">No upcoming appointments.</p>
      )}
    </div>
  );
}
