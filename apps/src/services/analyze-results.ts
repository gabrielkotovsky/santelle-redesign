import { supabase } from "@/src/services/supabase";

export async function analyzeTestLog(test_log_id: string) {
  // Use the same session JWT as Authorization so you can keep per-user context in the function if desired.
  const { data: { session } } = await supabase.auth.getSession();
  const jwt = session?.access_token;

  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/analyze-results`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify({ test_log_id }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to analyze");
  return json.log as {
    id: string;
    analysis: string | null;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
  };
}