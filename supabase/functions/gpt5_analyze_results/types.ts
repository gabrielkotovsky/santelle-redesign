export type Biomarkers = {
  ph: number | null;
  h2o2: string | null;
  le: string | null;
  sna: string | null;
  beta_g: string | null;
  nag: string | null;
};

export type Symptom = {
  question_prompt: string;
  selected_labels: string[];
};

export type TestData = {
  biomarkers: Biomarkers;
  symptoms: Symptom[];
  manufacturer_text: string; // markdown body used to calibrate ranges & caveats
};

// ---- Model output focused on biomarker-by-biomarker explanations ----

export type BiomarkerExplanation = {
  biomarker: keyof Biomarkers;           // e.g. "ph"
  value: number | string | null;         // echo back the value (numeric for pH, string for others, or null)
  classification: "low" | "normal" | "borderline" | "high" | "unknown";
  significance: string;                  // plain English: what this means biologically
  interpretation: string;                // what this result suggests in context
  confidence: number;                    // 0..1 confidence for THIS biomarker's read
};

export type Analysis = {
  biomarkers: BiomarkerExplanation[];    // one entry per biomarker present in input
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

