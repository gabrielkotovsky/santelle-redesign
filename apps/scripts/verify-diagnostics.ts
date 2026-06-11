// Verification harness for the v3 diagnostic engine.
// Covers Section G scenarios (G1-G20) and Section F edge cases.
// Run with: npx tsx scripts/verify-diagnostics.ts

import { runDiagnostic } from '../src/features/diagnostics/engine';
import { buildCard } from '../src/features/diagnostics/cards';
import { mapAnswersToQuestionnaire } from '../src/features/diagnostics/mapAnswers';
import type {
  BiomarkerInputs,
  CardVariantId,
  ModifierId,
  QuestionnaireInputs,
} from '../src/features/diagnostics/types';
import { EMPTY_QUESTIONNAIRE } from '../src/features/diagnostics/types';

const CLEAN: BiomarkerInputs = {
  ph: 4.4,
  h2o2: '-',
  le: '-',
  sna: '-',
  betaG: '-',
  nag: '-',
};

function bio(overrides: Partial<BiomarkerInputs>): BiomarkerInputs {
  return { ...CLEAN, ...overrides };
}

function q(overrides: Partial<QuestionnaireInputs>): QuestionnaireInputs {
  return { ...EMPTY_QUESTIONNAIRE, ...overrides };
}

type Case = {
  id: string;
  biomarkers: BiomarkerInputs;
  answers: QuestionnaireInputs;
  expectVariant: CardVariantId;
  expectModifiers?: ModifierId[]; // "contains" assertion
  expectNoModifiers?: boolean;
};

