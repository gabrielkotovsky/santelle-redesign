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
  const { data: { session } } = await supabase.auth.getSession();
  const jwt = session?.access_token;

  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/gpt5_analyze_results`;
  
  const requestBody = {
    test_session_id,
    update: {
      table: "test_logs",
      id_column: "test_session_id",
      id_value: test_session_id,
      target_column: "gpt_5_analysis"
    }
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify(requestBody),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || "Failed to get GPT-5 analysis");
    }
    
    return json as AnalyzeResponse;
  } catch (error) {
    throw error;
  }
}

