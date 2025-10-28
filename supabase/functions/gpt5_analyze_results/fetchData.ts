import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { TestData, Biomarkers, Symptom } from "./types.ts";

export async function fetchData(
  supabase: SupabaseClient,
  test_session_id: string
): Promise<TestData> {
  // Fetch biomarkers
  const { data: biomarkersData, error: biomarkersError } = await supabase
    .from("test_logs")
    .select("ph, h2o2, le, sna, beta_g, nag")
    .eq("test_session_id", test_session_id)
    .single();
  if (biomarkersError) throw biomarkersError;

  const biomarkers: Biomarkers = {
    ph: biomarkersData?.ph ?? null,
    h2o2: biomarkersData?.h2o2 ?? null,
    le: biomarkersData?.le ?? null,
    sna: biomarkersData?.sna ?? null,
    beta_g: biomarkersData?.beta_g ?? null,
    nag: biomarkersData?.nag ?? null,
  };

  // Fetch symptoms
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
  if (symptomsError) throw symptomsError;

  const symptoms: Symptom[] = (symptomsRows ?? []).map((r: any) => ({
    question_prompt: r.app_pretest_questions.prompt,
    selected_labels: (r.app_pretest_response_choices ?? []).map(
      (c: any) => c.app_pretest_choices.label
    ),
  }));

  // Fetch manufacturer text
  const { data: articleData, error: articleError } = await supabase
    .from("articles")
    .select("content_md")
    .eq("slug", "manufacturer_interpretation")
    .single();
  if (articleError) throw articleError;

  const manufacturer_text = articleData?.content_md ?? "";

  return {
    biomarkers,
    symptoms,
    manufacturer_text,
  };
}