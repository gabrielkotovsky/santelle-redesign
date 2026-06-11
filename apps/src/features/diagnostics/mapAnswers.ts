// Maps pretest responses (Supabase app_pretest_questions/choices) to the
// spec's Q1-Q8 structured inputs. Matching is primarily by question slug and
// choice value, with English-label fallbacks for robustness.

import type {
  Q1Symptom,
  Q2Duration,
  Q3Odor,
  Q4Color,
  Q5Factor,
  Q6Cycle,
  Q7Pregnancy,
  Q8Pain,
  QuestionnaireInputs,
} from './types';
import { EMPTY_QUESTIONNAIRE } from './types';

export type PretestAnswerRow = {
  questionSlug: string;
  /** Raw choice values from app_pretest_choices.value */
  values: string[];
  /** English labels (used as fallback when value matching fails) */
  labels: string[];
};

// Question slugs as deployed in app_pretest_questions (version 1).
const SLUG_Q1 = 'symptoms';
const SLUG_Q2 = 'symptoms_onset';
const SLUG_Q3 = 'discharge_odor';
const SLUG_Q4 = 'discharge_color';
const SLUG_Q5 = 'recent_factors';
const SLUG_Q6 = 'cycle';
const SLUG_Q7 = 'pregnant';
const SLUG_Q8 = 'fever_or_pain';

const Q1_BY_VALUE: Record<string, Q1Symptom> = {
  itching_or_irritation: 'itching',
  burning: 'burning',
  pain_sex: 'pain_sex',
  sex_bleeding: 'bleeding_sex',
  // 'no_symptoms' intentionally maps to nothing.
};

const Q2_BY_VALUE: Record<string, Q2Duration> = {
  today: 'today',
  '1_3_days': '1_3_days',
  '4_7_days': '4_7_days',
  '1_plus_week': 'more_1_week',
  not_applicable: 'not_applicable',
};

const Q3_BY_VALUE: Record<string, Q3Odor> = {
  normal: 'none',
  fishy: 'fishy',
  yeasty: 'yeasty',
  unpleasant: 'strong_unpleasant',
  other: 'other',
};

const Q4_BY_VALUE: Record<string, Q4Color> = {
  clear: 'clear',
  white: 'white_thick',
  gray: 'gray',
  yellow: 'yellow_green',
  bloody: 'bloody',
};

const Q5_BY_VALUE: Record<string, Q5Factor> = {
  antibiotics: 'antibiotics',
  swimsuit: 'swimsuit',
  sex: 'unprotected_sex',
  wash: 'hygiene_products',
  douching: 'hygiene_products',
  travel: 'travel',
  recurrent: 'recurrent_6_months',
  similar_symptoms: 'recurrent_6_months',
  // Legacy v2 options 'sick' and 'stress' intentionally map to nothing (removed in spec v3).
};

const Q6_BY_VALUE: Record<string, Q6Cycle> = {
  after: 'just_after_period',
  mid: 'mid_cycle',
  before: 'just_before_period',
  not_sure: 'not_sure',
};

const Q7_BY_VALUE: Record<string, Q7Pregnancy> = {
  yes: 'pregnant',
  no: 'not_pregnant',
  not_sure: 'not_sure',
};

const Q8_BY_VALUE: Record<string, Q8Pain> = {
  no: 'no_pain',
  yes: 'pain',
};

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function mapQ1Label(label: string): Q1Symptom | null {
  const l = normalize(label);
  if (l.includes('itch')) return 'itching';
  if (l.includes('burn')) return 'burning';
  if (l.includes('bleed')) return 'bleeding_sex';
  if (l.includes('pain') && l.includes('sex')) return 'pain_sex';
  return null;
}

function mapQ3Label(label: string): Q3Odor | null {
  const l = normalize(label);
  if (l.includes('no unusual')) return 'none';
  if (l.includes('fishy')) return 'fishy';
  if (l.includes('yeast')) return 'yeasty';
  if (l.includes('unpleasant') || l.includes('strong')) return 'strong_unpleasant';
  if (l.includes('other') || l.includes('not sure')) return 'other';
  return null;
}

function mapQ4Label(label: string): Q4Color | null {
  const l = normalize(label);
  if (l.includes('clear')) return 'clear';
  if (l.includes('white')) return 'white_thick';
  if (l.includes('gray') || l.includes('grey')) return 'gray';
  if (l.includes('yellow') || l.includes('green')) return 'yellow_green';
  if (l.includes('blood')) return 'bloody';
  return null;
}

