import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { Biomarkers } from "./types.ts";

export async function fetchBiomarkers(
  supabase: SupabaseClient,
  test_session_id: string
): Promise<Biomarkers> {
  const { data, error } = await supabase
    .from("test_logs")
    .select("ph, h2o2, le, sna, beta_g, nag")
    .eq("test_session_id", test_session_id)
    .single();
  if (error) throw error;

  return {
    ph: data?.ph ?? null,
    h2o2: data?.h2o2 ?? null,
    le: data?.le ?? null,
    sna: data?.sna ?? null,
    beta_g: data?.beta_g ?? null,
    nag: data?.nag ?? null,
  };
}
