import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

export async function updateAnalysisFactors(
  supabase: SupabaseClient,
  test_session_id: string,
  analysis_factors: string
) {
  const { error } = await supabase
    .from("test_logs")
    .update({ analysis_factors })
    .eq("test_session_id", test_session_id);

  if (error) throw error;
}