const cases: Case[] = [
  // --- Section G ---
  {
    id: 'G1',
    biomarkers: bio({ sna: '+', ph: 4.8 }),
    answers: q({ q3: 'fishy', q4: 'gray', q2: '1_3_days', q6: 'mid_cycle', q7: 'not_pregnant', q8: 'no_pain' }),
    expectVariant: 'BV-LIKELY-PHARMACY',
    expectNoModifiers: true,
  },
  {
    id: 'G2',
    biomarkers: bio({ nag: '+', ph: 4.4 }),
    answers: q({ q1: ['itching'], q2: 'today', q3: 'yeasty', q4: 'white_thick', q5: ['antibiotics'], q7: 'not_pregnant', q8: 'no_pain' }),
    expectVariant: 'YEAST-LIKELY',
    expectModifiers: ['Q5-ANTIBIOTICS'],
  },
  {
    id: 'G3',
    biomarkers: bio({ betaG: '+', sna: '+', ph: 4.8 }),
    answers: q({ q1: ['burning'], q4: 'yellow_green', q7: 'pregnant', q8: 'no_pain' }),
    expectVariant: 'URGENT-2',
  },
  {
    id: 'G4',
    biomarkers: CLEAN,
    answers: q({ q3: 'fishy', q4: 'gray', q8: 'no_pain' }),
    expectVariant: 'BV-POSSIBLE-SYMPTOMS',
  },
  {
    id: 'G5',
    biomarkers: bio({ sna: '+', betaG: '+', ph: 4.8 }),
    answers: q({}),
    expectVariant: 'MIXED-BV-AV',
  },
  {
    id: 'G6',
    biomarkers: bio({ ph: 3.8 }),
    answers: q({ q6: 'mid_cycle' }),
    expectVariant: 'BALANCE-HEALTHY',
  },
  {
    id: 'G7',
    biomarkers: bio({ nag: '+', ph: 4.4 }),
    answers: q({ q1: ['bleeding_sex'] }),
    expectVariant: 'URGENT-3',
  },
  {
    id: 'G8',
    biomarkers: bio({ ph: 4.6, h2o2: '+' }),
    answers: q({}),
    expectVariant: 'BALANCE-IMBALANCE-PH',
  },
  {
    id: 'G9',
    biomarkers: bio({ sna: '±', nag: '±' }),
    answers: q({}),
    expectVariant: 'POSSIBLE-MIXED',
  },
  {
    id: 'G10',
    biomarkers: bio({ le: '+' }),
    answers: q({ q1: ['itching'], q5: ['hygiene_products'] }),
    expectVariant: 'POSSIBLE-IRRITATION',
    expectModifiers: ['Q5-HYGIENE'],
  },
  {
    id: 'G11',
    biomarkers: bio({ nag: '+', ph: 4.4 }),
    answers: q({ q1: ['itching'], q3: 'yeasty', q4: 'white_thick', q2: 'more_1_week' }),
    expectVariant: 'YEAST-LIKELY-ESCALATION',
    expectModifiers: ['Q2-PERSISTENT-WEEK'],
  },
  {
    id: 'G12',
    biomarkers: bio({ h2o2: '+' }),
    answers: q({}),
    expectVariant: 'BALANCE-IMBALANCE-H2O2',
  },
  {
    id: 'G13',
    biomarkers: CLEAN,
    answers: q({ q4: 'bloody', q6: 'just_before_period' }),
    expectVariant: 'BALANCE-HEALTHY',
    expectModifiers: ['F5-SPOTTING'],
  },
  {
    id: 'G14',
    biomarkers: CLEAN,
    answers: q({ q1: ['burning'], q3: 'strong_unpleasant', q4: 'yellow_green' }),
    expectVariant: 'TRICH-POSSIBLE-SYMPTOMS',
  },
  {
    id: 'G15',
    biomarkers: bio({ betaG: '±' }),
    answers: q({}),
    expectVariant: 'AV-POSSIBLE',
  },
  {
    id: 'G16',
    biomarkers: bio({ nag: '+', ph: 4.4 }),
    answers: q({ q3: 'none', q4: 'clear' }),
    expectVariant: 'YEAST-ASYMPTOMATIC',
  },
  {
    id: 'G17',
    biomarkers: bio({ nag: '+', ph: 5.4 }),
    answers: q({ q1: ['burning'], q3: 'strong_unpleasant', q4: 'yellow_green', q5: ['unprotected_sex'] }),
    expectVariant: 'TRICH-LIKELY',
    expectModifiers: ['Q5-UNPROTECTED-SEX'],
  },
  {
    id: 'G18',
    biomarkers: bio({ le: '++' }),
    answers: q({ q1: ['burning'], q5: ['unprotected_sex'] }),
    expectVariant: 'POSSIBLE-SYMPTOMATIC-LE',
    expectModifiers: ['Q5-UNPROTECTED-SEX'],
  },
  {
    id: 'G19',
    biomarkers: bio({ sna: '+', ph: 4.8 }),
    answers: q({ q1: ['itching'], q2: '1_3_days', q3: 'fishy', q4: 'gray', q5: ['recurrent_6_months'] }),
    expectVariant: 'BV-LIKELY-ESCALATION',
    expectModifiers: ['Q5-RECURRENT'],
  },
  {
    id: 'G20',
    biomarkers: bio({ nag: '+', ph: 4.4 }),
    answers: q({ q1: ['itching'], q3: 'yeasty', q4: 'white_thick', q5: ['recurrent_6_months'] }),
    expectVariant: 'YEAST-LIKELY-ESCALATION',
    expectModifiers: ['Q5-RECURRENT'],
  },

  // --- Section F edge cases & remaining variants ---
  {
    id: 'F1 pH 4.6 alone',
    biomarkers: bio({ ph: 4.6 }),
    answers: q({}),
    expectVariant: 'BALANCE-IMBALANCE-PH',
  },
  {
    id: 'F2 H2O2 borderline alone',
    biomarkers: bio({ h2o2: '±', ph: 3.8 }),
    answers: q({}),
    expectVariant: 'BALANCE-IMBALANCE-H2O2',
  },
  {
    id: 'F3 LE+ alone no symptoms',
    biomarkers: bio({ le: '+' }),
    answers: q({}),
    expectVariant: 'POSSIBLE-LE-ALONE',
  },
  {
    id: 'F8 not-sure pregnant + SNA+ (no URGENT-2)',
    biomarkers: bio({ sna: '+' }),
    answers: q({ q7: 'not_sure' }),
    expectVariant: 'BV-MARKERS-ONLY',
    expectModifiers: ['Q7-NOT-SURE'],
  },
  {
    id: 'F8b not-sure pregnant + SNA+ + aligned -> escalation',
    biomarkers: bio({ sna: '+' }),
    answers: q({ q3: 'fishy', q7: 'not_sure' }),
    expectVariant: 'BV-LIKELY-ESCALATION',
    expectModifiers: ['Q7-NOT-SURE'],
  },
  {
    id: 'F10 yellow-green + no smell',
    biomarkers: CLEAN,
    answers: q({ q3: 'none', q4: 'yellow_green' }),
    expectVariant: 'AV-POSSIBLE-SYMPTOMS',
  },
  {
    id: 'F11 yellow-green + yeasty smell',
    biomarkers: CLEAN,
    answers: q({ q3: 'yeasty', q4: 'yellow_green' }),
    expectVariant: 'YEAST-POSSIBLE-SYMPTOMS',
  },
  {
    id: 'F13 recurrence + all clean, no symptoms',
    biomarkers: CLEAN,
    answers: q({ q5: ['recurrent_6_months'] }),
    expectVariant: 'BALANCE-HEALTHY',
    expectModifiers: ['F13-RECURRENCE-TRACKING'],
  },
  {
    id: 'URGENT-1 fever/pain',
    biomarkers: CLEAN,
    answers: q({ q8: 'pain' }),
    expectVariant: 'URGENT-1',
  },
  {
    id: 'URGENT-4 out-of-cycle bleeding',
    biomarkers: CLEAN,
    answers: q({ q4: 'bloody', q6: 'mid_cycle' }),
    expectVariant: 'URGENT-4',
  },
  {
    id: 'URGENT-5 triple positive',
    biomarkers: bio({ sna: '+', betaG: '+', nag: '+', ph: 5.4 }),
    answers: q({}),
    expectVariant: 'URGENT-5',
  },
  {
    id: 'MIXED-BV-YEAST',
    biomarkers: bio({ sna: '+', nag: '+', ph: 4.4 }),
    answers: q({}),
    expectVariant: 'MIXED-BV-YEAST',
  },
  {
    id: 'MIXED-BV-TRICH',
    biomarkers: bio({ sna: '+', nag: '+', ph: 4.8 }),
    answers: q({}),
    expectVariant: 'MIXED-BV-TRICH',
  },
  {
    id: 'MIXED-AV-YEAST',
    biomarkers: bio({ betaG: '+', nag: '+', ph: 4.4 }),
    answers: q({}),
    expectVariant: 'MIXED-AV-YEAST',
  },
  {
    id: 'MIXED-AV-TRICH',
    biomarkers: bio({ betaG: '+', nag: '+', ph: 5.4 }),
    answers: q({}),
    expectVariant: 'MIXED-AV-TRICH',
  },
  {
    id: 'BV-POSSIBLE borderline',
    biomarkers: bio({ sna: '±' }),
    answers: q({}),
    expectVariant: 'BV-POSSIBLE',
  },
  {
    id: 'YEAST-POSSIBLE borderline low pH',
    biomarkers: bio({ nag: '±', ph: 4.4 }),
    answers: q({ q1: ['itching'] }),
    expectVariant: 'YEAST-POSSIBLE',
  },
  {
    id: 'TRICH-POSSIBLE borderline high pH',
    biomarkers: bio({ nag: '±', ph: 4.8 }),
    answers: q({}),
    expectVariant: 'TRICH-POSSIBLE',
  },
  {
    id: 'POSSIBLE-GENERIC symptoms only',
    biomarkers: CLEAN,
    answers: q({ q1: ['burning'] }),
    expectVariant: 'POSSIBLE-GENERIC',
  },
  {
    id: 'BALANCE-IMBALANCE-PHHIGH',
    biomarkers: bio({ ph: 5.4 }),
    answers: q({}),
    expectVariant: 'BALANCE-IMBALANCE-PHHIGH',
  },
  {
    id: 'D.1 antibiotics boost (itching, no yeast signature)',
    biomarkers: CLEAN,
    answers: q({ q1: ['itching'], q5: ['antibiotics'] }),
    expectVariant: 'YEAST-POSSIBLE-SYMPTOMS',
    expectModifiers: ['Q5-ANTIBIOTICS'],
  },
  {
    id: 'AV-LIKELY markers + symptoms',
    biomarkers: bio({ betaG: '+' }),
    answers: q({ q1: ['burning', 'pain_sex'] }),
    expectVariant: 'AV-LIKELY',
  },
  {
    id: 'AV-MARKERS-ONLY',
    biomarkers: bio({ betaG: '+' }),
    answers: q({}),
    expectVariant: 'AV-MARKERS-ONLY',
  },
  {
    id: 'Pregnant + clean biomarkers + symptoms (F6, not urgent)',
    biomarkers: CLEAN,
    answers: q({ q1: ['itching'], q3: 'fishy', q7: 'pregnant' }),
    expectVariant: 'BV-POSSIBLE-SYMPTOMS',
    expectModifiers: ['Q7-PREGNANT'],
  },
];

