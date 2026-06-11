// Santelle master diagnostic engine (spec v3, Section B + E + F).
// Pure function: biomarkers + questionnaire answers -> card variant + modifiers.

import type {
  BiomarkerInputs,
  CardKey,
  CardVariantId,
  DiagnosticResult,
  MarkerValue,
  ModifierId,
  QuestionnaireInputs,
} from './types';

const CARD_BY_VARIANT: Record<string, CardKey> = {
  URGENT: 'urgent',
  BV: 'bv',
  AV: 'av',
  TRICH: 'trich',
  YEAST: 'yeast',
  MIXED: 'mixed',
  POSSIBLE: 'possible',
  BALANCE: 'balance',
};

export function cardKeyForVariant(variant: CardVariantId): CardKey {
  const prefix = variant.split('-')[0];
  return CARD_BY_VARIANT[prefix];
}

function normMarker(value: string | null | undefined): MarkerValue | '' {
  const v = (value ?? '').replace('−', '-').replace('+-', '±').replace('+/-', '±').trim();
  if (v === '-' || v === '±' || v === '+') return v;
  return '';
}

function normLe(value: string | null | undefined): string {
  return (value ?? '').replace('−', '-').trim();
}

/** Builds engine inputs from a raw test_logs row (values normalized internally). */
export function biomarkersFromLog(log: {
  ph: number | null;
  h2o2: string | null;
  le: string | null;
  sna: string | null;
  beta_g: string | null;
  nag: string | null;
}): BiomarkerInputs {
  return {
    ph: typeof log.ph === 'number' ? log.ph : null,
    h2o2: (normMarker(log.h2o2) || null) as BiomarkerInputs['h2o2'],
    le: (normLe(log.le) || null) as BiomarkerInputs['le'],
    sna: (normMarker(log.sna) || null) as BiomarkerInputs['sna'],
    betaG: (normMarker(log.beta_g) || null) as BiomarkerInputs['betaG'],
    nag: (normMarker(log.nag) || null) as BiomarkerInputs['nag'],
  };
}

// ---------------------------------------------------------------------------
// B.1 symptom alignment definitions
// ---------------------------------------------------------------------------

export type Alignment = {
  bv: boolean;
  av: boolean;
  trich: boolean;
  yeast: boolean;
  any: boolean;
};

export function getAlignment(q: QuestionnaireInputs): Alignment {
  const itching = q.q1.includes('itching');
  const burning = q.q1.includes('burning');
  const painSex = q.q1.includes('pain_sex');

  // BV: hallmark fishy smell; supporting gray discharge, itching.
  const bvHallmark = q.q3 === 'fishy';
  const bvSupport = (q.q4 === 'gray' ? 1 : 0) + (itching ? 1 : 0);
  const bv = bvHallmark || bvSupport >= 2;

  // Trich: hallmark strong unpleasant smell AND yellow-green discharge;
  // supporting burning, pain during sex. (F12)
  const trichHallmark = q.q3 === 'strong_unpleasant' && q.q4 === 'yellow_green';
  const trichSupport = (burning ? 1 : 0) + (painSex ? 1 : 0);
  const trich = trichHallmark || trichSupport >= 2;

  // AV: hallmark yellow-green discharge with no fishy or yeasty smell
  // (and not strong unpleasant, which is the trich discriminator — F10/F12);
  // supporting burning, pain during sex.
  const avHallmark =
    q.q4 === 'yellow_green' &&
    q.q3 !== 'fishy' &&
    q.q3 !== 'yeasty' &&
    q.q3 !== 'strong_unpleasant';
  const avSupport = (burning ? 1 : 0) + (painSex ? 1 : 0);
  const av = avHallmark || avSupport >= 2;

  // Yeast: hallmark yeasty smell (F9: yeasty smell alone is enough; discharge
  // may be white-thick, yellowish, or light greenish clumpy — F11);
  // supporting itching, pain during sex, white-thick discharge.
  const yeastHallmark = q.q3 === 'yeasty';
  const yeastSupport =
    (itching ? 1 : 0) + (painSex ? 1 : 0) + (q.q4 === 'white_thick' ? 1 : 0);
  const yeast = yeastHallmark || yeastSupport >= 2;

  return { bv, av, trich, yeast, any: bv || av || trich || yeast };
}

