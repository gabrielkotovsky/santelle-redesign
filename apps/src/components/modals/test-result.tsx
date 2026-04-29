// src/components/modals/test-result.tsx
import { getArticleBySlug, listArticles, type Article } from '@/src/features/articles/articles.api';
import { Colors } from '@/src/theme/colors';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { XIcon } from '../icons/svg/XIcon';
import { ScreenBackground } from '../layout/ScreenBackground';
import { ArticleModal } from './article-modal';
import AskSantelleModal from './ask-santelle-modal';
import ChatbotModal from './chatbot-modal';
import { getBiomarkerDescription, getBiomarkerStatus, getPHStatus } from './biomarker-utils';
import { supabase } from '@/src/services/supabase';
import { useTranslations } from '@/src/i18n/useTranslations';

const SYMPTOM_GROUPING_RULES = [
  { title: 'Pain & irritation', match: /(itch|burn|pain|irrit)/i },
  { title: 'Timeline', match: /(day|week|month|ago|today|yesterday)/i },
  { title: 'Discharge', match: /discharge|fluid/i },
  { title: 'Smell', match: /smell|odor/i },
  { title: 'Other', match: /.*/ },
] as const;

function groupSymptomLabels(labels: string[]) {
  const groups: Record<string, string[]> = {};
  labels.forEach((label) => {
    const rule =
      SYMPTOM_GROUPING_RULES.find((r) => r.match.test(label)) ??
      SYMPTOM_GROUPING_RULES[SYMPTOM_GROUPING_RULES.length - 1];
    (groups[rule.title] ??= []).push(label);
  });
  return groups;
}

type SymptomSupport = {
  yeast: number;
  bv: number;
  trich: number;
  av: number;
  irritation: number;
};

function getSymptomSupport(labels: string[]): SymptomSupport {
  const text = labels.join(' ').toLowerCase();
  const countMatches = (terms: string[]) =>
    terms.reduce((sum, term) => sum + (text.includes(term) ? 1 : 0), 0);

  return {
    yeast: countMatches([
      'itch',
      'itching',
      'demange',
      'mycose',
      'yeast',
      'thick',
      'clumpy',
      'cottage',
      'white discharge',
      'pertes blanches',
    ]),
    bv: countMatches([
      'fishy',
      'odor',
      'odeur',
      'grey',
      'gray',
      'thin discharge',
      'vb',
      'bv',
      'vaginosis',
    ]),
    trich: countMatches([
      'frothy',
      'trich',
      'trichomon',
      'sti',
      'ist',
      'partner',
      'new partner',
    ]),
    av: countMatches([
      'burn',
      'burning',
      'brul',
      'inflammation',
      'redness',
      'douleur',
      'pain',
      'yellow discharge',
      'pertes jaunes',
    ]),
    irritation: countMatches([
      'irrit',
      'burn',
      'burning',
      'brul',
      'itch',
      'itching',
      'demange',
      'soap',
      'savon',
      'douche',
      'lingette',
      'parfum',
      'lubricant',
      'lubrifiant',
    ]),
  };
}

type Props = {
  visible: boolean;
  onClose: () => void;
  log?: {
    id: string;
    test_session_id?: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
    created_at?: string;
    analysis?: string | null;
  } | null;
};

type PretestEntry = {
  question_prompt: string;
  selected_labels: string[];
  type: 'symptoms' | 'context';
};

type IndicativeCard = {
  profileKey: 'bv' | 'av' | 'trich' | 'yeast' | 'possible' | 'balance';
  title: string;
  summary: string;
  path: string;
  bullets: string[];
  color: string;
};

type RecommendedArticleLink = {
  key: string;
  title: string;
  slugs: string[];
};