let failures = 0;

for (const c of cases) {
  const result = runDiagnostic(c.biomarkers, c.answers);
  const problems: string[] = [];

  if (result.variant !== c.expectVariant) {
    problems.push(`variant: expected ${c.expectVariant}, got ${result.variant}`);
  }
  if (c.expectModifiers) {
    for (const m of c.expectModifiers) {
      if (!result.modifiers.includes(m)) {
        problems.push(`missing modifier ${m} (got: ${result.modifiers.join(', ') || 'none'})`);
      }
    }
  }
  if (c.expectNoModifiers && result.modifiers.length > 0) {
    problems.push(`expected no modifiers, got: ${result.modifiers.join(', ')}`);
  }

  // Smoke-check card rendering in both languages.
  for (const lang of ['en', 'fr']) {
    const card = buildCard(result, lang);
    if (!card.title || !card.summary || !card.path || card.bullets.length === 0) {
      problems.push(`buildCard(${lang}) returned incomplete content`);
    }
  }

  if (problems.length) {
    failures++;
    console.error(`FAIL ${c.id}`);
    problems.forEach((p) => console.error(`   - ${p}`));
  } else {
    console.log(`PASS ${c.id} -> ${result.variant}`);
  }
}

// YEAST-POSSIBLE bullet split check.
{
  const symptomatic = runDiagnostic(bio({ nag: '±', ph: 4.4 }), q({ q1: ['itching'] }));
  const asymptomatic = runDiagnostic(bio({ nag: '±', ph: 4.4 }), q({}));
  const cardS = buildCard(symptomatic, 'en');
  const cardA = buildCard(asymptomatic, 'en');
  if (cardS.bullets[0] === cardA.bullets[0]) {
    failures++;
    console.error('FAIL YEAST-POSSIBLE bullet split: symptomatic and asymptomatic bullets are identical');
  } else if (!cardA.bullets[0].toLowerCase().includes('no treatment')) {
    failures++;
    console.error('FAIL YEAST-POSSIBLE asymptomatic bullets should start with "No treatment is needed."');
  } else {
    console.log('PASS YEAST-POSSIBLE bullet split');
  }
}