function mapQ5Label(label: string): Q5Factor | null {
  const l = normalize(label);
  if (l.includes('antibiotic')) return 'antibiotics';
  if (l.includes('swimsuit') || l.includes('sportwear') || l.includes('sportswear')) return 'swimsuit';
  if (l.includes('unprotected') || l.includes('partner')) return 'unprotected_sex';
  if (
    l.includes('douch') ||
    l.includes('wash') ||
    l.includes('wipe') ||
    l.includes('soap') ||
    l.includes('scented') ||
    l.includes('perfumed') ||
    l.includes('hygiene product')
  ) {
    return 'hygiene_products';
  }
  if (l.includes('travel') || l.includes('routine')) return 'travel';
  if (l.includes('similar symptoms') || l.includes('last 6 months')) return 'recurrent_6_months';
  return null;
}

function mapQ2Label(label: string): Q2Duration | null {
  const l = normalize(label);
  if (l.includes('today')) return 'today';
  if (l.includes('1-3') || l.includes('1–3')) return '1_3_days';
  if (l.includes('4-7') || l.includes('4–7')) return '4_7_days';
  if (l.includes('more than 1 week') || l.includes('week ago')) return 'more_1_week';
  if (l.includes('not applicable')) return 'not_applicable';
  return null;
}

function mapQ6Label(label: string): Q6Cycle | null {
  const l = normalize(label);
  if (l.includes('after')) return 'just_after_period';
  if (l.includes('mid')) return 'mid_cycle';
  if (l.includes('before')) return 'just_before_period';
  if (l.includes('not sure') || l.includes('irregular')) return 'not_sure';
  return null;
}

function mapQ7Label(label: string): Q7Pregnancy | null {
  const l = normalize(label);
  if (l.includes('not pregnant')) return 'not_pregnant';
  if (l.includes('not sure')) return 'not_sure';
  if (l.includes('pregnant')) return 'pregnant';
  return null;
}

function mapQ8Label(label: string): Q8Pain | null {
  const l = normalize(label);
  if (l.includes('no pain')) return 'no_pain';
  if (l.includes('pain')) return 'pain';
  return null;
}

function single<T>(
  row: PretestAnswerRow | undefined,
  byValue: Record<string, T>,
  byLabel: (label: string) => T | null
): T | null {
  if (!row) return null;
  for (const value of row.values) {
    const mapped = byValue[normalize(value)];
    if (mapped !== undefined) return mapped;
  }
  for (const label of row.labels) {
    const mapped = byLabel(label);
    if (mapped !== null) return mapped;
  }
  return null;
}

function multi<T>(
  row: PretestAnswerRow | undefined,
  byValue: Record<string, T>,
  byLabel: (label: string) => T | null
): T[] {
  if (!row) return [];
  const out = new Set<T>();
  row.values.forEach((value, idx) => {
    const byVal = byValue[normalize(value)];
    if (byVal !== undefined) {
      out.add(byVal);
      return;
    }
    const label = row.labels[idx];
    if (label) {
      const byLab = byLabel(label);
      if (byLab !== null) out.add(byLab);
    }
  });
  // Labels without a corresponding value entry.
  if (row.values.length === 0) {
    row.labels.forEach((label) => {
      const byLab = byLabel(label);
      if (byLab !== null) out.add(byLab);
    });
  }
  return Array.from(out);
}

export function mapAnswersToQuestionnaire(rows: PretestAnswerRow[]): QuestionnaireInputs {
  const bySlug = new Map<string, PretestAnswerRow>();
  rows.forEach((row) => bySlug.set(row.questionSlug, row));

  return {
    ...EMPTY_QUESTIONNAIRE,
    q1: multi(bySlug.get(SLUG_Q1), Q1_BY_VALUE, mapQ1Label),
    q2: single(bySlug.get(SLUG_Q2), Q2_BY_VALUE, mapQ2Label),
    q3: single(bySlug.get(SLUG_Q3), Q3_BY_VALUE, mapQ3Label),
    q4: single(bySlug.get(SLUG_Q4), Q4_BY_VALUE, mapQ4Label),
    q5: multi(bySlug.get(SLUG_Q5), Q5_BY_VALUE, mapQ5Label),
    q6: single(bySlug.get(SLUG_Q6), Q6_BY_VALUE, mapQ6Label),
    q7: single(bySlug.get(SLUG_Q7), Q7_BY_VALUE, mapQ7Label),
    q8: single(bySlug.get(SLUG_Q8), Q8_BY_VALUE, mapQ8Label),
  };
}