function getIndicativeCard(log: NonNullable<Props['log']>, isFr: boolean, symptomLabels: string[] = []): IndicativeCard {
  const pH = typeof log.ph === 'number' ? log.ph : null;
  const sna = (log.sna ?? '').replace('−', '-').trim();
  const betaG = (log.beta_g ?? '').replace('−', '-').trim();
  const nag = (log.nag ?? '').replace('−', '-').trim();
  const le = (log.le ?? '').replace('−', '-').trim();
  const h2o2 = (log.h2o2 ?? '').replace('−', '-').trim();

  const highPH = typeof pH === 'number' && pH >= 4.8;
  const healthyPH = typeof pH === 'number' && pH >= 3.8 && pH <= 4.4;
  const leStrong = le === '+' || le === '++' || le === '+++';
  const support = getSymptomSupport(symptomLabels);
  const hasSymptomInput = symptomLabels.length > 0;
  const symptomText = symptomLabels.join(' ').toLowerCase();
  const hasAny = (terms: string[]) => terms.some((term) => symptomText.includes(term));
  const escalationFlags =
    hasAny(['severe', 'intense', 'worst', 'fever', 'fievre', 'fièvre']) ||
    hasAny(['persistent', 'persist', 'continues', 'still', 'week', 'semaine']) ||
    hasAny(['recurrent', 'again', 'returns', 'every month', 'revient', 'récurrent']) ||
    hasAny(['pregnan', 'enceinte']) ||
    hasAny(['no improvement', 'not improving', 'pas mieux', 'sans amélioration']);

  const consultationOnlyPath = isFr
    ? 'Action recommandée: consultation'
    : 'Recommended action: consultation';
  const pharmacyOrConsultPath = isFr
    ? 'Action recommandée: pharmacie ou consultation'
    : 'Recommended action: pharmacy care or consultation';

  // Doctor-soon patterns
  if (sna === '+' || betaG === '+' || (nag === '+' && highPH)) {
    const likelyKey: 'bv' | 'av' | 'trich' =
      sna === '+' ? 'bv' : betaG === '+' ? 'av' : 'trich';
    const likelyStrength = likelyKey === 'bv' ? support.bv > 0 : likelyKey === 'av' ? support.av > 0 : support.trich > 0;
    const likelyTitle =
      likelyKey === 'bv'
        ? isFr
          ? likelyStrength ? 'Profil probable de vaginose bacterienne (VB)' : 'Profil possible de vaginose bacterienne (VB)'
          : likelyStrength ? 'Likely bacterial vaginosis (BV) profile' : 'Possible bacterial vaginosis (BV) profile'
        : likelyKey === 'av'
          ? isFr
            ? likelyStrength ? 'Profil probable de VA' : 'Profil possible de VA'
            : likelyStrength ? 'Likely AV profile' : 'Possible AV profile'
          : isFr
            ? likelyStrength ? 'Profil probable de trichomonase' : 'Profil possible de trichomonase'
            : likelyStrength ? 'Likely trichomoniasis profile' : 'Possible trichomoniasis profile';

    const isConsultOnly = likelyKey === 'av' || likelyKey === 'trich';

    return {
      profileKey: likelyKey,
      title: likelyTitle,
      summary: isFr
        ? hasSymptomInput ? 'Basé sur vos biomarqueurs et vos symptômes.' : 'Basé sur vos biomarqueurs.'
        : hasSymptomInput ? 'Based on your test markers and reported symptoms.' : 'Based on your test markers.',
      path: isConsultOnly ? consultationOnlyPath : pharmacyOrConsultPath,
      bullets: isFr
        ? isConsultOnly
          ? [
              'Prévoyez une consultation rapidement.',
              'Notez vos symptômes clés pour la consultation.',
              'Évitez les produits irritants en attendant.',
            ]
          : escalationFlags
            ? [
                'Une consultation est préférable dans votre situation.',
                'La pharmacie peut aider en attendant si nécessaire.',
                'Refaites un test si les symptômes évoluent.',
              ]
            : [
                'Commencez par un conseil en pharmacie.',
                'Consultez si les symptômes persistent ou s’aggravent.',
                'Refaites un test dans quelques jours.',
              ]
        : isConsultOnly
          ? [
              'Schedule a consultation soon.',
              'Track key symptoms for the consultation.',
              'Avoid irritant products in the meantime.',
            ]
          : escalationFlags
            ? [
                'Consultation is preferred in your situation.',
                'Pharmacy care can help while waiting, if needed.',
                'Retest if symptoms change.',
              ]
            : [
                'Start with pharmacy guidance.',
                'Consult if symptoms persist or worsen.',
                'Retest in a few days.',
              ],
      color: '#F44336',
    };
  }

  // Pharmacy optional / moderate patterns
  if (sna === '±' || betaG === '±' || nag === '±' || leStrong || (nag === '+' && typeof pH === 'number' && pH <= 4.6)) {
    const scores = {
      bv: (sna === '±' ? 3 : 0) + support.bv,
      av: (betaG === '±' ? 3 : 0) + support.av,
      trich:
        (nag === '±' && typeof pH === 'number' && pH >= 4.8 ? 3 : 0) +
        (nag === '±' && (typeof pH !== 'number' || (pH > 4.6 && pH < 4.8)) ? 1 : 0) +
        support.trich,
      yeast:
        (nag === '±' && typeof pH === 'number' && pH <= 4.6 ? 3 : 0) +
        (nag === '+' && typeof pH === 'number' && pH <= 4.6 ? 3 : 0) +
        (nag === '±' && (typeof pH !== 'number' || (pH > 4.6 && pH < 4.8)) ? 1 : 0) +
        support.yeast,
      irritation: (leStrong ? 2 : 0) + support.irritation,
    };

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topScore = ranked[0]?.[1] ?? 0;
    const topFamilies = ranked.filter(([, score]) => score === topScore).map(([family]) => family);
    const isMixed = topFamilies.length > 1 || topScore <= 1;
    const family = (isMixed ? 'possible' : topFamilies[0]) as 'bv' | 'av' | 'trich' | 'yeast' | 'irritation' | 'possible';

    const likelyModerateTitle =
      family === 'bv'
        ? isFr
          ? (support.bv > 0 ? 'Profil probable de vaginose bacterienne (VB)' : 'Profil possible de vaginose bacterienne (VB)')
          : (support.bv > 0 ? 'Likely bacterial vaginosis (BV) profile' : 'Possible bacterial vaginosis (BV) profile')
        : family === 'av'
          ? isFr ? (support.av > 0 ? 'Profil probable de VA' : 'Profil possible de VA') : (support.av > 0 ? 'Likely AV profile' : 'Possible AV profile')
          : family === 'trich'
            ? isFr ? (support.trich > 0 ? 'Profil probable de trichomonase' : 'Profil possible de trichomonase') : (support.trich > 0 ? 'Likely trichomoniasis profile' : 'Possible trichomoniasis profile')
            : family === 'yeast'
              ? isFr ? (support.yeast > 0 ? 'Profil probable de mycose' : 'Profil possible de mycose') : (support.yeast > 0 ? 'Likely yeast profile' : 'Possible yeast profile')
              : family === 'irritation'
                ? isFr ? 'Profil possible d’irritation' : 'Possible irritation profile'
                : isFr ? 'Profil possible mixte' : 'Possible mixed profile';

    const isConsultOnly = family === 'av' || family === 'trich';
    const moderateBullets = isFr
      ? isConsultOnly
        ? [
            'Une consultation est recommandée.',
            'Notez vos symptômes clés.',
            'Refaites un test selon l’avis médical.',
          ]
        : family === 'yeast'
          ? escalationFlags
            ? [
                'Une consultation est préférable dans votre situation.',
                'Un antifongique OTC peut aider en attendant.',
                'Refaites un test si les symptômes persistent.',
              ]
            : [
                'Commencez par un antifongique OTC si besoin.',
                'Demandez conseil en pharmacie.',
                'Refaites un test dans 5 à 7 jours.',
              ]
          : [
              'Commencez par des mesures simples (hygiène douce).',
              'Demandez conseil en pharmacie.',
              'Consultez si les symptômes persistent ou s’aggravent.',
            ]
      : isConsultOnly
        ? [
            'Consultation is recommended.',
            'Track key symptoms.',
            'Retest as advised by your clinician.',
          ]
        : family === 'yeast'
          ? escalationFlags
            ? [
                'Consultation is preferred in your situation.',
                'OTC antifungal care can help while waiting.',
                'Retest if symptoms persist.',
              ]
            : [
                'Start with OTC antifungal care if needed.',
                'Ask for pharmacy guidance.',
                'Retest in 5 to 7 days.',
              ]
          : [
              'Start with simple care (gentle hygiene).',
              'Use pharmacy guidance.',
              'Consult if symptoms persist or worsen.',
            ];
    return {
      profileKey: family === 'bv' || family === 'av' || family === 'trich' || family === 'yeast' ? family : 'possible',
      title: likelyModerateTitle,
      summary: isFr
        ? hasSymptomInput ? 'Basé sur vos biomarqueurs et vos symptômes.' : 'Résultat à confirmer.'
        : hasSymptomInput ? 'Based on your test markers and reported symptoms.' : 'Result needs confirmation.',
      path: isConsultOnly ? consultationOnlyPath : pharmacyOrConsultPath,
      bullets: moderateBullets,
      color: '#FF9800',
    };
  }

  // Maintenance path
  const allResultsNormal =
    healthyPH &&
    h2o2 === '-' &&
    sna === '-' &&
    betaG === '-' &&
    nag === '-' &&
    le === '-';

  if (allResultsNormal && symptomLabels.length > 0) {
    const yeastSymptomsPresent = support.yeast > 0;
    const irritationOnly = support.irritation > 0 && support.yeast === 0 && support.bv === 0 && support.trich === 0 && support.av === 0;
    return {
      profileKey: yeastSymptomsPresent ? 'yeast' : 'possible',
      title: yeastSymptomsPresent
        ? (isFr ? 'Profil probable de mycose' : 'Likely yeast profile')
        : irritationOnly
          ? (isFr ? 'Profil possible d’irritation' : 'Possible irritation profile')
          : (isFr ? 'Profil possible avec symptômes' : 'Possible symptomatic profile'),
      summary: isFr
        ? 'Basé sur vos biomarqueurs et vos symptômes.'
        : 'Based on your test markers and reported symptoms.',
      path: isFr
        ? (yeastSymptomsPresent ? 'Action recommandée: pharmacie ou consultation' : 'Action recommandée: auto-soins + suivi')
        : (yeastSymptomsPresent ? 'Recommended action: pharmacy care or consultation' : 'Recommended action: self-care + follow-up'),
      bullets: isFr
        ? [
            yeastSymptomsPresent
              ? 'Un antifongique OTC peut être essayé en première intention.'
              : 'Évitez les produits irritants et maintenez une hygiène douce.',
            yeastSymptomsPresent
              ? 'Demandez conseil en pharmacie si besoin.'
              : 'Un avis en pharmacie peut aider si les symptômes persistent.',
            'Refaites un test dans 5 à 7 jours, ou plus tôt en cas d’aggravation.',
          ]
        : [
            yeastSymptomsPresent
              ? 'An OTC antifungal can be used as first-line care.'
              : 'Avoid irritant products and keep gentle hygiene.',
            yeastSymptomsPresent
              ? 'Use pharmacy guidance if needed.'
              : 'Pharmacy guidance can help if symptoms persist.',
            'Retest in 5 to 7 days, or sooner if symptoms worsen.',
          ],
      color: '#FF9800',
    };
  }

  return {
    profileKey: 'balance',
    title: (healthyPH && h2o2 === '-' && sna === '-' && betaG === '-' && nag === '-') ? (isFr ? 'Profil d’équilibre sain' : 'Healthy balance profile') : (isFr ? 'Profil possible de léger déséquilibre' : 'Possible mild imbalance profile'),
    summary: isFr
      ? 'Aucun signal majeur détecté.'
      : 'No major warning signals detected.',
    path: isFr ? 'Action recommandée: maintenance' : 'Recommended action: maintenance',
    bullets: isFr
      ? [
          'Continuez votre routine de maintenance (hygiène douce, probiotiques).',
          'Aucun traitement n’est nécessaire en l’absence de symptômes.',
          'Refaites un test en cas de nouveau symptôme.',
        ]
      : [
          'Continue your maintenance routine (gentle hygiene, probiotics).',
          'No treatment is needed if you have no symptoms.',
          'Retest if new symptoms appear.',
        ],
    color: '#4CAF50',
  };
}

