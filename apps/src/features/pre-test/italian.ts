/**
 * Italian copy for the database-backed pre-test questionnaire.
 *
 * Questions are keyed by stable Supabase slugs and choices by stable values,
 * so Italian does not depend on translated database columns (mirrors german.ts).
 */
export const ITALIAN_PRETEST_QUESTIONS: Record<string, string> = {
  symptoms: 'Ha notato qualcuno di questi sintomi nelle ultime 2 settimane?',
  symptoms_onset: 'Quando sono iniziati questi sintomi?',
  discharge_odor: 'Ha notato cambiamenti nell\u2019odore delle sue perdite vaginali?',
  discharge_color: 'Ha notato cambiamenti nel colore delle sue perdite vaginali?',
  recent_factors: 'Le \u00e8 successo qualcosa di questo di recente?',
  cycle: 'In che fase del suo ciclo mestruale si trova?',
  pregnant: '\u00c8 attualmente incinta?',
  fever_or_pain: 'Ha attualmente febbre o un forte dolore al basso ventre?',
};

export const ITALIAN_PRETEST_CHOICES: Record<string, Record<string, string>> = {
  // Symptoms
  symptoms: {
    itching_or_irritation: 'Prurito o irritazione',
    burning: 'Bruciore esterno alla vulva durante la minzione',
    pain_sex: 'Dolore durante i rapporti sessuali',
    sex_bleeding: 'Sanguinamento durante i rapporti sessuali',
    no_symptoms: 'Nessun sintomo particolare',
  },

  // Symptom onset
  symptoms_onset: {
    today: 'Oggi',
    '1_3_days': '1\u20133 giorni fa',
    '4_7_days': '4\u20137 giorni fa',
    '1_plus_week': 'Pi\u00f9 di 1 settimana fa',
    not_applicable: 'Non applicabile',
  },

  // Discharge odour
  discharge_odor: {
    normal: 'Nessun odore inusuale',
    fishy: 'Odore simile a pesce',
    yeasty: 'Odore simile a lievito',
    unpleasant: 'Odore sgradevole intenso',
    other: 'Altro / non sicura',
  },

  // Discharge colour
  discharge_color: {
    clear: 'Perdite trasparenti',
    white: 'Perdite bianche e dense',
    gray: 'Perdite grigie',
    yellow: 'Perdite giallo-verdi',
    bloody: 'Perdite ematiche',
  },

  // Recent factors
  recent_factors: {
    antibiotics: 'Ho assunto antibiotici di recente',
    sick: 'Sono stata malata',
    swimsuit: 'Ho indossato per ore un costume da bagno bagnato o abiti sportivi stretti',
    sex: 'Ho avuto rapporti sessuali non protetti o un nuovo partner',
    stress: 'Ho avuto molto stress o ho dormito male',
    wash: 'Ho usato detergenti vaginali, salviette intime o sapone profumato',
    travel: 'Ho viaggiato di recente o la mia routine \u00e8 cambiata',
    recurrent: 'Sintomi simili negli ultimi 6 mesi',
    similar_symptoms: 'Sintomi simili negli ultimi 6 mesi',
  },

  // Cycle
  cycle: {
    after: 'Subito dopo le mestruazioni',
    mid: 'A met\u00e0 del ciclo',
    before: 'Subito prima delle mestruazioni',
    not_sure: 'Non sicura / irregolare / non applicabile',
  },

  // Pregnancy and pain
  pregnant: {
    yes: 'Incinta',
    no: 'Non incinta',
    not_sure: 'Non sicura se incinta',
  },
  fever_or_pain: {
    yes: 'Dolore',
    no: 'Nessun dolore',
  },
};
