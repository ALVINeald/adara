"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import type { Therapist } from "@/hooks/useTherapists";

interface TherapistCardProps {
  therapist: Therapist;
  alreadyRequested: boolean;
  onRequest: (message: string | null) => Promise<void>;
}

export default function TherapistCard({
  therapist,
  alreadyRequested,
  onRequest,
}: TherapistCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const initials = therapist.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSend() {
    setSending(true);
    await onRequest(message.trim() ? message.trim() : null);
    setSending(false);
    setShowForm(false);
  }

  return (
    <div className="rounded-[28px] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cyan-600 font-semibold text-white">
          {initials}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{therapist.name}</h3>
          <p className="text-sm font-medium text-cyan-700">
            {therapist.specialty}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {therapist.bio}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {alreadyRequested ? (
          <div className="flex items-center gap-2 text-sm font-medium text-cyan-700">
            <CheckCircle2 className="h-4 w-4" />
            Requested
          </div>
        ) : showForm ? (
          <div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note for the therapist (optional)..."
              rows={2}
              className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={sending}
              className="mt-3 rounded-xl bg-cyan-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-cyan-700 disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send Request"}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-cyan-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
          >
            Request Appointment
          </button>
        )}
      </div>
    </div>
  );
}