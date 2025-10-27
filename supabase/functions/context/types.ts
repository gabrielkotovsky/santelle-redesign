export type Biomarkers = {
  ph: number | null;
  h2o2: string | null;
  le: string | null;
  sna: string | null;
  beta_g: string | null;
  nag: string | null;
};

export type PretestAnswer = {
  question_slug: string;
  question_prompt: string;
  question_type: "single" | "multi" | "text";
  selected_values: string[];
  free_value: string | null;
};
