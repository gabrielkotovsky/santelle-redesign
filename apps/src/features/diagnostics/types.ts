// Types for the Santelle master diagnostic logic (spec v3).
// Source of truth: santelle_master_diagnostic_logic_v3.md

// ---------------------------------------------------------------------------
// Biomarker inputs (Section A.2)
// ---------------------------------------------------------------------------

export type MarkerValue = '-' | '±' | '+';
export type LeValue = '-' | '±' | '+' | '++' | '+++';

export type BiomarkerInputs = {
  /** 3.8 / 4.4 / 4.6 / 4.8 / 5.4 (null when not recorded) */
  ph: number | null;
  h2o2: MarkerValue | null;
  le: LeValue | null;
  sna: MarkerValue | null;
  betaG: MarkerValue | null;
  nag: MarkerValue | null;
};

// ---------------------------------------------------------------------------
// Questionnaire inputs (Section A.1, Q1-Q8)
// ---------------------------------------------------------------------------

export type Q1Symptom = 'itching' | 'burning' | 'pain_sex' | 'bleeding_sex';
export type Q2Duration = 'today' | '1_3_days' | '4_7_days' | 'more_1_week' | 'not_applicable';
export type Q3Odor = 'none' | 'fishy' | 'yeasty' | 'strong_unpleasant' | 'other';
export type Q4Color = 'clear' | 'white_thick' | 'gray' | 'yellow_green' | 'bloody';
export type Q5Factor =
  | 'antibiotics'
  | 'swimsuit'
  | 'unprotected_sex'
  | 'hygiene_products'
  | 'travel'
  | 'recurrent_6_months';
export type Q6Cycle = 'just_after_period' | 'mid_cycle' | 'just_before_period' | 'not_sure';
export type Q7Pregnancy = 'pregnant' | 'not_pregnant' | 'not_sure';
export type Q8Pain = 'no_pain' | 'pain';

export type QuestionnaireInputs = {
  q1: Q1Symptom[];
  q2: Q2Duration | null;
  q3: Q3Odor | null;
  q4: Q4Color | null;
  q5: Q5Factor[];
  q6: Q6Cycle | null;
  q7: Q7Pregnancy | null;
  q8: Q8Pain | null;
};

export const EMPTY_QUESTIONNAIRE: QuestionnaireInputs = {
  q1: [],
  q2: null,
  q3: null,
  q4: null,
  q5: [],
  q6: null,
  q7: null,
  q8: null,
};

// ---------------------------------------------------------------------------
// Cards & variants (Section C)
// ---------------------------------------------------------------------------

export type CardKey =
  | 'urgent'
  | 'bv'
  | 'av'
  | 'trich'
  | 'yeast'
  | 'mixed'
  | 'possible'
  | 'balance';

export type CardVariantId =
  // C.1 urgent
  | 'URGENT-1'
  | 'URGENT-2'
  | 'URGENT-3'
  | 'URGENT-4'
  | 'URGENT-5'
  // C.2 bv
  | 'BV-LIKELY-PHARMACY'
  | 'BV-MARKERS-ONLY'
  | 'BV-LIKELY-ESCALATION'
  | 'BV-POSSIBLE'
  | 'BV-POSSIBLE-SYMPTOMS'
  // C.3 av
  | 'AV-LIKELY'
  | 'AV-MARKERS-ONLY'
  | 'AV-POSSIBLE'
  | 'AV-POSSIBLE-SYMPTOMS'
  // C.4 trich
  | 'TRICH-LIKELY'
  | 'TRICH-POSSIBLE'
  | 'TRICH-POSSIBLE-SYMPTOMS'
  // C.5 yeast
  | 'YEAST-LIKELY'
  | 'YEAST-ASYMPTOMATIC'
  | 'YEAST-LIKELY-ESCALATION'
  | 'YEAST-POSSIBLE'
  | 'YEAST-POSSIBLE-SYMPTOMS'
  // C.6 mixed
  | 'MIXED-BV-AV'
  | 'MIXED-BV-YEAST'
  | 'MIXED-BV-TRICH'
  | 'MIXED-AV-YEAST'
  | 'MIXED-AV-TRICH'
  // C.7 possible
  | 'POSSIBLE-MIXED'
  | 'POSSIBLE-IRRITATION'
  | 'POSSIBLE-SYMPTOMATIC-LE'
  | 'POSSIBLE-LE-ALONE'
  | 'POSSIBLE-GENERIC'
  // C.8 balance
  | 'BALANCE-HEALTHY'
  | 'BALANCE-IMBALANCE-H2O2'
  | 'BALANCE-IMBALANCE-PH'
  | 'BALANCE-IMBALANCE-PHHIGH';

// ---------------------------------------------------------------------------
// Modifiers (Section D + edge cases F5 / F13)
// ---------------------------------------------------------------------------

export type ModifierId =
  // D.1 Q5 factors (F7 priority order: recurrence > antibiotics > sex > hygiene > others)
  | 'Q5-RECURRENT'
  | 'Q5-ANTIBIOTICS'
  | 'Q5-UNPROTECTED-SEX'
  | 'Q5-HYGIENE'
  | 'Q5-SWIMSUIT'
  | 'Q5-TRAVEL'
  // D.3 Q2 duration
  | 'Q2-PERSISTENT-4-7'
  | 'Q2-PERSISTENT-WEEK'
  // D.2 Q6 cycle
  | 'Q6-AFTER-PERIOD'
  | 'Q6-BEFORE-PERIOD'
  // D.4 Q7 pregnancy
  | 'Q7-PREGNANT'
  | 'Q7-NOT-SURE'
  // Edge cases
  | 'F5-SPOTTING'
  | 'F13-RECURRENCE-TRACKING';

// ---------------------------------------------------------------------------
// Engine output
// ---------------------------------------------------------------------------

export type DiagnosticResult = {
  card: CardKey;
  variant: CardVariantId;
  /** Whether the user reported any Q1 symptom (drives YEAST-POSSIBLE bullets and summaries). */
  symptomatic: boolean;
  modifiers: ModifierId[];
};
