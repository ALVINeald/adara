import { supabase } from "./supabase";

export async function getMoodEntries(userId: string, sinceDate: string) {
  const { data, error } = await supabase
    .from("mood_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("entry_date", sinceDate)
    .order("entry_date", { ascending: true });

  return { data, error };
}

export async function upsertMoodEntry(
  userId: string,
  entryDate: string,
  moodLevel: number,
  note: string | null
) {
  const { data, error } = await supabase
    .from("mood_entries")
    .upsert(
      {
        user_id: userId,
        entry_date: entryDate,
        mood_level: moodLevel,
        note,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,entry_date" }
    )
    .select()
    .single();

  return { data, error };
}