function getRecommendedArticleLinks(profileKey: IndicativeCard['profileKey'], isFr: boolean): RecommendedArticleLink[] {
  const balanceLinks: RecommendedArticleLink[] = [
    {
      key: 'otc-microbiome',
      title: isFr
        ? 'Produits OTC pouvant aider votre microbiome vaginal'
        : 'OTC products that can help your vaginal microbiome',
      slugs: ['otc_products_that_can_help_your_vaginal_microbiome'],
    },
  ];

  const infectionLinks: RecommendedArticleLink[] = [
    {
      key: 'bv-yeast-trich',
      title: isFr
        ? 'VB, mycose et trichomonase: comment les distinguer'
        : 'What is BV, yeast infections, and trichomoniasis?',
      slugs: ['what_is_bv_yeast_infections_and_trichomoniasis'],
    },
    {
      key: 'recurrent-infections',
      title: isFr
        ? 'Pourquoi les infections vaginales reviennent'
        : 'Why vaginal infections keep coming back',
      slugs: ['why_vaginal_infections_keep_coming_back'],
    },
  ];

  if (profileKey === 'balance') return balanceLinks;
  return infectionLinks;
}

function normalizeArticleText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function getArticlesByKnownSlugs(
  slugs: string[],
  lang: string,
  fallbackTitle?: string
): Promise<Article[]> {
  const picked: Article[] = [];
  for (const slug of slugs) {
    try {
      const article = await getArticleBySlug(slug, lang);
      if (article && !picked.some((a) => a.id === article.id)) picked.push(article);
    } catch {
      // Continue to next slug
    }
  }

  // Fallback for title/slug drift in CMS content.
  if (!picked.length && fallbackTitle) {
    try {
      const articles = await listArticles({ locale: lang, limit: 100 });
      const normalizedTarget = normalizeArticleText(fallbackTitle);
      const byTitle = articles.find((article) => {
        const normalizedArticleTitle = normalizeArticleText(article.title ?? '');
        return (
          normalizedArticleTitle === normalizedTarget ||
          normalizedArticleTitle.includes(normalizedTarget) ||
          normalizedTarget.includes(normalizedArticleTitle)
        );
      });
      if (byTitle && !picked.some((a) => a.id === byTitle.id)) picked.push(byTitle);
    } catch {
      // Keep empty result and show existing "not found" alert.
    }
  }

  return picked;
}

