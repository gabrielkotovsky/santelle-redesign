import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { TestData, Biomarkers, Symptom } from "./types.ts";

export async function fetchData(
  supabase: SupabaseClient,
  test_session_id: string
): Promise<TestData> {
  console.log("[fetchData] Starting fetch for test_session_id:", test_session_id);
  
  // Fetch biomarkers - use maybeSingle() instead of single() for better error handling
  console.log("[fetchData] Fetching biomarkers...");
  const { data: biomarkersData, error: biomarkersError } = await supabase
    .from("test_logs")
    .select("ph, h2o2, le, sna, beta_g, nag")
    .eq("test_session_id", test_session_id)
    .maybeSingle();
  
  if (biomarkersError) {
    console.error("[fetchData] Biomarkers error:", biomarkersError);
    throw biomarkersError;
  }
  
  if (!biomarkersData) {
    console.error("[fetchData] No test log found for test_session_id:", test_session_id);
    throw new Error(`No test log found for test_session_id: ${test_session_id}`);
  }
  
  console.log("[fetchData] Biomarkers data:", biomarkersData);

  // pH is numeric, other biomarkers are strings
  const biomarkers: Biomarkers = {
    ph: biomarkersData?.ph ?? null,
    h2o2: biomarkersData?.h2o2 ?? null,
    le: biomarkersData?.le ?? null,
    sna: biomarkersData?.sna ?? null,
    beta_g: biomarkersData?.beta_g ?? null,
    nag: biomarkersData?.nag ?? null,
  };

  // Fetch symptoms
  console.log("[fetchData] Fetching symptoms...");
  const { data: symptomsRows, error: symptomsError } = await supabase
    .from("app_pretest_responses")
    .select(`
      app_pretest_questions!inner ( prompt, symptom_or_context ),
      app_pretest_response_choices (
        app_pretest_choices!inner ( label )
      )
    `)
    .eq("test_session_id", test_session_id)
    .eq("app_pretest_questions.symptom_or_context", "symptoms");
  
  if (symptomsError) {
    console.error("[fetchData] Symptoms error:", symptomsError);
    throw symptomsError;
  }
  
  console.log("[fetchData] Symptoms rows:", symptomsRows?.length ?? 0);

  const symptoms: Symptom[] = (symptomsRows ?? []).map((r: any) => ({
    question_prompt: r.app_pretest_questions.prompt,
    selected_labels: (r.app_pretest_response_choices ?? []).map(
      (c: any) => c.app_pretest_choices.label
    ),
  }));

  // Fetch manufacturer text - make this optional as it might not exist
  console.log("[fetchData] Fetching manufacturer text...");
  const { data: articleData, error: articleError } = await supabase
    .from("articles")
    .select("content_md")
    .eq("slug", "manufacturer_interpretation")
    .maybeSingle();
  
  // Don't throw if article doesn't exist, just log a warning
  if (articleError) {
    console.warn("[fetchData] Manufacturer text error (non-fatal):", articleError);
  }
  
  const manufacturer_text = articleData?.content_md ?? "";
  console.log("[fetchData] Manufacturer text length:", manufacturer_text.length);

  console.log("[fetchData] Fetch completed successfully");
  return {
    biomarkers,
    symptoms,
    manufacturer_text,
  };
}