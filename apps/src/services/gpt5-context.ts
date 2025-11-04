import { supabase } from "@/src/services/supabase";

type ContextAnalyzeResponse = {
  test_session_id: string;
  data_used?: {
    biomarkers: {
      ph: number | null;
      h2o2: string | null;
      le: string | null;
      sna: string | null;
      beta_g: string | null;
      nag: string | null;
    };
    context: Array<{
      question_prompt: string;
      selected_labels: string[];
    }>;
    manufacturer_text: string;
  };
  analysis: {
    insights: Array<{
      category: string;
      relevance: string;
      interpretation: string;
      confidence: number;
    }>;
  };
  updated?: {
    table: string;
    column: string;
    id_column: string;
    id_value: string | number;
  };
};

export async function getGPT5Context(test_session_id: string) {
  const { data: { session } } = await supabase.auth.getSession();
  const jwt = session?.access_token;

  const url = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/gpt5_context`;
  
  const requestBody = {
    test_session_id,
    update: {
      table: "test_logs",
      id_column: "test_session_id",
      id_value: test_session_id,
      target_column: "gpt_5_context"
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
      throw new Error(json.error || "Failed to get GPT-5 context analysis");
    }
    
    return json as ContextAnalyzeResponse;
  } catch (error) {
    throw error;
  }
}

