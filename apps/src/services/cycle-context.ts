import { supabase } from './supabase';

export type CycleContextResponse = {
  question: {
    id: string;
    slug: string;
    prompt: string;
    type: string;
    symptom_or_context: string;
  } | null;
  current_test: {
    id: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
    analysis: string | null;
    user_id?: string | null;
    test_session_id?: string | null;
    created_at: string;
  } | null;
  biomarker_results: {
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
  };
  cycle_answer: {
    question_slug: string;
    question_prompt: string;
    question_type: string;
    selected_values: string[];
    free_value: string | null;
  } | null;
  cycle_analysis: string | null;
  analysis: string | null;
  formatted_response: string;
  message: string;
  disclaimer: string;
};

export async function getCycleContextAnalysis(testLogId?: string): Promise<CycleContextResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('cycle-context', {
      body: {
        question_slug: 'cycle',
        ...(testLogId && { test_log_id: testLogId })
      }
    });

    if (error) {
      throw new Error(`Cycle context analysis failed: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
}