// Function to remove summary sentence with support for different markdown formats
function removeSummary(text: string): string {
  if (!text) return '';
  
  const lines = text.split('\n');
  const filtered = lines.filter(line => {
    const trimmed = line.trim();
    // Match various summary formats:
    // **Summary:** or **Summary**: 
    // Summary: or Summary -
    // Or any line that starts with bold summary text
    const summaryPatterns = [
      /^\*\*Summary:?\*\*/i,           // **Summary:** or **Summary**
      /^\*\*Summary:?\*\*\s+/i,        // **Summary:** with space
      /^Summary:?\s+/i,                 // Summary: or Summary
      /^\*\*Summary\*\*:?\s+/i,        // **Summary**: (colon outside bold)
    ];
    
    return !summaryPatterns.some(pattern => pattern.test(trimmed));
  });
  
  return filtered.join('\n').trim();
}

// Function to highlight medical terms in bold blue and make them clickable
function highlightMedicalTerms(text: string): string {
  if (!text) return '';
  
  const medicalTerms = [
    'bacterial vaginosis',
    'aerobic vaginosis',
    'aerobic vaginitis',
    'trichomonas',
    'trichomoniasis',
    'trich',
    'yeast',
    'BV',
    'AV',
  ];
  
  let result = text;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = [...medicalTerms].sort((a, b) => b.length - a.length);
  
  sortedTerms.forEach(term => {
    // Wrap medical terms in link syntax [term](medical://term)
    // Replace ALL occurrences of each term
    const regex = new RegExp(
      `(?<!\\[)\\b(${term})\\b(?!\\])`,
      'gi' // 'g' flag for global (all occurrences), 'i' for case insensitive
    );
    result = result.replace(regex, (match) => `[${match}](medical://${encodeURIComponent(match.toLowerCase())})`);
  });
  
  return result;
}

