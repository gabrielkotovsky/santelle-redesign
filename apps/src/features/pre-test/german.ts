/**
 * German copy for the database-backed pre-test questionnaire.
 *
 * Questions are keyed by stable Supabase slugs and choices by stable values,
 * so German does not depend on translated database columns.
 */
export const GERMAN_PRETEST_QUESTIONS: Record<string, string> = {
  symptoms: 'Traf in den letzten 2 Wochen etwas davon auf Sie zu?',
  symptoms_onset: 'Wann haben diese Symptome begonnen?',
  discharge_odor: 'Haben Sie Veranderungen beim Geruch Ihres Ausflusses bemerkt?',
  discharge_color: 'Haben Sie Veranderungen bei der Farbe Ihres Ausflusses bemerkt?',
  recent_factors: 'Traf in letzter Zeit etwas davon auf Sie zu?',
  cycle: 'Wo befinden Sie sich in Ihrem Menstruationszyklus?',
  pregnant: 'Sind Sie derzeit schwanger?',
  fever_or_pain: 'Haben Sie derzeit Fieber oder starke Unterbauchschmerzen?',
};

export const GERMAN_PRETEST_CHOICES: Record<string, Record<string, string>> = {
  // Symptoms
  symptoms: {
    itching_or_irritation: 'Juckreiz oder Reizung',
    burning: 'Äußerliches Brennen an der Vulva beim Wasserlassen',
    pain_sex: 'Schmerzen beim Geschlechtsverkehr',
    sex_bleeding: 'Blutungen beim Geschlechtsverkehr',
    no_symptoms: 'Keine besonderen Symptome',
  },

  // Symptom onset
  symptoms_onset: {
    today: 'Heute',
    '1_3_days': 'Vor 1–3 Tagen',
    '4_7_days': 'Vor 4–7 Tagen',
    '1_plus_week': 'Vor mehr als 1 Woche',
    not_applicable: 'Nicht zutreffend',
  },

  // Discharge odour
  discharge_odor: {
    normal: 'Kein ungewöhnlicher Geruch',
    fishy: 'Fischähnlicher Geruch',
    yeasty: 'Hefeartiger Geruch',
    unpleasant: 'Starker unangenehmer Geruch',
    other: 'Sonstiges / nicht sicher',
  },

  // Discharge colour
  discharge_color: {
    clear: 'Klarer Ausfluss',
    white: 'Weißer und dickflüssiger Ausfluss',
    gray: 'Grauer Ausfluss',
    yellow: 'Gelb-grüner Ausfluss',
    bloody: 'Blutiger Ausfluss',
  },

  // Recent factors
  recent_factors: {
    antibiotics: 'Ich habe kürzlich Antibiotika eingenommen',
    sick: 'Ich war krank',
    swimsuit: 'Ich trug stundenlang einen nassen Badeanzug oder enge Sportkleidung',
    sex: 'Ich hatte ungeschützten Geschlechtsverkehr oder einen neuen Partner',
    stress: 'Ich hatte viel Stress oder habe schlecht geschlafen',
    wash: 'Ich habe Vaginalwaschmittel, Intimtücher oder parfümierte Seife verwendet',
    travel: 'Ich bin kürzlich verreist oder meine Routine hat sich verändert',
    recurrent: 'Ähnliche Symptome in den letzten 6 Monaten',
    similar_symptoms: 'Ähnliche Symptome in den letzten 6 Monaten',
  },

  // Cycle
  cycle: {
    after: 'Direkt nach der Menstruation',
    mid: 'In der Mitte des Zyklus',
    before: 'Direkt vor der Menstruation',
    not_sure: 'Nicht sicher / unregelmäßig / nicht zutreffend',
  },

  // Pregnancy and pain
  pregnant: {
    yes: 'Schwanger',
    no: 'Nicht schwanger',
    not_sure: 'Nicht sicher, ob ich schwanger bin',
  },
  fever_or_pain: {
    yes: 'Schmerzen',
    no: 'Keine Schmerzen',
  },
};