// ---------------------------------------------------------------------------
// Layer 4 — modifiers (Section D + F5/F13)
// ---------------------------------------------------------------------------

function collectModifiers(
  q: QuestionnaireInputs,
  variant: CardVariantId
): ModifierId[] {
  const modifiers: ModifierId[] = [];
  const isUrgent = variant.startsWith('URGENT');

  // D.1 Q5 factors, ordered by F7 priority:
  // recurrence > antibiotics > unprotected/new partners > hygiene products > others.
  // On balance cards the recurrence wording is replaced by the F13 tracking note.
  if (q.q5.includes('recurrent_6_months') && !variant.startsWith('BALANCE')) {
    modifiers.push('Q5-RECURRENT');
  }
  if (q.q5.includes('antibiotics')) modifiers.push('Q5-ANTIBIOTICS');
  if (q.q5.includes('unprotected_sex')) modifiers.push('Q5-UNPROTECTED-SEX');
  if (q.q5.includes('hygiene_products')) modifiers.push('Q5-HYGIENE');
  if (q.q5.includes('swimsuit')) modifiers.push('Q5-SWIMSUIT');
  if (q.q5.includes('travel')) modifiers.push('Q5-TRAVEL');

  // D.3 Q2 duration.
  if (q.q2 === '4_7_days') modifiers.push('Q2-PERSISTENT-4-7');
  if (q.q2 === 'more_1_week') modifiers.push('Q2-PERSISTENT-WEEK');

  // D.2 Q6 cycle phase.
  if (q.q6 === 'just_after_period') modifiers.push('Q6-AFTER-PERIOD');
  if (q.q6 === 'just_before_period') modifiers.push('Q6-BEFORE-PERIOD');

  // D.4 Q7 pregnancy. URGENT-2 is itself the pregnancy card.
  if (q.q7 === 'pregnant' && variant !== 'URGENT-2') modifiers.push('Q7-PREGNANT');
  if (q.q7 === 'not_sure') modifiers.push('Q7-NOT-SURE');

  // F5 — spotting around period (only when not routed to URGENT-4).
  if (
    !isUrgent &&
    q.q4 === 'bloody' &&
    (q.q6 === 'just_before_period' || q.q6 === 'just_after_period')
  ) {
    modifiers.push('F5-SPOTTING');
  }

  return modifiers;
}

// ---------------------------------------------------------------------------
// Main algorithm (Section B)
// ---------------------------------------------------------------------------