export default function TestLogModal({ visible, onClose, log }: Props) {
  const { t, lang } = useTranslations();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [askSantelleModalVisible, setAskSantelleModalVisible] = useState(false);
  const [chatbotModalVisible, setChatbotModalVisible] = useState(false);
  const [journalExpanded, setJournalExpanded] = useState(false);
  const [journalEntries, setJournalEntries] = useState<PretestEntry[]>([]);
  const [journalLoading, setJournalLoading] = useState(false);
  const totalInsights = journalEntries.reduce(
    (sum, entry) => sum + (entry.selected_labels?.length || 0),
    0
  );
  const symptomLabels = useMemo(
    () =>
      journalEntries
        .filter((e) => e.type === 'symptoms')
        .flatMap((entry) => entry.selected_labels ?? []),
    [journalEntries]
  );
  const groupedSymptoms = useMemo(
    () => groupSymptomLabels(symptomLabels),
    [symptomLabels]
  );
  const indicativeForRecommendations = useMemo(
    () => (log ? getIndicativeCard(log, lang === 'fr', symptomLabels) : null),
    [log, lang, symptomLabels]
  );
  const recommendedLinks = useMemo(
    () =>
      indicativeForRecommendations
        ? getRecommendedArticleLinks(indicativeForRecommendations.profileKey, lang === 'fr')
        : [],
    [indicativeForRecommendations, lang]
  );
  const contextLabels = useMemo(
    () =>
      journalEntries
        .filter((e) => e.type === 'context')
        .flatMap((entry) => entry.selected_labels ?? []),
    [journalEntries]
  );

  // Load pretest data when modal opens (similar to how biomarkers are loaded)
  useEffect(() => {
    if (!visible || !log) {
      setJournalExpanded(false);
      setJournalEntries([]);
      setJournalLoading(false);
      return;
    }

    const sessionId = log.test_session_id || log.id;
    if (!sessionId) return;

    let mounted = true;
    setJournalLoading(true);

    (async () => {
      try {
        // Fetch test_session_id if needed
        let testSessionId = log.test_session_id;
        if (!testSessionId && log.id) {
          const { data } = await supabase
            .from('test_logs')
            .select('test_session_id')
            .eq('id', log.id)
            .maybeSingle();
          testSessionId = data?.test_session_id;
        }

        if (!testSessionId || !mounted) return;

        const useFrench = lang === 'fr';
        // Fetch symptoms and context (use prompt_french / label_french when French)
        const [symptomsResult, contextResult] = await Promise.all([
          supabase
            .from("app_pretest_responses")
            .select(`
              app_pretest_questions!inner ( prompt, prompt_french, symptom_or_context ),
              app_pretest_response_choices (
                app_pretest_choices!inner ( label, label_french )
              )
            `)
            .eq("test_session_id", testSessionId)
            .eq("app_pretest_questions.symptom_or_context", "symptoms"),
          supabase
            .from("app_pretest_responses")
            .select(`
              app_pretest_questions!inner ( prompt, prompt_french, symptom_or_context ),
              app_pretest_response_choices (
                app_pretest_choices!inner ( label, label_french )
              )
            `)
            .eq("test_session_id", testSessionId)
            .eq("app_pretest_questions.symptom_or_context", "context")
        ]);

        if (!mounted) return;

        if (symptomsResult.error) throw symptomsResult.error;
        if (contextResult.error) throw contextResult.error;

        const pickPrompt = (r: any) => (useFrench && r.app_pretest_questions?.prompt_french != null ? r.app_pretest_questions.prompt_french : r.app_pretest_questions.prompt);
        const pickLabel = (c: any) => {
          const label = useFrench && c.app_pretest_choices?.label_french != null
            ? c.app_pretest_choices.label_french
            : c.app_pretest_choices.label;
          if (!useFrench) return label;
          return String(label)
            .replace(/br[uû]lures?\s+lors\s+de\s+la\s+miction/gi, 'Brûlures en urinant')
            .replace(/br[uû]lures?\s+lors\s+de\s+la\s+uriner/gi, 'Brûlures en urinant')
            .replace(/douleurs?\s+lors\s+de\s+la\s+miction/gi, 'Douleur en urinant');
        };

        const symptoms: PretestEntry[] = (symptomsResult.data ?? []).map((r: any) => ({
          question_prompt: pickPrompt(r),
          selected_labels: (r.app_pretest_response_choices ?? []).map((c: any) => pickLabel(c)),
          type: 'symptoms' as const,
        }));

        const context: PretestEntry[] = (contextResult.data ?? []).map((r: any) => ({
          question_prompt: pickPrompt(r),
          selected_labels: (r.app_pretest_response_choices ?? []).map((c: any) => pickLabel(c)),
          type: 'context' as const,
        }));

        if (mounted) {
          setJournalEntries([...symptoms, ...context]);
        }
      } catch (error) {
        console.error('Error fetching pretest data:', error);
        if (mounted) {
          Alert.alert('Error', 'Failed to load journal entry. Please try again.');
        }
      } finally {
        if (mounted) {
          setJournalLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [visible, log?.id, log?.test_session_id, lang]);

  // Load biomarkers article from same source as education when article modal opens from "Learn more" button
  useEffect(() => {
    if (!articleModalVisible || selectedArticle) return;
    let mounted = true;
    (async () => {
      try {
        const articles = await listArticles({ locale: lang, limit: 10 });
        const biomarkersArticle = articles.find((a) => a.slug === 'learn_about_biomarkers') ?? articles[0];
        if (mounted && biomarkersArticle) setSelectedArticle(biomarkersArticle);
      } catch {
        // Keep selectedArticle null to show fallback content
      }
    })();
    return () => { mounted = false; };
  }, [articleModalVisible, lang]);

  // Early return AFTER all hooks
  if (!log) return null;

  const handleRecommendedArticlePress = async (link: RecommendedArticleLink) => {
    const article = (await getArticlesByKnownSlugs(link.slugs, lang, link.title))[0];
    if (article) {
      setSelectedArticle(article);
      setArticleModalVisible(true);
      return;
    }
    Alert.alert(
      lang === 'fr' ? 'Article introuvable' : 'Article not found',
      lang === 'fr'
        ? "L'article recommandé n'est pas disponible pour le moment."
        : 'The recommended article is not available right now.'
    );
  };

  // Handle medical term clicks
  const handleMedicalTermPress = (url: string) => {
    // Extract the term from the URL (medical://term)
    const term = decodeURIComponent(url.replace('medical://', ''));
    
    // Terms that should route to the BV/yeast/trichomoniasis article
    const infectionTerms = ['bv', 'trich', 'trichomonas', 'bacterial vaginosis', 'trichomoniasis', 'yeast'];
    
    if (infectionTerms.includes(term.toLowerCase())) {
      // Handle async operation without blocking
      getArticleBySlug('what_is_bv_yeast_infections_and_trichomoniasis', lang)
        .then((article) => {
          if (article) {
            setSelectedArticle(article);
            setArticleModalVisible(true);
          } else {
            Alert.alert(
              'Article Not Found',
              'The article about infections is not available at the moment.',
              [{ text: 'OK' }]
            );
          }
        })
        .catch((error) => {
          Alert.alert(
            'Error',
            'Unable to load the article. Please try again later.',
            [{ text: 'OK' }]
          );
        });
    } else {
      // For other medical terms, show the existing alert
      Alert.alert(
        'Medical Term',
        `You clicked on: ${term}\n\nMore information coming soon!`,
        [
          { 
            text: 'OK',
            style: 'default'
          }
        ],
        { 
          cancelable: true
        }
      );
    }
    return false; // Prevent default link behavior
  };

  const toggle = (key: string) => {
    const copy = new Set(expanded);
    if (copy.has(key)) {
      copy.delete(key);
    } else {
      copy.add(key);
    }
    setExpanded(copy);
  };


  const created = log.created_at ? new Date(log.created_at) : null;
  const date = created?.toLocaleDateString();
  const time = created?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const indicative = getIndicativeCard(log, lang === 'fr', symptomLabels);

  const biomarkers = [
    ['pH', log.ph?.toString()],
    ['H₂O₂', log.h2o2],
    ['LE', log.le],
    ['SNA', log.sna],
    ['β-G', log.beta_g],
    ['NAG', log.nag],
  ] as const;


  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <ScreenBackground>
        <View style={styles.container}>
         {/* Header - Fixed Bubble */}
         <BlurView intensity={20} tint="light" style={styles.headerBubble}>
           <View style={styles.headerLeft}>
             <Text style={styles.dateText} numberOfLines={1}>{date}</Text>
           </View>

           <View style={styles.timeWrapper} pointerEvents="none">
             <Text style={styles.timeText}>{time}</Text>
           </View>

           <View style={styles.headerRight}>
             <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
               <XIcon size={30} color={Colors.light.rush} />
             </TouchableOpacity>
           </View>
         </BlurView>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Biomarker Grid */}
          {biomarkers.filter(([_, v]) => v).map(([name, value]) => {
            const status = name === 'pH'
              ? getPHStatus(Number(value), lang)
              : getBiomarkerStatus(value!, name, log.ph ?? undefined, lang);
            const isExpanded = expanded.has(name);
            const bgColor = (status?.color ?? '#000') + '30';
            const biomarkerRowStyle = [
              styles.biomarkerRow,
              isExpanded ? styles.biomarkerRowExpanded : styles.biomarkerRowCollapsed,
              { backgroundColor: bgColor }
            ];
            return (
              <View key={name} style={styles.biomarkerBlock}>
                <ShrinkableTouchable
                  style={biomarkerRowStyle as any}
                  onPress={() => toggle(name)}
                >
                  <View style={styles.leftSection}>
                    <Text style={styles.biomarkerLabel}>{name}</Text>
                    <View style={[styles.circle, { backgroundColor: status?.color }]} />
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.biomarkerValue}>{value}</Text>
                    <Text style={styles.biomarkerExpandIcon}>
                      {isExpanded ? '▲' : '▼'}
                    </Text>
                  </View>
                </ShrinkableTouchable>

                {isExpanded && (
                  <Animated.View
                  entering={FadeInUp}
                  style={[
                    styles.detailBox,
                    styles.detailBoxExpanded,
                    { backgroundColor: (status?.color ?? '#000') + '20' }
                  ]}
                >
                    {(() => {
                      const description = getBiomarkerDescription(
                        name as any,
                        String(value),
                        biomarkers.map(([n, v]) => ({ name: n, value: v || '' })),
                        lang
                      );
                      const parts = description?.split('\n\n---\n\n') || [];
                      const mainContent = parts[0];
                      const disclaimer = parts[1];
                      
                      return (
                        <>
                          {(() => {
                            const lines = mainContent?.split('\n') || [];
                            return lines.map((line, lineIndex) => {
                              if (line.trim().startsWith('* ')) {
                                // Bullet point line
                                const bulletText = line.trim().substring(2);
                                const parts = bulletText.split(/(\*\*[^*]+\*\*)/g);
                                return (
                                  <View key={lineIndex} style={styles.bulletContainer}>
                                    <Text style={styles.bulletPoint}>•</Text>
                                    <Text style={styles.bulletText}>
                                      {parts.map((part, partIndex) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                          const boldText = part.slice(2, -2);
                                          return (
                                            <Text key={partIndex} style={styles.boldText}>
                                              {boldText}
                                            </Text>
                                          );
                                        }
                                        return part;
                                      })}
                                    </Text>
                                  </View>
                                );
                              } else {
                                // Regular line
                                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                                return (
                                  <Text key={lineIndex} style={styles.detailText}>
                                    {parts.map((part, partIndex) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        const boldText = part.slice(2, -2);
                                        return (
                                          <Text key={partIndex} style={styles.boldText}>
                                            {boldText}
                                          </Text>
                                        );
                                      }
                                      return part;
                                    })}
                                    {lineIndex < lines.length - 1 && '\n'}
                                  </Text>
                                );
                              }
                            });
                          })()}
                          {disclaimer && (
                            <>
                              <View style={styles.divider} />
                              {(() => {
                                // Parse markdown links [text](url)
                                const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                                const parts: Array<{ type: 'text' | 'link'; content: string; url?: string }> = [];
                                let lastIndex = 0;
                                let match;
                                
                                while ((match = linkRegex.exec(disclaimer)) !== null) {
                                  if (match.index > lastIndex) {
                                    parts.push({ type: 'text', content: disclaimer.slice(lastIndex, match.index) });
                                  }
                                  parts.push({ type: 'link', content: match[1], url: match[2] });
                                  lastIndex = match.index + match[0].length;
                                }
                                if (lastIndex < disclaimer.length) {
                                  parts.push({ type: 'text', content: disclaimer.slice(lastIndex) });
                                }
                                
                                return (
                                  <Text style={styles.disclaimerText}>
                                    {parts.map((part, idx) => 
                                      part.type === 'link' ? (
                                        <Text
                                          key={idx}
                                          style={styles.linkText}
                                          onPress={() => part.url && Linking.openURL(part.url)}
                                        >
                                          {part.content}
                                        </Text>
                                      ) : (
                                        <Text key={idx}>{part.content}</Text>
                                      )
                                    )}
                                  </Text>
                                );
                              })()}
                            </>
                          )}
                        </>
                      );
                    })()}
                  </Animated.View>
                )}
              </View>
            );
          })}

          {/* Learn More Button */}
          <ShrinkableTouchable 
            style={styles.learnMoreButton}
            onPress={() => setArticleModalVisible(true)}
          >
            <Text style={styles.learnMoreButtonText}>{t.learnMoreAboutBiomarkers}</Text>
          </ShrinkableTouchable>

          <View style={styles.divider} />

          {/* Indicative Result */}
          <View style={styles.indicativeCard}>
            <View style={styles.indicativeHeader}>
              <Text style={styles.indicativeTitle}>{lang === 'fr' ? 'Résultat indicatif' : 'Indicative result'}</Text>
              <View style={[styles.indicativeDot, { backgroundColor: indicative.color }]} />
            </View>
            <Text style={styles.indicativeProfile}>{indicative.title}</Text>
            <Text style={styles.indicativeSummary}>{indicative.summary}</Text>
            <Text style={styles.indicativePath}>{indicative.path}</Text>
            <View style={styles.indicativeList}>
              {indicative.bullets.map((item, idx) => (
                <View key={`${idx}-${item}`} style={styles.indicativeListRow}>
                  <Text style={styles.indicativeBullet}>•</Text>
                  <Text style={styles.indicativeItem}>{item}</Text>
                </View>
              ))}
            </View>

          <View style={styles.recommendedSection}>
            <Text style={styles.recommendedTitle}>
              {lang === 'fr' ? 'Articles recommandés' : 'Recommended articles'}
            </Text>
            {recommendedLinks.map((link) => (
                <ShrinkableTouchable
                  key={link.key}
                  style={styles.recommendedItem}
                  onPress={() => {
                    void handleRecommendedArticlePress(link);
                  }}
                >
                  <Text style={styles.recommendedItemText}>{link.title}</Text>
                  <Text style={styles.recommendedChevron}>›</Text>
                </ShrinkableTouchable>
              ))}
            <Text style={styles.recommendedDisclaimer}>
              {lang === 'fr'
                ? "Ces informations sont une interprétation générale des instructions du kit et ne constituent pas un avis médical. Pour un avis médical, consultez un professionnel de santé."
                : 'This info is a general interpretation from the kit instructions and is not medical advice. For medical guidance, consult a professional.'}
            </Text>
          </View>
          </View>

          <View style={styles.divider} />

          {/* Journal Entry */}
          {(log.test_session_id || log.id) && (
            <View style={styles.journalCard}>
              <ShrinkableTouchable 
                style={styles.journalHeader}
                onPress={() => setJournalExpanded(!journalExpanded)}
              >
                <Text style={styles.journalButtonText}>
                  🔖 {t.journalEntry}
                </Text>
                <View
                  style={[
                    styles.journalRightSection,
                    journalExpanded && styles.journalRightSectionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.journalInsightsText,
                      journalExpanded && styles.journalInsightsTextActive,
                    ]}
                  >
                    {journalLoading ? '...' : totalInsights}{' '}
                    {totalInsights === 1 ? t.note : t.notes}
                  </Text>
                  <Text style={styles.journalExpandIcon}>
                    {journalExpanded ? '▲' : '▼'}
                  </Text>
                </View>
              </ShrinkableTouchable>

              {journalExpanded && (
                <Animated.View
                  entering={FadeInUp}
                  style={styles.journalContent}
                >
                  {journalLoading ? (
                    <View style={styles.journalLoadingContainer}>
                      <Text style={styles.journalLoadingText}>{t.loadingJournalEntry}</Text>
                    </View>
                  ) : (
                    <>
                      {journalEntries.length === 0 ? (
                        <Text style={styles.journalEmptyText}>{t.noJournalEntryData}</Text>
                      ) : (
                        <>
                          {symptomLabels.length > 0 && (
                            <View style={[styles.journalSection, styles.journalSectionPrimary]}>
                              <Text style={styles.journalSectionTitle}>{t.symptoms}</Text>
                              {Object.entries(groupedSymptoms).map(([groupTitle, labels]) => (
                                <View key={groupTitle} style={styles.journalSubsection}>
                                  <Text style={styles.journalSubsectionTitle}>{groupTitle}</Text>
                                  <View style={styles.journalLabels}>
                                    {labels.map((label, labelIdx) => (
                                      <View key={`symptom-${groupTitle}-${labelIdx}`} style={styles.journalLabel}>
                                        <Text style={styles.journalLabelText}>{label}</Text>
                                      </View>
                                    ))}
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}

                          {contextLabels.length > 0 && (
                            <View style={[styles.journalSection, styles.journalSectionSecondary]}>
                              <Text style={styles.journalSectionTitle}>{t.context}</Text>
                              <View style={styles.journalLabels}>
                                {contextLabels.map((label, labelIdx) => (
                                  <View key={`context-${labelIdx}`} style={styles.journalLabel}>
                                    <Text style={styles.journalLabelText}>{label}</Text>
                                  </View>
                                ))}
                              </View>
                            </View>
                          )}
                        </>
                      )}

                      <ShrinkableTouchable
                        style={styles.journalEditButton}
                        onPress={() => {
                          const sessionId = log.test_session_id || log.id;
                          if (sessionId) {
                            onClose();
                            router.push({
                              pathname: '/log-test/questionnaire' as const,
                              params: { test_session_id: sessionId, edit: 'true' }
                            });
                          }
                        }}
                      >
                        <Text style={styles.journalEditButtonText}>{t.editAnswers}</Text>
                      </ShrinkableTouchable>
                    </>
                  )}
                </Animated.View>
              )}
            </View>
          )}

        </ScrollView>
        </View>
      </ScreenBackground>

      <ArticleModal
        visible={articleModalVisible}
        onClose={() => {
          setArticleModalVisible(false);
          setSelectedArticle(null);
        }}
        title={selectedArticle?.title || t.learnBiomarkers}
        content={selectedArticle?.content_md || `### Potential Hydrogen
**pH** measures how acidic your vagina is. A healthy vagina is slightly acidic, which helps block infections. When pH rises, it usually means unwanted bacteria or parasites are taking over.

### Hydrogen Peroxide
**H₂O₂** measures the natural protection made by good bacteria (lactobacilli). If levels are low, it means those "bodyguard" bacteria aren't keeping balance as they should.

### Leukocyte Esterase 
**LE** measures white blood cell activity. These are your body's natural helpers, and higher activity can show they're responding to something.

### Sialidase
**SNA** measures an enzyme linked to bacteria that cause BV (bacterial vaginosis). Its presence can point to BV being the reason for your symptoms.

### Beta-Glucuronidase
**β-G** measures an enzyme linked to bacterial or yeast overgrowth. It highlights when "too much of the wrong microbes" are present.

### N-acetyl-β-D-glucosaminidase
**NAG** measures signs of gentle irritation in the vaginal lining, helping spot when your tissue is under stress.`}
        image={selectedArticle?.hero_image_url || require('@/assets/images/fig.png')}
        author={selectedArticle?.author}
        publishDate={selectedArticle?.published_at}
        category={selectedArticle?.category}
      />

      <AskSantelleModal
        visible={askSantelleModalVisible}
        onClose={() => setAskSantelleModalVisible(false)}
        log={log}
        onMedicalTermPress={handleMedicalTermPress}
      />

      <ChatbotModal
        visible={chatbotModalVisible}
        onClose={() => setChatbotModalVisible(false)}
        log={log}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingTop: 84, paddingBottom: 44 },
  biomarkerBlock: { marginBottom: 2 },
  biomarkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  biomarkerRowCollapsed: {
    borderColor: 'rgba(114, 20, 34, 0.08)',
  },
  biomarkerRowExpanded: {
    borderColor: 'rgba(114, 20, 34, 0.2)',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  leftSection: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  biomarkerLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 14, color: Colors.light.rush },
  biomarkerValue: { fontFamily: 'Poppins-Bold', fontSize: 14, color: Colors.light.rush },
  circle: { width: 8, height: 8, borderRadius: 4 },
  biomarkerExpandIcon: {
    fontSize: 10,
    color: Colors.light.rush,
    opacity: 0.8,
    marginLeft: 2,
  },

  detailBox: { padding: 12, marginRight: 0 },
  detailBoxExpanded: {
    borderRadius: 24,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 0,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(114, 20, 34, 0.2)',
  },
  detailText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Colors.light.rush, lineHeight: 20 },
  boldText: { fontFamily: 'Poppins-SemiBold', fontWeight: 'bold' },
  bulletContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 4 
  },
  bulletPoint: { 
    fontSize: 14, 
    color: Colors.light.rush, 
    marginRight: 8, 
    marginTop: 0 
  },
  bulletText: { 
    flex: 1, 
    fontSize: 14, 
    fontFamily: 'Poppins-Regular', 
    color: Colors.light.rush, 
    lineHeight: 20 
  },
  divider: { 
    height: 1, 
    backgroundColor: Colors.light.rush, 
    marginVertical: 20, 
    opacity: 0.3 
  },
  disclaimerText: { 
    fontSize: 12, 
    fontFamily: 'Poppins-Regular', 
    color: Colors.light.rush, 
    lineHeight: 16,
    opacity: 0.8,
    fontStyle: 'italic'
  },
  linkText: {
    color: '#2563EB',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-SemiBold',
    fontStyle: 'normal',
  },

  analysisBox: { marginTop: -10, padding: 15, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.5)' },
  analysisTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Colors.light.rush, marginBottom: 8 },
  analysisText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Colors.light.rush },

  headerBubble: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 4 : 10,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    zIndex: 1000,
  },
   header: {
     flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
     marginTop: 15,
     marginBottom: 15,
     marginHorizontal: 15,
     position: 'relative',
   },
   headerLeft: {
     flex: 1,
   },
   dateText: {
     fontFamily: 'Poppins-SemiBold',
     color: Colors.light.rush,
    fontSize: 13,
   },
  // center absolute overlay so it's perfectly centered regardless of left/right widths
  timeWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  timeText: {
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    fontSize: 13,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 34,
    height: 34,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: -12,
  },
  cancelButtonText: {
    color: '#721422',
    fontSize: 30,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  loadingAnimation: { width: 56, height: 56, marginBottom: 8 },
  loadingText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Colors.light.rush, opacity: 0.8 },
  errorText: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#D92D20' },
  learnMoreButton: {
    backgroundColor: 'rgba(114, 20, 34, 0.08)',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
    alignItems: 'center',
    marginTop: 0,
  },
  learnMoreButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  indicativeCard: {
    borderRadius: 24,
    padding: 16,
    backgroundColor: '#F5E5DA',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
    gap: 8,
  },
  indicativeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicativeTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  indicativeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  indicativeProfile: {
    fontSize: 17,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  indicativeSummary: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    lineHeight: 18,
  },
  indicativePath: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(114, 20, 34, 0.9)',
  },
  indicativeList: {
    gap: 6,
    marginTop: 2,
  },
  indicativeListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  indicativeBullet: {
    fontSize: 14,
    color: Colors.light.rush,
    marginRight: 8,
    marginTop: 1,
  },
  indicativeItem: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    lineHeight: 18,
  },
  recommendedSection: {
    marginTop: 6,
    gap: 8,
  },
  recommendedTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(114, 20, 34, 0.9)',
  },
  recommendedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  recommendedItemText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    paddingRight: 8,
  },
  recommendedChevron: {
    fontSize: 18,
    lineHeight: 18,
    color: Colors.light.rush,
    opacity: 0.7,
    marginTop: -1,
  },
  recommendedDisclaimer: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(114, 20, 34, 0.72)',
  },

  // Journal Entry styles
  journalCard: {
    marginTop: 0,
    borderRadius: 24,
    padding: 18,
    paddingVertical: 12,
    backgroundColor: '#F5E5DA',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
    gap: 8,
  },
  journalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 2,
  },
  journalButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  journalRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(114, 20, 34, 0.12)',
  },
  journalRightSectionActive: {
    backgroundColor: 'rgba(114, 20, 34, 0.12)',
  },
  journalInsightsText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(114, 20, 34, 0.9)',
  },
  journalInsightsTextActive: {
    color: '#721422',
  },
  journalExpandIcon: {
    fontSize: 12,
    color: Colors.light.rush,
    opacity: 0.8,
  },
  journalContent: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#721422',
    gap: 20,
  },
  journalLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  journalLoadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.7,
  },
  journalEmptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.7,
    textAlign: 'center',
    paddingVertical: 12,
  },
  journalSection: {
    gap: 8,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.12)',
  },
  journalSectionPrimary: {
    backgroundColor: '#F3E8D7',
  },
  journalSectionSecondary: {
    backgroundColor: '#F6EDE1',
    marginTop: 0,
  },
  journalSectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  journalSubsection: {
    marginTop: 6,
    gap: 8,
  },
  journalSubsectionTitle: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: 'rgba(114, 20, 34, 0.85)',
  },
  journalLabels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 12,
    rowGap: 12,
  },
  journalLabel: {
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  journalLabelText: {
    fontSize: 13,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
  journalEditButton: {
    marginTop: 0,
    backgroundColor: 'rgba(114, 20, 34, 0.08)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.2)',
  },
  journalEditButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },

  // Ask Santelle Button styles
  askSantelleButton: {
    borderRadius: 30,
    marginTop: 10,
    overflow: 'hidden',
  },
  askSantelleGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: .5,
    borderColor: '#000000',
    borderRadius: 30,
  },
  askSantelleButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: "#721422",
  },
  // Chatbot Button styles
  chatbotButton: {
    borderRadius: 30,
    marginTop: 10,
    backgroundColor: 'rgba(114, 20, 34, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.2)',
  },
  chatbotButtonText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: "#721422",
  },
});

