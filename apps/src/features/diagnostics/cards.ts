// Santelle card library (spec v3, Sections C + D).
// English copy is verbatim from the spec; French is a careful translation.

import type { CardKey, CardVariantId, DiagnosticResult, ModifierId } from './types';

export type CardContent = {
  title: string;
  summary: string;
  path: string;
  bullets: string[];
  /** YEAST-POSSIBLE only: bullets when no symptoms are present. */
  bulletsAsymptomatic?: string[];
};

type CardDefinition = {
  color: string;
  en: CardContent;
  fr: CardContent;
};

export type RenderedCard = {
  profileKey: CardKey;
  variant: CardVariantId;
  title: string;
  summary: string;
  path: string;
  bullets: string[];
  /** Modifier notes (Section D) appended below the bullets. */
  notes: string[];
  color: string;
};

const RED = '#F44336';
const ORANGE = '#FF9800';
const GREEN = '#4CAF50';

const PROBIOTIC_STRAINS_EN =
  'Lactobacillus rhamnosus GR-1, L. reuteri B-54, or L. reuteri RC-14';
const PROBIOTIC_STRAINS_FR =
  'Lactobacillus rhamnosus GR-1, L. reuteri B-54 ou L. reuteri RC-14';

export const CARDS: Record<CardVariantId, CardDefinition> = {
  // ---------------------------------------------------------------------------
  // C.1 urgent
  // ---------------------------------------------------------------------------
  'URGENT-1': {
    color: RED,
    en: {
      title: 'Important: please seek medical care promptly',
      summary:
        'Fever or severe pelvic pain combined with vaginal symptoms can signal a more serious infection such as pelvic inflammatory disease (PID).',
      path: 'Recommended action: medical consultation (priority)',
      bullets: [
        'See a clinician within 24–48 hours, or sooner if symptoms worsen.',
        'Avoid OTC self-treatment until evaluated.',
        'Track symptoms (timing, severity, discharge) for the consultation.',
      ],
    },
    fr: {
      title: 'Important : consultez rapidement un médecin',
      summary:
        'De la fièvre ou des douleurs pelviennes sévères associées à des symptômes vaginaux peuvent signaler une infection plus grave, comme une maladie inflammatoire pelvienne (MIP).',
      path: 'Action recommandée : consultation médicale (prioritaire)',
      bullets: [
        'Consultez un professionnel de santé dans les 24 à 48 heures, ou plus tôt si les symptômes s’aggravent.',
        'Évitez toute automédication en vente libre avant l’évaluation.',
        'Notez vos symptômes (chronologie, intensité, pertes) pour la consultation.',
      ],
    },
  },
  'URGENT-2': {
    color: RED,
    en: {
      title: 'Pregnancy and infection signs — urgent medical evaluation needed',
      summary:
        'Bacterial vaginosis in pregnancy is a major risk factor for premature labour and premature birth. Any infection sign during pregnancy needs prompt medical attention, with or without symptoms.',
      path: 'Recommended action: medical consultation (priority)',
      bullets: [
        'Contact your obstetrician or midwife within 24–48 hours.',
        'Do not start any OTC treatment without medical advice during pregnancy.',
        'Bring your test results to the consultation.',
      ],
    },
    fr: {
      title: 'Grossesse et signes d’infection — évaluation médicale urgente nécessaire',
      summary:
        'La vaginose bactérienne pendant la grossesse est un facteur de risque majeur de travail prématuré et d’accouchement prématuré. Tout signe d’infection pendant la grossesse nécessite une prise en charge médicale rapide, avec ou sans symptômes.',
      path: 'Action recommandée : consultation médicale (prioritaire)',
      bullets: [
        'Contactez votre obstétricien·ne ou votre sage-femme dans les 24 à 48 heures.',
        'Ne commencez aucun traitement en vente libre sans avis médical pendant la grossesse.',
        'Apportez vos résultats de test à la consultation.',
      ],
    },
  },
  'URGENT-3': {
    color: RED,
    en: {
      title: 'Bleeding during intercourse — please seek evaluation',
      summary:
        'Bleeding during or after sex is one of the most common signs of chlamydia, an STD that the home test cannot detect. An STD screening centre or sexual health clinic is usually faster and more direct than a gynaecologist appointment.',
      path: 'Recommended action: medical consultation (priority)',
      bullets: [
        'Visit an STD screening centre or sexual health clinic soon.',
        'Note when bleeding occurred, how much, and whether it recurs.',
        'A clinician can rule out cervical or other causes the kit cannot detect.',
      ],
    },
    fr: {
      title: 'Saignements pendant les rapports — faites-vous évaluer',
      summary:
        'Des saignements pendant ou après les rapports sexuels sont l’un des signes les plus fréquents de la chlamydia, une IST que le test à domicile ne peut pas détecter. Un centre de dépistage des IST ou une clinique de santé sexuelle est généralement plus rapide et plus direct qu’un rendez-vous chez le gynécologue.',
      path: 'Action recommandée : consultation médicale (prioritaire)',
      bullets: [
        'Rendez-vous prochainement dans un centre de dépistage des IST ou une clinique de santé sexuelle.',
        'Notez quand les saignements sont survenus, leur abondance et s’ils se répètent.',
        'Un·e clinicien·ne peut écarter des causes cervicales ou autres que le kit ne peut pas détecter.',
      ],
    },
  },
  'URGENT-4': {
    color: RED,
    en: {
      title: 'Out-of-cycle bleeding — please consult',
      summary:
        'Bleeding outside your normal cycle needs medical evaluation. An STD screening centre is the fastest first step if you suspect a sexually transmitted cause.',
      path: 'Recommended action: medical consultation (priority)',
      bullets: [
        'Schedule a consultation or visit an STD screening centre soon.',
        'Track when the bleeding started and its character.',
        'Avoid OTC self-treatment until evaluated.',
      ],
    },
    fr: {
      title: 'Saignements hors cycle — veuillez consulter',
      summary:
        'Des saignements en dehors de votre cycle normal nécessitent une évaluation médicale. Un centre de dépistage des IST est la première étape la plus rapide si vous suspectez une cause sexuellement transmissible.',
      path: 'Action recommandée : consultation médicale (prioritaire)',
      bullets: [
        'Prenez rendez-vous prochainement ou rendez-vous dans un centre de dépistage des IST.',
        'Notez quand les saignements ont commencé et leur aspect.',
        'Évitez toute automédication en vente libre avant l’évaluation.',
      ],
    },
  },
  'URGENT-5': {
    color: RED,
    en: {
      title: 'Three infection markers positive — please recheck and consult',
      summary:
        'Three infection markers reading positive simultaneously is biologically very unusual. Some of the test colours can be hard to differentiate, especially in low light or after the 15-minute window. We recommend rechecking your reading against the chart, and consulting a clinician if the result is confirmed.',
      path: 'Recommended action: medical consultation (priority)',
      bullets: [
        'Recheck your test reading against the colour chart in good light.',
        'If the reading is confirmed, schedule a medical consultation soon.',
        'Bring your test results to the appointment.',
        'Avoid self-treatment that could mask one condition while treating another.',
      ],
    },
    fr: {
      title: 'Trois marqueurs d’infection positifs — vérifiez votre lecture et consultez',
      summary:
        'Trois marqueurs d’infection positifs simultanément est biologiquement très inhabituel. Certaines couleurs du test peuvent être difficiles à différencier, surtout en faible luminosité ou après la fenêtre de 15 minutes. Nous vous recommandons de vérifier à nouveau votre lecture avec le nuancier, et de consulter si le résultat se confirme.',
      path: 'Action recommandée : consultation médicale (prioritaire)',
      bullets: [
        'Vérifiez à nouveau la lecture de votre test avec le nuancier, sous un bon éclairage.',
        'Si la lecture se confirme, prenez rapidement rendez-vous chez un médecin.',
        'Apportez vos résultats de test au rendez-vous.',
        'Évitez l’automédication, qui pourrait masquer une affection tout en en traitant une autre.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.2 bv
  // ---------------------------------------------------------------------------
  'BV-LIKELY-PHARMACY': {
    color: RED,
    en: {
      title: 'Likely bacterial vaginosis (BV) profile',
      summary:
        'Based on your test markers and reported symptoms. The combination of an elevated Bacterial Vaginosis (formerly Gardnerella) marker and matching symptoms gives a clear enough picture for a pharmacist to advise on treatment.',
      path: 'Recommended action: pharmacy — prescription antibiotics',
      bullets: [
        'Show your results to your pharmacist — they can advise on prescription antibiotics (such as topical clindamycin or oral metronidazole).',
        'Complete the full course of treatment, even if symptoms improve quickly.',
        'Avoid sex during treatment to reduce reinfection and irritation.',
        `After treatment, consider a vaginal probiotic with ${PROBIOTIC_STRAINS_EN} — there is evidence these strains help prevent BV recurrence.`,
        'Retest 2–3 weeks after completing treatment to confirm resolution.',
      ],
    },
    fr: {
      title: 'Profil probable de vaginose bactérienne (VB)',
      summary:
        'Basé sur vos marqueurs de test et les symptômes rapportés. La combinaison d’un marqueur de vaginose bactérienne (anciennement Gardnerella) élevé et de symptômes concordants donne une image suffisamment claire pour qu’un·e pharmacien·ne puisse vous conseiller un traitement.',
      path: 'Action recommandée : pharmacie — antibiotiques sur ordonnance',
      bullets: [
        'Montrez vos résultats à votre pharmacien·ne — il/elle peut vous conseiller des antibiotiques sur ordonnance (comme la clindamycine topique ou le métronidazole oral).',
        'Suivez le traitement jusqu’au bout, même si les symptômes s’améliorent rapidement.',
        'Évitez les rapports sexuels pendant le traitement pour réduire la réinfection et l’irritation.',
        `Après le traitement, envisagez un probiotique vaginal avec ${PROBIOTIC_STRAINS_FR} — il existe des preuves que ces souches aident à prévenir les récidives de VB.`,
        'Refaites un test 2 à 3 semaines après la fin du traitement pour confirmer la résolution.',
      ],
    },
  },
  'BV-MARKERS-ONLY': {
    color: RED,
    en: {
      title: 'Likely bacterial vaginosis (BV) profile',
      summary:
        'Your Bacterial Vaginosis (formerly Gardnerella) marker is positive but you have not reported matching symptoms. Asymptomatic BV can still benefit from evaluation, and a doctor’s confirmation is recommended before starting any treatment.',
      path: 'Recommended action: doctor consultation',
      bullets: [
        'Book a doctor’s appointment in the coming days.',
        'Bring your test results to the appointment.',
        'Watch for any new symptoms (fishy odour, gray discharge, itching) and note when they appear.',
      ],
    },
    fr: {
      title: 'Profil probable de vaginose bactérienne (VB)',
      summary:
        'Votre marqueur de vaginose bactérienne (anciennement Gardnerella) est positif, mais vous n’avez pas rapporté de symptômes concordants. Une VB asymptomatique mérite tout de même une évaluation, et une confirmation médicale est recommandée avant de commencer tout traitement.',
      path: 'Action recommandée : consultation médicale',
      bullets: [
        'Prenez rendez-vous chez un médecin dans les prochains jours.',
        'Apportez vos résultats de test au rendez-vous.',
        'Surveillez l’apparition de nouveaux symptômes (odeur de poisson, pertes grises, démangeaisons) et notez quand ils apparaissent.',
      ],
    },
  },
  'BV-LIKELY-ESCALATION': {
    color: RED,
    en: {
      title: 'Likely bacterial vaginosis (BV) profile — recurrent or persistent',
      summary:
        'Based on your test markers and reported symptoms. Persistent symptoms (more than a week), recurring BV, or uncertainty about pregnancy mean a doctor’s evaluation is the safer route. Recurrent BV often needs longer or alternative treatment than a single antibiotic course.',
      path: 'Recommended action: doctor consultation',
      bullets: [
        'Book a doctor’s appointment in the coming days.',
        'Bring your test results — including a note of when you had BV before, if known.',
        'If pregnancy is uncertain, take a pregnancy test before any treatment.',
        `After treatment, consider a vaginal probiotic with ${PROBIOTIC_STRAINS_EN} to reduce recurrence risk.`,
      ],
    },
    fr: {
      title: 'Profil probable de vaginose bactérienne (VB) — récidivante ou persistante',
      summary:
        'Basé sur vos marqueurs de test et les symptômes rapportés. Des symptômes persistants (plus d’une semaine), une VB récidivante ou une incertitude quant à une grossesse rendent l’évaluation médicale plus sûre. Une VB récidivante nécessite souvent un traitement plus long ou différent d’une simple cure d’antibiotiques.',
      path: 'Action recommandée : consultation médicale',
      bullets: [
        'Prenez rendez-vous chez un médecin dans les prochains jours.',
        'Apportez vos résultats de test — en notant, si possible, quand vous avez déjà eu une VB.',
        'En cas de doute sur une grossesse, faites un test de grossesse avant tout traitement.',
        `Après le traitement, envisagez un probiotique vaginal avec ${PROBIOTIC_STRAINS_FR} pour réduire le risque de récidive.`,
      ],
    },
  },
  'BV-POSSIBLE': {
    color: ORANGE,
    en: {
      title: 'Possible bacterial vaginosis (BV) profile',
      summary:
        'Your Bacterial Vaginosis (formerly Gardnerella) marker is borderline — neither clearly positive nor clearly negative. This can happen during the very early or healing stages of BV, or after recent sex, douching, or cycle events.',
      path: 'Recommended action: doctor consultation or retest',
      bullets: [
        'Retest in 5–7 days, avoiding sex, douching, and scented products beforehand.',
        'If symptoms appear or worsen, book a doctor’s appointment without waiting.',
      ],
    },
    fr: {
      title: 'Profil possible de vaginose bactérienne (VB)',
      summary:
        'Votre marqueur de vaginose bactérienne (anciennement Gardnerella) est limite — ni clairement positif, ni clairement négatif. Cela peut arriver au tout début ou en phase de guérison d’une VB, ou après des rapports récents, des douches vaginales ou des événements du cycle.',
      path: 'Action recommandée : consultation médicale ou nouveau test',
      bullets: [
        'Refaites un test dans 5 à 7 jours, en évitant au préalable les rapports sexuels, les douches vaginales et les produits parfumés.',
        'Si des symptômes apparaissent ou s’aggravent, prenez rendez-vous chez un médecin sans attendre.',
      ],
    },
  },
  'BV-POSSIBLE-SYMPTOMS': {
    color: ORANGE,
    en: {
      title: 'Possible bacterial vaginosis (BV) profile',
      summary:
        'Your symptoms suggest Bacterial Vaginosis (formerly Gardnerella), but your test markers are clean. The test may have caught the infection too early, or symptoms may have another cause.',
      path: 'Recommended action: doctor consultation or retest',
      bullets: [
        'Retest in 5–7 days if symptoms persist.',
        'If symptoms worsen before then, book a doctor’s appointment.',
        'Avoid scented products and douching, which can mask or worsen symptoms.',
      ],
    },
    fr: {
      title: 'Profil possible de vaginose bactérienne (VB)',
      summary:
        'Vos symptômes évoquent une vaginose bactérienne (anciennement Gardnerella), mais vos marqueurs de test sont normaux. Le test a peut-être été fait trop tôt, ou les symptômes peuvent avoir une autre cause.',
      path: 'Action recommandée : consultation médicale ou nouveau test',
      bullets: [
        'Refaites un test dans 5 à 7 jours si les symptômes persistent.',
        'Si les symptômes s’aggravent avant, prenez rendez-vous chez un médecin.',
        'Évitez les produits parfumés et les douches vaginales, qui peuvent masquer ou aggraver les symptômes.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.3 av
  // ---------------------------------------------------------------------------
  'AV-LIKELY': {
    color: RED,
    en: {
      title: 'Possible aerobic vaginitis (AV) profile',
      summary:
        'Based on your test markers and reported symptoms. Aerobic Vaginitis (AV) is less well established than BV and benefits from a doctor’s evaluation before any treatment.',
      path: 'Recommended action: doctor consultation',
      bullets: [
        'Book a doctor’s appointment in the coming days.',
        'Bring your test results to the appointment.',
        'Avoid irritant products and douching in the meantime.',
      ],
    },
    fr: {
      title: 'Profil possible de vaginite aérobie (VA)',
      summary:
        'Basé sur vos marqueurs de test et les symptômes rapportés. La vaginite aérobie (VA) est moins bien établie que la VB et mérite une évaluation médicale avant tout traitement.',
      path: 'Action recommandée : consultation médicale',
      bullets: [
        'Prenez rendez-vous chez un médecin dans les prochains jours.',
        'Apportez vos résultats de test au rendez-vous.',
        'Évitez les produits irritants et les douches vaginales en attendant.',
      ],
    },
  },
  'AV-MARKERS-ONLY': {
    color: RED,
    en: {
      title: 'Possible aerobic vaginitis (AV) profile',
      summary:
        'Your Aerobic Vaginitis (AV) marker is positive but you have not reported matching symptoms. A doctor’s evaluation is the right next step before any action.',
      path: 'Recommended action: doctor consultation',
      bullets: [
        'Book a doctor’s appointment in the coming days.',
        'Bring your test results to the appointment.',
        'Watch for any new symptoms (yellow-green discharge, burning, pain) and note when they appear.',
      ],
    },
    fr: {
      title: 'Profil possible de vaginite aérobie (VA)',
      summary:
        'Votre marqueur de vaginite aérobie (VA) est positif, mais vous n’avez pas rapporté de symptômes concordants. Une évaluation médicale est la bonne prochaine étape avant toute action.',
      path: 'Action recommandée : consultation médicale',
      bullets: [
        'Prenez rendez-vous chez un médecin dans les prochains jours.',
        'Apportez vos résultats de test au rendez-vous.',
        'Surveillez l’apparition de nouveaux symptômes (pertes jaune-vert, brûlures, douleurs) et notez quand ils apparaissent.',
      ],
    },
  },
  'AV-POSSIBLE': {
    color: ORANGE,
    en: {
      title: 'Possible aerobic vaginitis (AV) profile',
      summary:
        'Your Aerobic Vaginitis (AV) marker is borderline. This can happen during early infection, healing, or after recent antibiotics.',
      path: 'Recommended action: retest or doctor consultation',
      bullets: [
        'Retest in 5–7 days, avoiding sex and irritant products beforehand.',
        'If symptoms appear or worsen, book a doctor’s appointment without waiting.',
      ],
    },
    fr: {
      title: 'Profil possible de vaginite aérobie (VA)',
      summary:
        'Votre marqueur de vaginite aérobie (VA) est limite. Cela peut arriver en début d’infection, en phase de guérison ou après une prise récente d’antibiotiques.',
      path: 'Action recommandée : nouveau test ou consultation médicale',
      bullets: [
        'Refaites un test dans 5 à 7 jours, en évitant au préalable les rapports sexuels et les produits irritants.',
        'Si des symptômes apparaissent ou s’aggravent, prenez rendez-vous chez un médecin sans attendre.',
      ],
    },
  },
  'AV-POSSIBLE-SYMPTOMS': {
    color: ORANGE,
    en: {
      title: 'Possible aerobic vaginitis (AV) profile',
      summary:
        'Your symptoms suggest Aerobic Vaginitis (AV), but your test markers are clean. The test may have caught the infection too early, or symptoms may have another cause.',
      path: 'Recommended action: retest or doctor consultation',
      bullets: [
        'Retest in 5–7 days if symptoms persist.',
        'If symptoms worsen before then, book a doctor’s appointment.',
      ],
    },
    fr: {
      title: 'Profil possible de vaginite aérobie (VA)',
      summary:
        'Vos symptômes évoquent une vaginite aérobie (VA), mais vos marqueurs de test sont normaux. Le test a peut-être été fait trop tôt, ou les symptômes peuvent avoir une autre cause.',
      path: 'Action recommandée : nouveau test ou consultation médicale',
      bullets: [
        'Refaites un test dans 5 à 7 jours si les symptômes persistent.',
        'Si les symptômes s’aggravent avant, prenez rendez-vous chez un médecin.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.4 trich
  // ---------------------------------------------------------------------------
  'TRICH-LIKELY': {
    color: RED,
    en: {
      title: 'Likely trichomoniasis profile',
      summary:
        'Based on your test markers. Trichomoniasis is a sexually transmitted infection that requires prescription antibiotic treatment for you and all sexual partners. A doctor or STD screening centre is the right next step.',
      path: 'Recommended action: STD screening centre + doctor consultation',
      bullets: [
        'Visit an STD screening centre or sexual health clinic to confirm and start treatment.',
        'All recent sexual partners must be treated, even if they have no symptoms, to prevent reinfection.',
        'Get screened for other STDs at the same visit — trich is a marker for possible co-infection.',
        'Avoid sex until you and your partner(s) have completed treatment.',
      ],
    },
    fr: {
      title: 'Profil probable de trichomonase',
      summary:
        'Basé sur vos marqueurs de test. La trichomonase est une infection sexuellement transmissible qui nécessite un traitement antibiotique sur ordonnance pour vous et tous vos partenaires sexuels. Un médecin ou un centre de dépistage des IST est la bonne prochaine étape.',
      path: 'Action recommandée : centre de dépistage des IST + consultation médicale',
      bullets: [
        'Rendez-vous dans un centre de dépistage des IST ou une clinique de santé sexuelle pour confirmer et commencer le traitement.',
        'Tous les partenaires sexuels récents doivent être traités, même sans symptômes, pour éviter une réinfection.',
        'Faites un dépistage des autres IST lors de la même visite — la trichomonase est un marqueur de co-infection possible.',
        'Évitez les rapports sexuels jusqu’à la fin du traitement pour vous et votre/vos partenaire(s).',
      ],
    },
  },
  'TRICH-POSSIBLE': {
    color: ORANGE,
    en: {
      title: 'Possible trichomoniasis profile',
      summary:
        'Your marker is borderline with elevated pH — this pattern can indicate early or healing trichomoniasis. Trich is a sexually transmitted infection, so an STD screening centre is the fastest way to confirm.',
      path: 'Recommended action: STD screening centre',
      bullets: [
        'Visit an STD screening centre or sexual health clinic to confirm.',
        'Avoid sex until confirmed and treated.',
        'If confirmed, all recent sexual partners must also be treated.',
      ],
    },
    fr: {
      title: 'Profil possible de trichomonase',
      summary:
        'Votre marqueur est limite avec un pH élevé — ce schéma peut indiquer une trichomonase débutante ou en cours de guérison. La trichomonase est une infection sexuellement transmissible : un centre de dépistage des IST est le moyen le plus rapide de confirmer.',
      path: 'Action recommandée : centre de dépistage des IST',
      bullets: [
        'Rendez-vous dans un centre de dépistage des IST ou une clinique de santé sexuelle pour confirmer.',
        'Évitez les rapports sexuels jusqu’à confirmation et traitement.',
        'En cas de confirmation, tous les partenaires sexuels récents doivent aussi être traités.',
      ],
    },
  },
  'TRICH-POSSIBLE-SYMPTOMS': {
    color: ORANGE,
    en: {
      title: 'Possible trichomoniasis profile',
      summary:
        'Your symptoms suggest trichomoniasis but your markers are clean. Because trich is a sexually transmitted infection, an STD screening centre is the fastest and most direct way to confirm.',
      path: 'Recommended action: STD screening centre',
      bullets: [
        'Visit an STD screening centre or sexual health clinic to confirm.',
        'Avoid sex until confirmed and treated.',
        'Get screened for other STDs at the same visit.',
      ],
    },
    fr: {
      title: 'Profil possible de trichomonase',
      summary:
        'Vos symptômes évoquent une trichomonase, mais vos marqueurs sont normaux. La trichomonase étant une infection sexuellement transmissible, un centre de dépistage des IST est le moyen le plus rapide et le plus direct de confirmer.',
      path: 'Action recommandée : centre de dépistage des IST',
      bullets: [
        'Rendez-vous dans un centre de dépistage des IST ou une clinique de santé sexuelle pour confirmer.',
        'Évitez les rapports sexuels jusqu’à confirmation et traitement.',
        'Faites un dépistage des autres IST lors de la même visite.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.5 yeast
  // ---------------------------------------------------------------------------
  'YEAST-LIKELY': {
    color: ORANGE,
    en: {
      title: 'Likely yeast profile',
      summary: 'Based on your test markers and reported symptoms.',
      path: 'Recommended action: pharmacy — OTC antifungal',
      bullets: [
        'Start an OTC antifungal (such as clotrimazole or fluconazole) — ask your pharmacist for the right product.',
        'Symptoms should improve within 3 days; if not, see a clinician.',
        'Avoid sex during treatment to reduce irritation.',
        'Retest in 5–7 days if symptoms persist.',
      ],
    },
    fr: {
      title: 'Profil probable de mycose',
      summary: 'Basé sur vos marqueurs de test et les symptômes rapportés.',
      path: 'Action recommandée : pharmacie — antifongique en vente libre',
      bullets: [
        'Commencez un antifongique en vente libre (comme le clotrimazole ou le fluconazole) — demandez conseil à votre pharmacien·ne.',
        'Les symptômes devraient s’améliorer en 3 jours ; sinon, consultez un professionnel de santé.',
        'Évitez les rapports sexuels pendant le traitement pour réduire l’irritation.',
        'Refaites un test dans 5 à 7 jours si les symptômes persistent.',
      ],
    },
  },
  'YEAST-ASYMPTOMATIC': {
    color: ORANGE,
    en: {
      title: 'Yeast detected without symptoms',
      summary:
        'Yeast is a normal part of the vaginal ecosystem. Treatment is not needed if you have no symptoms.',
      path: 'Recommended action: observe only',
      bullets: [
        'No treatment is needed.',
        'Watch for symptoms (itching, clumpy discharge, burning) and retest if they appear.',
        'Maintain gentle hygiene and avoid douching or scented products.',
      ],
    },
    fr: {
      title: 'Levures détectées sans symptômes',
      summary:
        'Les levures font naturellement partie de l’écosystème vaginal. Aucun traitement n’est nécessaire en l’absence de symptômes.',
      path: 'Action recommandée : simple surveillance',
      bullets: [
        'Aucun traitement n’est nécessaire.',
        'Surveillez les symptômes (démangeaisons, pertes grumeleuses, brûlures) et refaites un test s’ils apparaissent.',
        'Maintenez une hygiène douce et évitez les douches vaginales et les produits parfumés.',
      ],
    },
  },
  'YEAST-LIKELY-ESCALATION': {
    color: RED,
    en: {
      title: 'Likely yeast profile — recurrent or persistent',
      summary:
        'Based on your test markers and reported symptoms. Symptoms lasting more than a week or recurrent yeast often need a doctor’s evaluation and sometimes a stronger or longer prescription treatment.',
      path: 'Recommended action: doctor consultation',
      bullets: [
        'Book a doctor’s appointment in the coming days.',
        'An OTC antifungal can be used while waiting, but persistent or recurrent yeast often needs prescription treatment.',
        'Bring your test results to the appointment.',
        'If recurrent, mention how often it has happened in the last 6 months.',
      ],
    },
    fr: {
      title: 'Profil probable de mycose — récidivante ou persistante',
      summary:
        'Basé sur vos marqueurs de test et les symptômes rapportés. Des symptômes durant plus d’une semaine ou des mycoses récidivantes nécessitent souvent une évaluation médicale et parfois un traitement sur ordonnance plus fort ou plus long.',
      path: 'Action recommandée : consultation médicale',
      bullets: [
        'Prenez rendez-vous chez un médecin dans les prochains jours.',
        'Un antifongique en vente libre peut être utilisé en attendant, mais une mycose persistante ou récidivante nécessite souvent un traitement sur ordonnance.',
        'Apportez vos résultats de test au rendez-vous.',
        'En cas de récidive, mentionnez la fréquence des épisodes au cours des 6 derniers mois.',
      ],
    },
  },
  'YEAST-POSSIBLE': {
    color: ORANGE,
    en: {
      title: 'Possible yeast profile',
      summary:
        'Your yeast marker is borderline. This can happen during early or healing yeast infection.',
      path: 'Recommended action: pharmacy or retest depending on symptoms',
      bullets: [
        'You can start an OTC antifungal — ask your pharmacist.',
        'If symptoms do not improve within 3 days, book a doctor’s appointment.',
      ],
      bulletsAsymptomatic: [
        'No treatment is needed.',
        'Retest in 5–7 days if symptoms appear.',
      ],
    },
    fr: {
      title: 'Profil possible de mycose',
      summary:
        'Votre marqueur de levures est limite. Cela peut arriver en début de mycose ou en phase de guérison.',
      path: 'Action recommandée : pharmacie ou nouveau test selon les symptômes',
      bullets: [
        'Vous pouvez commencer un antifongique en vente libre — demandez conseil à votre pharmacien·ne.',
        'Si les symptômes ne s’améliorent pas en 3 jours, prenez rendez-vous chez un médecin.',
      ],
      bulletsAsymptomatic: [
        'Aucun traitement n’est nécessaire.',
        'Refaites un test dans 5 à 7 jours si des symptômes apparaissent.',
      ],
    },
  },
  'YEAST-POSSIBLE-SYMPTOMS': {
    color: ORANGE,
    en: {
      title: 'Possible yeast profile',
      summary:
        'Your symptoms suggest yeast but your markers are clean. The test may have caught the infection too early.',
      path: 'Recommended action: pharmacy (OTC antifungal)',
      bullets: [
        'An OTC antifungal can be used as first-line care — ask your pharmacist.',
        'If symptoms do not improve within 3 days, book a doctor’s appointment.',
      ],
    },
    fr: {
      title: 'Profil possible de mycose',
      summary:
        'Vos symptômes évoquent une mycose, mais vos marqueurs sont normaux. Le test a peut-être été fait trop tôt.',
      path: 'Action recommandée : pharmacie (antifongique en vente libre)',
      bullets: [
        'Un antifongique en vente libre peut être utilisé en première intention — demandez conseil à votre pharmacien·ne.',
        'Si les symptômes ne s’améliorent pas en 3 jours, prenez rendez-vous chez un médecin.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.6 mixed
  // ---------------------------------------------------------------------------
  'MIXED-BV-AV': {
    color: ORANGE,
    en: {
      title: 'Mixed combination detected — please recheck (BV + AV)',
      summary:
        'Both Bacterial Vaginosis (formerly Gardnerella) and Aerobic Vaginitis markers are reading positive. This combination is biologically uncommon because BV is caused by anaerobic bacteria while AV is aerobic. Some of the test colours can be hard to tell apart, so we recommend rechecking your reading.',
      path: 'Recommended action: recheck your reading; if confirmed, consult',
      bullets: [
        'Recheck your test against the colour chart in good light.',
        'If the reading is confirmed, book a doctor’s appointment for a lab test.',
        'Do not self-treat — treating one wrong condition can make the other worse.',
      ],
    },
    fr: {
      title: 'Combinaison mixte détectée — vérifiez votre lecture (VB + VA)',
      summary:
        'Les marqueurs de vaginose bactérienne (anciennement Gardnerella) et de vaginite aérobie sont tous deux positifs. Cette combinaison est biologiquement rare, car la VB est causée par des bactéries anaérobies alors que la VA est aérobie. Certaines couleurs du test peuvent être difficiles à distinguer : nous vous recommandons de vérifier à nouveau votre lecture.',
      path: 'Action recommandée : vérifiez votre lecture ; si elle se confirme, consultez',
      bullets: [
        'Vérifiez à nouveau votre test avec le nuancier, sous un bon éclairage.',
        'Si la lecture se confirme, prenez rendez-vous chez un médecin pour une analyse en laboratoire.',
        'Ne vous traitez pas vous-même — traiter la mauvaise affection peut aggraver l’autre.',
      ],
    },
  },
  'MIXED-BV-YEAST': {
    color: ORANGE,
    en: {
      title: 'Mixed combination detected — please recheck (BV + Yeast)',
      summary:
        'Both Bacterial Vaginosis (formerly Gardnerella) and yeast markers are reading positive. This combination is biologically uncommon because BV thrives at high pH while yeast thrives at acidic pH. Some test colours can be hard to differentiate — we recommend rechecking your reading.',
      path: 'Recommended action: recheck your reading; if confirmed, consult',
      bullets: [
        'Recheck your test against the colour chart in good light.',
        'If the reading is confirmed, book a doctor’s appointment for a lab test.',
        'Do not self-treat — using an OTC antifungal alone will not treat any BV side and vice versa.',
      ],
    },
    fr: {
      title: 'Combinaison mixte détectée — vérifiez votre lecture (VB + mycose)',
      summary:
        'Les marqueurs de vaginose bactérienne (anciennement Gardnerella) et de levures sont tous deux positifs. Cette combinaison est biologiquement rare, car la VB se développe à pH élevé alors que les levures préfèrent un pH acide. Certaines couleurs du test peuvent être difficiles à différencier — nous vous recommandons de vérifier à nouveau votre lecture.',
      path: 'Action recommandée : vérifiez votre lecture ; si elle se confirme, consultez',
      bullets: [
        'Vérifiez à nouveau votre test avec le nuancier, sous un bon éclairage.',
        'Si la lecture se confirme, prenez rendez-vous chez un médecin pour une analyse en laboratoire.',
        'Ne vous traitez pas vous-même — un antifongique seul ne traitera pas la composante VB, et inversement.',
      ],
    },
  },
  'MIXED-BV-TRICH': {
    color: RED,
    en: {
      title: 'BV and Trich markers both positive',
      summary:
        'Both Bacterial Vaginosis (formerly Gardnerella) and trichomoniasis markers are positive. Trich is a sexually transmitted infection that requires prescription treatment, so an STD screening centre is the right next step.',
      path: 'Recommended action: STD screening centre',
      bullets: [
        'Visit an STD screening centre or sexual health clinic soon.',
        'All recent sexual partners must also be treated for trich.',
        'Bring your test results to the appointment.',
        'Avoid sex until treated.',
      ],
    },
    fr: {
      title: 'Marqueurs VB et trichomonase tous deux positifs',
      summary:
        'Les marqueurs de vaginose bactérienne (anciennement Gardnerella) et de trichomonase sont tous deux positifs. La trichomonase est une infection sexuellement transmissible qui nécessite un traitement sur ordonnance : un centre de dépistage des IST est la bonne prochaine étape.',
      path: 'Action recommandée : centre de dépistage des IST',
      bullets: [
        'Rendez-vous prochainement dans un centre de dépistage des IST ou une clinique de santé sexuelle.',
        'Tous les partenaires sexuels récents doivent aussi être traités pour la trichomonase.',
        'Apportez vos résultats de test au rendez-vous.',
        'Évitez les rapports sexuels jusqu’au traitement.',
      ],
    },
  },
  'MIXED-AV-YEAST': {
    color: ORANGE,
    en: {
      title: 'Mixed combination detected — please recheck (AV + Yeast)',
      summary:
        'Both Aerobic Vaginitis and yeast markers are reading positive. This combination is uncommon. Some test colours can be hard to differentiate — we recommend rechecking your reading.',
      path: 'Recommended action: recheck your reading; if confirmed, consult',
      bullets: [
        'Recheck your test against the colour chart in good light.',
        'If the reading is confirmed, book a doctor’s appointment for a lab test.',
        'Do not self-treat.',
      ],
    },
    fr: {
      title: 'Combinaison mixte détectée — vérifiez votre lecture (VA + mycose)',
      summary:
        'Les marqueurs de vaginite aérobie et de levures sont tous deux positifs. Cette combinaison est rare. Certaines couleurs du test peuvent être difficiles à différencier — nous vous recommandons de vérifier à nouveau votre lecture.',
      path: 'Action recommandée : vérifiez votre lecture ; si elle se confirme, consultez',
      bullets: [
        'Vérifiez à nouveau votre test avec le nuancier, sous un bon éclairage.',
        'Si la lecture se confirme, prenez rendez-vous chez un médecin pour une analyse en laboratoire.',
        'Ne vous traitez pas vous-même.',
      ],
    },
  },
  'MIXED-AV-TRICH': {
    color: RED,
    en: {
      title: 'AV and Trich markers both positive',
      summary:
        'Both Aerobic Vaginitis and trichomoniasis markers are positive. Trich is a sexually transmitted infection that needs prescription treatment.',
      path: 'Recommended action: STD screening centre',
      bullets: [
        'Visit an STD screening centre or sexual health clinic soon.',
        'All recent sexual partners must also be treated for trich.',
        'Bring your test results to the appointment.',
        'Avoid sex until treated.',
      ],
    },
    fr: {
      title: 'Marqueurs VA et trichomonase tous deux positifs',
      summary:
        'Les marqueurs de vaginite aérobie et de trichomonase sont tous deux positifs. La trichomonase est une infection sexuellement transmissible qui nécessite un traitement sur ordonnance.',
      path: 'Action recommandée : centre de dépistage des IST',
      bullets: [
        'Rendez-vous prochainement dans un centre de dépistage des IST ou une clinique de santé sexuelle.',
        'Tous les partenaires sexuels récents doivent aussi être traités pour la trichomonase.',
        'Apportez vos résultats de test au rendez-vous.',
        'Évitez les rapports sexuels jusqu’au traitement.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.7 possible
  // ---------------------------------------------------------------------------
  'POSSIBLE-MIXED': {
    color: ORANGE,
    en: {
      title: 'Possible mixed profile',
      summary:
        'More than one marker is borderline. This pattern can occur during early or healing stages of an infection, or after recent sex, douching, or cycle events.',
      path: 'Recommended action: retest or doctor consultation',
      bullets: [
        'Retest in 5–7 days, avoiding sex, douching, and scented products beforehand.',
        'If symptoms appear or worsen, book a doctor’s appointment without waiting.',
      ],
    },
    fr: {
      title: 'Profil possible mixte',
      summary:
        'Plusieurs marqueurs sont limites. Ce schéma peut survenir en début ou en phase de guérison d’une infection, ou après des rapports récents, des douches vaginales ou des événements du cycle.',
      path: 'Action recommandée : nouveau test ou consultation médicale',
      bullets: [
        'Refaites un test dans 5 à 7 jours, en évitant au préalable les rapports sexuels, les douches vaginales et les produits parfumés.',
        'Si des symptômes apparaissent ou s’aggravent, prenez rendez-vous chez un médecin sans attendre.',
      ],
    },
  },
  'POSSIBLE-IRRITATION': {
    color: ORANGE,
    en: {
      title: 'Possible irritation profile',
      summary:
        'Your itching with no infection markers and recent use of scented or harsh products suggests irritation rather than infection.',
      path: 'Recommended action: self-care',
      bullets: [
        'Pause all scented soaps, wipes, douches, and intimate hygiene products.',
        'Wear breathable cotton underwear.',
        'Symptoms should improve within a few days. If they don’t, retest or see a clinician.',
      ],
    },
    fr: {
      title: 'Profil possible d’irritation',
      summary:
        'Vos démangeaisons sans marqueur d’infection, associées à l’utilisation récente de produits parfumés ou agressifs, évoquent une irritation plutôt qu’une infection.',
      path: 'Action recommandée : auto-soins',
      bullets: [
        'Suspendez tous les savons parfumés, lingettes, douches vaginales et produits d’hygiène intime.',
        'Portez des sous-vêtements en coton respirant.',
        'Les symptômes devraient s’améliorer en quelques jours. Sinon, refaites un test ou consultez un professionnel de santé.',
      ],
    },
  },
  'POSSIBLE-SYMPTOMATIC-LE': {
    color: ORANGE,
    en: {
      title: 'Inflammation detected — possible STI',
      summary:
        'Inflammation is present without a specific BV / AV / yeast / trich pattern. High leucocytes can indicate chlamydia or another sexually transmitted infection that the home test cannot detect.',
      path: 'Recommended action: STD screening centre',
      bullets: [
        'Visit an STD screening centre or sexual health clinic — chlamydia and other STDs are common causes.',
        'Avoid sex until evaluated.',
        'Retest in 5–7 days if no STI is found and symptoms continue.',
      ],
    },
    fr: {
      title: 'Inflammation détectée — IST possible',
      summary:
        'Une inflammation est présente sans schéma spécifique de VB / VA / mycose / trichomonase. Des leucocytes élevés peuvent indiquer une chlamydia ou une autre infection sexuellement transmissible que le test à domicile ne peut pas détecter.',
      path: 'Action recommandée : centre de dépistage des IST',
      bullets: [
        'Rendez-vous dans un centre de dépistage des IST ou une clinique de santé sexuelle — la chlamydia et d’autres IST en sont des causes fréquentes.',
        'Évitez les rapports sexuels jusqu’à l’évaluation.',
        'Refaites un test dans 5 à 7 jours si aucune IST n’est trouvée et que les symptômes persistent.',
      ],
    },
  },
  'POSSIBLE-LE-ALONE': {
    color: ORANGE,
    en: {
      title: 'Inflammation detected without symptoms',
      summary:
        'Your test shows inflammation without a specific infection pattern. Asymptomatic inflammation can indicate a silent infection such as chlamydia.',
      path: 'Recommended action: STD screening or retest',
      bullets: [
        'Consider STD screening — chlamydia is often silent and is the most common cause of high leucocytes without other markers.',
        'Retest in 5–7 days.',
        'Consult if symptoms develop.',
      ],
    },
    fr: {
      title: 'Inflammation détectée sans symptômes',
      summary:
        'Votre test montre une inflammation sans schéma d’infection spécifique. Une inflammation asymptomatique peut indiquer une infection silencieuse comme la chlamydia.',
      path: 'Action recommandée : dépistage des IST ou nouveau test',
      bullets: [
        'Envisagez un dépistage des IST — la chlamydia est souvent silencieuse et constitue la cause la plus fréquente de leucocytes élevés sans autres marqueurs.',
        'Refaites un test dans 5 à 7 jours.',
        'Consultez si des symptômes apparaissent.',
      ],
    },
  },
  'POSSIBLE-GENERIC': {
    color: ORANGE,
    en: {
      title: 'Possible symptomatic profile',
      summary: 'You have symptoms but no specific infection pattern in your test.',
      path: 'Recommended action: self-care + follow-up',
      bullets: [
        'Avoid irritant products and douching.',
        'Retest in 5–7 days if symptoms persist.',
        'If symptoms worsen, book a doctor’s appointment.',
      ],
    },
    fr: {
      title: 'Profil possible avec symptômes',
      summary:
        'Vous avez des symptômes, mais votre test ne montre aucun schéma d’infection spécifique.',
      path: 'Action recommandée : auto-soins + suivi',
      bullets: [
        'Évitez les produits irritants et les douches vaginales.',
        'Refaites un test dans 5 à 7 jours si les symptômes persistent.',
        'Si les symptômes s’aggravent, prenez rendez-vous chez un médecin.',
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // C.8 balance
  // ---------------------------------------------------------------------------
  'BALANCE-HEALTHY': {
    color: GREEN,
    en: {
      title: 'Healthy balance profile',
      summary: 'No warning signals detected.',
      path: 'Recommended action: maintenance',
      bullets: [
        'Continue your maintenance routine: gentle hygiene, no douching, no scented products inside the vagina.',
        'Retest if new symptoms appear.',
      ],
    },
    fr: {
      title: 'Profil d’équilibre sain',
      summary: 'Aucun signal d’alerte détecté.',
      path: 'Action recommandée : maintenance',
      bullets: [
        'Continuez votre routine de maintenance : hygiène douce, pas de douche vaginale, pas de produits parfumés à l’intérieur du vagin.',
        'Refaites un test si de nouveaux symptômes apparaissent.',
      ],
    },
  },
  'BALANCE-IMBALANCE-H2O2': {
    color: GREEN,
    en: {
      title: 'Possible mild imbalance profile',
      summary:
        'Your good bacteria appear lower than ideal, though no infection markers are positive. Supporting lactobacilli now may help prevent future infections.',
      path: 'Recommended action: maintenance',
      bullets: [
        'Continue gentle hygiene and avoid douching or scented products.',
        `Consider a vaginal probiotic with strains that have level-1 evidence: ${PROBIOTIC_STRAINS_EN}. Daily oral use has shown over 50% reduction in infection recurrence; weekly vaginal use up to 79%.`,
        'Ask your pharmacist for a product containing these specific strains with enteric coating for oral forms.',
        'Retest if symptoms appear.',
      ],
    },
    fr: {
      title: 'Profil possible de léger déséquilibre',
      summary:
        'Vos bonnes bactéries semblent plus basses que l’idéal, bien qu’aucun marqueur d’infection ne soit positif. Soutenir les lactobacilles dès maintenant peut aider à prévenir de futures infections.',
      path: 'Action recommandée : maintenance',
      bullets: [
        'Continuez une hygiène douce et évitez les douches vaginales et les produits parfumés.',
        `Envisagez un probiotique vaginal avec des souches disposant de preuves de niveau 1 : ${PROBIOTIC_STRAINS_FR}. La prise orale quotidienne a montré plus de 50 % de réduction des récidives d’infection ; l’usage vaginal hebdomadaire jusqu’à 79 %.`,
        'Demandez à votre pharmacien·ne un produit contenant ces souches spécifiques, avec enrobage gastro-résistant pour les formes orales.',
        'Refaites un test si des symptômes apparaissent.',
      ],
    },
  },
  'BALANCE-IMBALANCE-PH': {
    color: GREEN,
    en: {
      title: 'Possible mild imbalance profile',
      summary:
        'Your pH is slightly above the healthy range, but no specific infection markers are positive. Recent sex, the end of a period, or hygiene products can cause transient shifts.',
      path: 'Recommended action: maintenance',
      bullets: [
        'Retest in 3–5 days, avoiding sex, douching, and scented products beforehand.',
        `Consider a vaginal probiotic with ${PROBIOTIC_STRAINS_EN}.`,
        'Retest if symptoms appear.',
      ],
    },
    fr: {
      title: 'Profil possible de léger déséquilibre',
      summary:
        'Votre pH est légèrement au-dessus de la plage saine, mais aucun marqueur d’infection spécifique n’est positif. Des rapports récents, la fin des règles ou des produits d’hygiène peuvent provoquer des variations passagères.',
      path: 'Action recommandée : maintenance',
      bullets: [
        'Refaites un test dans 3 à 5 jours, en évitant au préalable les rapports sexuels, les douches vaginales et les produits parfumés.',
        `Envisagez un probiotique vaginal avec ${PROBIOTIC_STRAINS_FR}.`,
        'Refaites un test si des symptômes apparaissent.',
      ],
    },
  },
  'BALANCE-IMBALANCE-PHHIGH': {
    color: GREEN,
    en: {
      title: 'Possible mild imbalance profile — please retest',
      summary:
        'Your pH is elevated but no specific markers are positive. This is unusual — either the test caught a very early infection, or the pH reading is affected by recent events.',
      path: 'Recommended action: maintenance',
      bullets: [
        'Retest in 3–5 days to confirm.',
        'Avoid douching, scented products, and unprotected sex before retesting.',
        'Book a doctor’s appointment if results stay elevated or symptoms develop.',
      ],
    },
    fr: {
      title: 'Profil possible de léger déséquilibre — refaites un test',
      summary:
        'Votre pH est élevé, mais aucun marqueur spécifique n’est positif. C’est inhabituel — soit le test a détecté une infection très précoce, soit la lecture du pH est influencée par des événements récents.',
      path: 'Action recommandée : maintenance',
      bullets: [
        'Refaites un test dans 3 à 5 jours pour confirmer.',
        'Évitez les douches vaginales, les produits parfumés et les rapports non protégés avant de refaire le test.',
        'Prenez rendez-vous chez un médecin si les résultats restent élevés ou si des symptômes apparaissent.',
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Modifier texts (Section D + F5/F13)
// ---------------------------------------------------------------------------

export const MODIFIER_TEXTS: Record<ModifierId, { en: string; fr: string }> = {
  'Q5-RECURRENT': {
    en: 'Recurrent symptoms often need a doctor’s evaluation — a longer or alternative treatment may be required.',
    fr: 'Des symptômes récidivants nécessitent souvent une évaluation médicale — un traitement plus long ou différent peut être nécessaire.',
  },
  'Q5-ANTIBIOTICS': {
    en: 'Recent antibiotics often disrupt healthy bacteria — yeast or imbalance is common after antibiotic use.',
    fr: 'Les antibiotiques récents perturbent souvent les bonnes bactéries — une mycose ou un déséquilibre est fréquent après une prise d’antibiotiques.',
  },
  'Q5-UNPROTECTED-SEX': {
    en: 'New, multiple, or non-monogamous partners increase the risk of sexually transmitted infection. STD screening is recommended.',
    fr: 'Des partenaires nouveaux, multiples ou non monogames augmentent le risque d’infection sexuellement transmissible. Un dépistage des IST est recommandé.',
  },
  'Q5-HYGIENE': {
    en: 'These products often disrupt the natural vaginal balance — pausing them is the first step.',
    fr: 'Ces produits perturbent souvent l’équilibre vaginal naturel — les suspendre est la première étape.',
  },
  'Q5-SWIMSUIT': {
    en: 'Damp, warm conditions favour yeast and other bacteria.',
    fr: 'Les environnements chauds et humides favorisent les levures et d’autres bactéries.',
  },
  'Q5-TRAVEL': {
    en: 'Travel and routine changes often trigger temporary imbalance.',
    fr: 'Les voyages et les changements de routine déclenchent souvent un déséquilibre temporaire.',
  },
  'Q2-PERSISTENT-4-7': {
    en: 'Symptoms persisting for several days warrant closer monitoring.',
    fr: 'Des symptômes qui persistent plusieurs jours méritent une surveillance plus attentive.',
  },
  'Q2-PERSISTENT-WEEK': {
    en: 'Symptoms lasting more than a week should be evaluated by a clinician.',
    fr: 'Des symptômes qui durent plus d’une semaine doivent être évalués par un professionnel de santé.',
  },
  'Q6-AFTER-PERIOD': {
    en: 'Test results just after period can be less reliable — retest in a week if results are borderline.',
    fr: 'Les résultats de test juste après les règles peuvent être moins fiables — refaites un test dans une semaine si les résultats sont limites.',
  },
  'Q6-BEFORE-PERIOD': {
    en: 'Hormonal changes before your period can shift discharge — retest after your period if results are unclear.',
    fr: 'Les changements hormonaux avant les règles peuvent modifier les pertes — refaites un test après vos règles si les résultats ne sont pas clairs.',
  },
  'Q7-PREGNANT': {
    en: 'You’re pregnant — discuss any treatment with your obstetrician or midwife before starting it.',
    fr: 'Vous êtes enceinte — discutez de tout traitement avec votre obstétricien·ne ou votre sage-femme avant de le commencer.',
  },
  'Q7-NOT-SURE': {
    en: 'If there’s a chance you may be pregnant, take a pregnancy test before starting any treatment.',
    fr: 'S’il existe une possibilité que vous soyez enceinte, faites un test de grossesse avant de commencer tout traitement.',
  },
  'F5-SPOTTING': {
    en: 'Spotting around your period is common; if it persists, consult.',
    fr: 'Des saignements légers autour des règles sont fréquents ; s’ils persistent, consultez.',
  },
  'F13-RECURRENCE-TRACKING': {
    en: 'Worth tracking with regular testing if recurrence continues.',
    fr: 'À suivre avec des tests réguliers si les récidives continuent.',
  },
};

// ---------------------------------------------------------------------------
// buildCard
// ---------------------------------------------------------------------------

export function buildCard(result: DiagnosticResult, lang: string): RenderedCard {
  const def = CARDS[result.variant];
  const content = lang === 'fr' ? def.fr : def.en;

  const bullets =
    result.variant === 'YEAST-POSSIBLE' && !result.symptomatic && content.bulletsAsymptomatic
      ? content.bulletsAsymptomatic
      : content.bullets;

  const notes = result.modifiers.map((id) =>
    lang === 'fr' ? MODIFIER_TEXTS[id].fr : MODIFIER_TEXTS[id].en
  );

  return {
    profileKey: result.card,
    variant: result.variant,
    title: content.title,
    summary: content.summary,
    path: content.path,
    bullets,
    notes,
    color: def.color,
  };
}
