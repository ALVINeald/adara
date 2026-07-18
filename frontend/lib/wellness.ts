import { supabase } from "./supabase";

export async function logWellnessSession(
  userId: string,
  sessionType: "breathing" | "meditation",
  exerciseName: string,
  durationSeconds: number
) {
  const { data, error } = await supabase
    .from("wellness_sessions")
    .insert({
      user_id: userId,
      session_type: sessionType,
      exercise_name: exerciseName,
      duration_seconds: durationSeconds,
    })
    .select()
    .single();

  return { data, error };
}

export async function getWellnessSessions(userId: string) {
  const { data, error } = await supabase
    .from("wellness_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  return { data, error };
}