const md = {
  body: {
    color: Colors.light.rush,
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    marginTop: 0,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    flexWrap: 'wrap',
    marginTop: 0,
  },
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    flexWrap: 'wrap',
  },
  heading2: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 10,
  },
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    flexWrap: 'wrap',
    marginTop: 20,
    marginBottom: 10,
  },
  strong: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: Colors.light.rush,
    flexWrap: 'wrap',
  },
  em: {
    fontStyle: 'italic',
    fontSize: 15,
    color: Colors.light.rush,
    flexWrap: 'wrap',
  },
  link: {
    color: '#4A90E2',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    textDecorationLine: 'none',
    flexWrap: 'wrap',
  },
  list_item: {
    color: Colors.light.rush,
    fontSize: 15,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    flexWrap: 'wrap',
    flex: 1,
    marginLeft: 0,
  },
  bullet_list: {
    marginLeft: -5,
    marginBottom: 10,
    marginTop: 0,
  },
  bullet_list_icon: {
    fontSize: 30,
    color: Colors.light.rush,
    marginTop: 7.5,
    marginRight: 4,
  },
  ordered_list: {
  },
  ordered_list_icon: {
    fontSize: 15,
    color: Colors.light.rush,
  },
  hr: {
    backgroundColor: Colors.light.rush,
    opacity: 0.25,
    height: 1,
    marginVertical: 10,
  },
  code_inline: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    paddingVertical: 1,
  },
} as const;