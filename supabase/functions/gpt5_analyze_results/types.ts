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
  manufacturer_text: string;
};

