import { supabase } from "./supabase";

export async function getTherapists() {
  const { data, error } = await supabase
    .from("therapists")
    .select("*")
    .order("name", { ascending: true });

  return { data, error };
}

export interface AppointmentRequestPayload {
  therapistId: string;
  message: string | null;
  preferredContactMethod: "phone" | "email" | "either" | null;
  preferredSessionType: "online" | "in_person" | "no_preference" | null;
  availabilityNotes: string | null;
}

export async function createAppointmentRequest(
  userId: string,
  payload: AppointmentRequestPayload
) {
  const { data, error } = await supabase
    .from("appointment_requests")
    .insert({
      user_id: userId,
      therapist_id: payload.therapistId,
      message: payload.message,
      preferred_contact_method: payload.preferredContactMethod,
      preferred_session_type: payload.preferredSessionType,
      availability_notes: payload.availabilityNotes,
    })
    .select()
    .single();

  return { data, error };
}

export async function getAppointmentRequests(userId: string) {
  const { data, error } = await supabase
    .from("appointment_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function getSavedTherapists(userId: string) {
  const { data, error } = await supabase
    .from("user_saved_therapists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addSavedTherapist(userId: string, therapistId: string) {
  const { data, error } = await supabase
    .from("user_saved_therapists")
    .insert({ user_id: userId, therapist_id: therapistId })
    .select()
    .single();

  return { data, error };
}

export async function removeSavedTherapist(userId: string, therapistId: string) {
  const { error } = await supabase
    .from("user_saved_therapists")
    .delete()
    .eq("user_id", userId)
    .eq("therapist_id", therapistId);

  return { error };
}
