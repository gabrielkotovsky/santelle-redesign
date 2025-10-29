import { supabase } from "@/src/services/supabase";

type AnalyzeResponse = {
  test_session_id: string;
  data_used: {
    biomarkers: {
      ph: number | null;
      h2o2: string | null;
      le: string | null;
      sna: string | null;
      beta_g: string | null;
      nag: string | null;
    };
    symptoms: Array<{
      question_prompt: string;
      selected_labels: string[];
    }>;
    manufacturer_text: string;
  };
  analysis: {
    summary: string;
    biomarkers: Array<{
      biomarker: string;
      value: number | string | null;
      classification: "low" | "normal" | "borderline" | "high" | "unknown";
      significance: string;
      interpretation: string;
      reinforced_by_symptoms?: string[];
      conflicts_with_symptoms?: string[];
      confidence: number;
      caveats?: string[];
      recommended_next_steps?: string[];
    }>;
  };
  updated?: {
    table: string;
    column: string;
    id_column: string;
    id_value: string | number;
  };
};

export async function getGPT5Analysis(test_session_id: string) {
  console.log('[GPT5 Service] Starting analysis for test_session_id:', test_session_id);
  
  const { data: { session } } = await supabase.auth.getSession();
  const jwt = session?.access_token;
  console.log('[GPT5 Service] Got session JWT:', jwt ? 'present' : 'missing');

  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/gpt5_analyze_results`;
  console.log('[GPT5 Service] Calling URL:', url);
  
  const requestBody = {
    test_session_id,
    update: {
      table: "test_logs",
      id_column: "test_session_id",
      id_value: test_session_id,
      target_column: "gpt_5_analysis"
    }
  };
  console.log('[GPT5 Service] Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[GPT5 Service] Response status:', res.status);
    console.log('[GPT5 Service] Response ok:', res.ok);

    const json = await res.json();
    console.log('[GPT5 Service] Response JSON:', JSON.stringify(json, null, 2));

    if (!res.ok) {
      console.error('[GPT5 Service] Error response:', json);
      throw new Error(json.error || "Failed to get GPT-5 analysis");
    }
    
    console.log('[GPT5 Service] Analysis completed successfully');
    return json as AnalyzeResponse;
  } catch (error) {
    console.error('[GPT5 Service] Exception caught:', error);
    throw error;
  }
}