// mapAnswers smoke test using real DB slugs/values.
{
  const answers = mapAnswersToQuestionnaire([
    { questionSlug: 'symptoms', values: ['itching_or_irritation', 'sex_bleeding'], labels: ['Itching or irritation', 'Bleeding during sex'] },
    { questionSlug: 'symptoms_onset', values: ['1_plus_week'], labels: ['More than 1 week ago'] },
    { questionSlug: 'discharge_odor', values: ['unpleasant'], labels: ['Strong unpleasant smell'] },
    { questionSlug: 'discharge_color', values: ['yellow'], labels: ['Yellow-green discharge'] },
    { questionSlug: 'recent_factors', values: ['sex', 'wash', 'sick'], labels: ['I had unprotected sex or a new partner', 'I used vaginal wash, wipes, or scented soap', "I've been sick"] },
    { questionSlug: 'cycle', values: ['mid'], labels: ['Mid-cycle'] },
    { questionSlug: 'pregnant', values: ['not_sure'], labels: ['Not sure if pregnant'] },
    { questionSlug: 'fever_or_pain', values: ['no'], labels: ['No pain'] },
  ]);

  const ok =
    answers.q1.includes('itching') &&
    answers.q1.includes('bleeding_sex') &&
    answers.q2 === 'more_1_week' &&
    answers.q3 === 'strong_unpleasant' &&
    answers.q4 === 'yellow_green' &&
    answers.q5.includes('unprotected_sex') &&
    answers.q5.includes('hygiene_products') &&
    !answers.q5.includes('antibiotics') &&
    answers.q5.length === 2 && // 'sick' must be dropped
    answers.q6 === 'mid_cycle' &&
    answers.q7 === 'not_sure' &&
    answers.q8 === 'no_pain';

  if (!ok) {
    failures++;
    console.error('FAIL mapAnswers smoke test:', JSON.stringify(answers, null, 2));
  } else {
    console.log('PASS mapAnswers smoke test');
  }
}

if (failures > 0) {
  console.error(`\n${failures} failure(s).`);
  process.exit(1);
}
console.log(`\nAll ${cases.length + 2} checks passed.`);
