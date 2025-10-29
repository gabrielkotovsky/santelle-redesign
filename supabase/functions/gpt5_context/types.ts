export type Biomarkers = {
  ph: number | null;
  h2o2: string | null;
  le: string | null;
  sna: string | null;
  beta_g: string | null;
  nag: string | null;
};

export type ContextQuestion = {
  question_prompt: string;
  selected_labels: string[];
};

export type TestData = {
  biomarkers: Biomarkers;
  context: ContextQuestion[];
  manufacturer_text: string; // markdown body used to calibrate ranges & caveats
};

// ---- Model output focused on contextual analysis ----

export type ContextualInsight = {
  category: string;                      // e.g. "Menstrual Cycle", "Sexual Activity", etc.
  relevance: string;                     // how this context relates to the biomarker results
  interpretation: string;                // what this context suggests about the results
  confidence: number;                    // 0..1 confidence for this insight
};

export type Analysis = {
  insights: ContextualInsight[];         // context-specific insights
};

export type AnalyzeResponse = {
  test_session_id: string;
  data_used?: TestData; // Optional - not included for cached responses
  analysis: Analysis;
  updated?: {
    table: string;
    column: string;
    id_column: string;
    id_value: string | number;
  };
};

