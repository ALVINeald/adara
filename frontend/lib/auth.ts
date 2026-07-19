import { supabase } from "./supabase";

export async function signUp(
  name: string,
  email: string,
  password: string
) {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${window.location.origin}/auth/login`,
    },
  });
}

export async function signIn(
  email: string,
  password: string
) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function resetPasswordForEmail(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
}

export async function updatePassword(newPassword: string) {
  return await supabase.auth.updateUser({ password: newPassword });
}