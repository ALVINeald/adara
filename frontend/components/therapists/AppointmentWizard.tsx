"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

import type { Therapist } from "@/hooks/useTherapists";
import type { AppointmentRequestPayload } from "@/lib/therapists";

interface AppointmentWizardProps {
  therapist: Therapist;
  onClose: () => void;
  onSubmit: (payload: AppointmentRequestPayload) => Promise<void>;
}

type FieldErrors = Record<string, string>;

// Hand-rolled instead of a schema library -- four fields with simple
// rules (a required choice, a couple of length checks) don't need a
// validation dependency, and it's one less package that can drift out
// of sync during a manual file merge.
function validateStep1(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.preferredContactMethod) {
    errors.preferredContactMethod = "Choose how you'd like to be contacted.";
  }
  return errors;
}

function validateStep2(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.preferredSessionType) {
    errors.preferredSessionType = "Choose a session preference.";
  }
  if (form.availabilityNotes.length > 300) {
    errors.availabilityNotes = "Keep it under 300 characters.";
  }
  return errors;
}

function validateStep3(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = form.message.trim();
  if (trimmed.length < 10) {
    errors.message = "Share at least a sentence or two so they know how to help.";
  } else if (trimmed.length > 1000) {
    errors.message = "Keep it under 1000 characters.";
  }
  return errors;
}

type FormState = {
  preferredContactMethod: "phone" | "email" | "either" | "";
  preferredSessionType: "online" | "in_person" | "no_preference" | "";
  availabilityNotes: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  preferredContactMethod: "",
  preferredSessionType: "",
  availabilityNotes: "",
  message: "",
};

const STEP_TITLES = ["About You", "Preferences", "Support Request"];

function vibrateIfSupported(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
    navigator.vibrate(pattern);
  }
}

export default function AppointmentWizard({
  therapist,
  onClose,
  onSubmit,
}: AppointmentWizardProps) {
  const prefersReducedMotion = useReducedMotion();
  const draftKey = `adara:appointment-draft:${therapist.id}`;

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Restore an in-progress draft for this therapist, if one exists.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey);
      if (raw) setForm({ ...EMPTY_FORM, ...JSON.parse(raw) });
    } catch {
      // corrupted/unavailable draft -- start fresh rather than error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave the draft on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(form));
    } catch {
      // best-effort only
    }
  }, [form, draftKey]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validateStep(): boolean {
    const fieldErrors =
      step === 0
        ? validateStep1(form)
        : step === 1
          ? validateStep2(form)
          : validateStep3(form);

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => Math.min(2, s + 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }

  async function handleSubmit() {
    if (!validateStep()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmit({
        therapistId: therapist.id,
        message: form.message,
        preferredContactMethod: form.preferredContactMethod || null,
        preferredSessionType: form.preferredSessionType || null,
        availabilityNotes: form.availabilityNotes || null,
      });
      window.localStorage.removeItem(draftKey);
      vibrateIfSupported([30, 40, 30]);
      setSuccess(true);
    } catch {
      setSubmitError("Something went wrong sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: prefersReducedMotion ? 0 : dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: prefersReducedMotion ? 0 : dir * -40, opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="wizard-title">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 id="wizard-title" className="font-semibold text-slate-900">
              Request Appointment
            </h2>
            <p className="text-sm text-slate-500">{therapist.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-[#8B5CF6]" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Request sent</h3>
            <p className="mt-2 text-sm text-slate-500">
              {therapist.name} will follow up with you. This doesn&apos;t confirm a
              booking yet.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-xl bg-[#8B5CF6] px-6 py-3 text-sm font-medium text-white hover:bg-[#7C3AED]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 px-6 pt-4">
              {STEP_TITLES.map((title, i) => (
                <div key={title} className="flex flex-1 items-center gap-2">
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      i <= step ? "bg-[#8B5CF6]" : "bg-slate-100"
                    }`}
                  />
                </div>
              ))}
            </div>
            <p className="px-6 pt-2 text-xs font-medium text-slate-400">
              Step {step + 1} of 3 · {STEP_TITLES[step]}
            </p>

            <div className="overflow-hidden px-6 py-5">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                >
                  {step === 0 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        How should they reach you?
                      </label>
                      <div className="space-y-2">
                        {(["phone", "email", "either"] as const).map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => updateField("preferredContactMethod", option)}
                            className={`flex min-h-[44px] w-full items-center rounded-xl border px-4 text-left text-sm capitalize transition ${
                              form.preferredContactMethod === option
                                ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                                : "border-slate-200 text-slate-600"
                            }`}
                          >
                            {option === "either" ? "Either works" : option}
                          </button>
                        ))}
                      </div>
                      {errors.preferredContactMethod && (
                        <p className="mt-2 text-xs text-red-600">
                          {errors.preferredContactMethod}
                        </p>
                      )}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Session preference
                        </label>
                        <div className="space-y-2">
                          {(["online", "in_person", "no_preference"] as const).map(
                            (option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => updateField("preferredSessionType", option)}
                                className={`flex min-h-[44px] w-full items-center rounded-xl border px-4 text-left text-sm transition ${
                                  form.preferredSessionType === option
                                    ? "border-[#8B5CF6] bg-[#F5F3FF] text-[#6D28D9]"
                                    : "border-slate-200 text-slate-600"
                                }`}
                              >
                                {option === "online"
                                  ? "Online"
                                  : option === "in_person"
                                    ? "In-person"
                                    : "No preference"}
                              </button>
                            )
                          )}
                        </div>
                        {errors.preferredSessionType && (
                          <p className="mt-2 text-xs text-red-600">
                            {errors.preferredSessionType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Availability notes (optional)
                        </label>
                        <textarea
                          value={form.availabilityNotes}
                          onChange={(e) => updateField("availabilityNotes", e.target.value)}
                          placeholder="e.g. Weekday evenings work best for me"
                          rows={2}
                          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#8B5CF6]"
                        />
                        {errors.availabilityNotes && (
                          <p className="mt-2 text-xs text-red-600">
                            {errors.availabilityNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        What would you like support with?
                      </label>
                      <textarea
                        value={form.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Share as much or as little as you're comfortable with..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#8B5CF6]"
                      />
                      {errors.message && (
                        <p className="mt-2 text-xs text-red-600">{errors.message}</p>
                      )}
                      {submitError && (
                        <p className="mt-2 text-xs text-red-600">{submitError}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-slate-100 px-6 py-4">
              <button
                type="button"
                onClick={step === 0 ? onClose : goBack}
                className="min-h-[44px] rounded-xl px-4 text-sm font-medium text-slate-500 hover:bg-slate-50"
              >
                {step === 0 ? "Cancel" : "Back"}
              </button>

              {step < 2 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="min-h-[44px] rounded-xl bg-[#8B5CF6] px-6 text-sm font-medium text-white hover:bg-[#7C3AED]"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="min-h-[44px] rounded-xl bg-[#8B5CF6] px-6 text-sm font-medium text-white hover:bg-[#7C3AED] disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send Request"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
