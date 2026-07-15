import { supabase } from "./supabase";

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function createMessage(
  conversationId: string,
  sender: "user" | "assistant",
  content: string
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender,
      content,
    })
    .select()
    .single();

  return { data, error };
}

export async function deleteMessages(conversationId: string) {
  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conversationId);

  return { error };
}