export function runDiagnostic(
  biomarkers: BiomarkerInputs,
  q: QuestionnaireInputs
): DiagnosticResult {
  const ph = typeof biomarkers.ph === 'number' ? biomarkers.ph : null;
  const sna = normMarker(biomarkers.sna);
  const betaG = normMarker(biomarkers.betaG);
  const nag = normMarker(biomarkers.nag);
  const h2o2 = normMarker(biomarkers.h2o2);
  const le = normLe(biomarkers.le);

  const highPH = ph !== null && ph >= 4.8;
  const healthyPH = ph !== null && ph >= 3.8 && ph <= 4.4;
  const leStrong = le === '+' || le === '++' || le === '+++';

  const anyQ1Symptom = q.q1.length > 0;
  const alignment = getAlignment(q);

  // Escalation factors (E.1): Q2 > 1 week, Q5 recurrence, (BV only) Q7 not sure.
  const escalation = q.q2 === 'more_1_week' || q.q5.includes('recurrent_6_months');
  const bvEscalation = escalation || q.q7 === 'not_sure';

  const finish = (variant: CardVariantId, extra?: ModifierId[]): DiagnosticResult => ({
    card: cardKeyForVariant(variant),
    variant,
    symptomatic: anyQ1Symptom,
    modifiers: [...collectModifiers(q, variant), ...(extra ?? [])],
  });

  // -------------------------------------------------------------------------
  // LAYER 1 — Red flag override (in spec order)
  // -------------------------------------------------------------------------
  if (q.q8 === 'pain') return finish('URGENT-1');

  // F8: only confirmed pregnancy triggers URGENT-2.
  if (
    q.q7 === 'pregnant' &&
    (sna === '+' || sna === '±' || betaG === '+' || nag === '+')
  ) {
    return finish('URGENT-2');
  }

  if (q.q1.includes('bleeding_sex')) return finish('URGENT-3');

  if (
    q.q4 === 'bloody' &&
    q.q6 !== 'just_before_period' &&
    q.q6 !== 'just_after_period'
  ) {
    return finish('URGENT-4');
  }

  if (sna === '+' && betaG === '+' && nag === '+') return finish('URGENT-5');

  // -------------------------------------------------------------------------
  // LAYER 2 — Biomarker triage
  // -------------------------------------------------------------------------
  const positives = [sna === '+', betaG === '+', nag === '+'].filter(Boolean).length;

  if (positives === 2) {
    if (sna === '+' && betaG === '+') return finish('MIXED-BV-AV');
    if (sna === '+' && nag === '+') {
      return finish(highPH ? 'MIXED-BV-TRICH' : 'MIXED-BV-YEAST');
    }
    // betaG+ AND nag+
    return finish(highPH ? 'MIXED-AV-TRICH' : 'MIXED-AV-YEAST');
  }

  if (positives === 1) {
    if (sna === '+') {
      if (!alignment.bv) return finish('BV-MARKERS-ONLY');
      return finish(bvEscalation ? 'BV-LIKELY-ESCALATION' : 'BV-LIKELY-PHARMACY');
    }
    if (betaG === '+') {
      return finish(alignment.av ? 'AV-LIKELY' : 'AV-MARKERS-ONLY');
    }
    // NAG+ — pH discriminates trich vs yeast (F4: ambiguous pH defaults to yeast).
    if (highPH) return finish('TRICH-LIKELY');
    if (!alignment.yeast) return finish('YEAST-ASYMPTOMATIC');
    return finish(escalation ? 'YEAST-LIKELY-ESCALATION' : 'YEAST-LIKELY');
  }

  // -------------------------------------------------------------------------
  // LAYER 3 — Borderline & symptom-only routing
  // -------------------------------------------------------------------------
  const borderlines = [sna === '±', betaG === '±', nag === '±'].filter(Boolean).length;

  if (borderlines === 1) {
    if (sna === '±') return finish('BV-POSSIBLE');
    if (betaG === '±') return finish('AV-POSSIBLE');
    // NAG±
    return finish(highPH ? 'TRICH-POSSIBLE' : 'YEAST-POSSIBLE');
  }

  if (borderlines >= 2) return finish('POSSIBLE-MIXED');

  // Clean infection markers — B.1 symptom_only_routing (spec order: BV, AV, Trich, Yeast).
  if (alignment.bv) return finish('BV-POSSIBLE-SYMPTOMS');
  if (alignment.av) return finish('AV-POSSIBLE-SYMPTOMS');
  if (alignment.trich) return finish('TRICH-POSSIBLE-SYMPTOMS');
  if (alignment.yeast) return finish('YEAST-POSSIBLE-SYMPTOMS');

  // D.1 antibiotics boost: clean biomarkers + itching but no yeast signature.
  if (q.q5.includes('antibiotics') && q.q1.includes('itching')) {
    return finish('YEAST-POSSIBLE-SYMPTOMS');
  }

  // POSSIBLE-IRRITATION: hygiene products + itching, no signature aligned (G10).
  if (q.q5.includes('hygiene_products') && q.q1.includes('itching')) {
    return finish('POSSIBLE-IRRITATION');
  }

  // B.2 secondary_signals_check — LE rows first.
  if (leStrong && anyQ1Symptom) return finish('POSSIBLE-SYMPTOMATIC-LE');
  if (leStrong && !anyQ1Symptom) return finish('POSSIBLE-LE-ALONE');

  if (anyQ1Symptom) return finish('POSSIBLE-GENERIC');

  // No symptoms — balance tiers.
  // F13: recurrence reported with clean results -> tracking note.
  const f13: ModifierId[] = q.q5.includes('recurrent_6_months')
    ? ['F13-RECURRENCE-TRACKING']
    : [];

  if (healthyPH && (h2o2 === '±' || h2o2 === '+')) {
    return finish('BALANCE-IMBALANCE-H2O2', f13);
  }
  if (ph === 4.6) return finish('BALANCE-IMBALANCE-PH', f13);
  if (highPH) return finish('BALANCE-IMBALANCE-PHHIGH', f13);

  return finish('BALANCE-HEALTHY', f13);
}
