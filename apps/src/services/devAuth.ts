import { supabase } from "@/src/services/supabase";

export async function devSignIn() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.EXPO_PUBLIC_DEV_EMAIL!,
    password: process.env.EXPO_PUBLIC_DEV_PASSWORD!,
  });
  if (error) console.warn("Dev sign-in failed:", error.message);
  return data?.user;
}