import { supabase } from "./supabase";

export async function getTherapists() {
  const { data, error } = await supabase
    .from("therapists")
    .select("*")
    .order("name", { ascending: true });

  return { data, error };
}

export async function createAppointmentRequest(
  userId: string,
  therapistId: string,
  message: string | null
) {
  const { data, error } = await supabase
    .from("appointment_requests")
    .insert({
      user_id: userId,
      therapist_id: therapistId,
      message,
    })
    .select()
    .single();

  return { data, error };
}

export async function getAppointmentRequests(userId: string) {
  const { data, error } = await supabase
    .from("appointment_requests")
    .select("*")
    .eq("user_id", userId);

  return { data, error };
}