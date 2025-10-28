import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { PretestAnswer } from "./types.ts";

export async function fetchPretestAnswers(
  supabase: SupabaseClient,
  test_session_id: string
): Promise<PretestAnswer[]> {
  const { data: rows, error } = await supabase
    .from("app_pretest_responses")
    .select(`
      app_pretest_questions!inner ( slug, prompt, type, symptom_or_context ),
      app_pretest_response_choices (
        app_pretest_choices!inner ( label )
      )
    `)
    .eq("test_session_id", test_session_id)
    .eq("app_pretest_questions.symptom_or_context", "context");

  if (error) throw error;

  return (rows ?? []).map((r: any) => ({
    question_slug: r.app_pretest_questions.slug,
    question_prompt: r.app_pretest_questions.prompt,
    question_type: r.app_pretest_questions.type,
    selected_values: (r.app_pretest_response_choices ?? []).map(
      (c: any) => c.app_pretest_choices.label
    ),
    free_value: null, // No text input option available
  }));
}
