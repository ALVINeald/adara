import { supabase } from "./supabase";

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return { data, error };
}

export async function createConversation(userId: string) {
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: userId,
      title: "New Conversation",
    })
    .select()
    .single();

  return { data, error };
}

export async function renameConversation(
  id: string,
  title: string
) {
  const { data, error } = await supabase
    .from("conversations")
    .update({
      title,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteConversation(id: string) {
  const { error } = await supabase
    .from("conversations")
    .delete()
    .eq("id", id);

  return { error };
}