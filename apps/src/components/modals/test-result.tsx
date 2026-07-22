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
import {
  biomarkersFromLog,
  buildCard,
  mapAnswersToQuestionnaire,
  runDiagnostic,
  type CardKey,
  type RenderedCard,
} from '@/src/features/diagnostics';
import {
  GERMAN_PRETEST_CHOICES,
  GERMAN_PRETEST_QUESTIONS,
} from '@/src/features/pre-test/german';

const SYMPTOM_GROUPING_RULES = [
  { key: 'pain', match: /(itch|burn|pain|irrit|juck|brenn|schmerz|reiz)/i },
  { key: 'timeline', match: /(day|week|month|ago|today|yesterday|tag|woche|monat|heute|gestern)/i },
  { key: 'discharge', match: /discharge|fluid|ausfluss|sekret/i },
  { key: 'smell', match: /smell|odor|geruch/i },
  { key: 'other', match: /.*/ },
] as const;

function groupSymptomLabels(labels: string[], lang: string) {
  const groups: Record<string, string[]> = {};
  const titles = lang === 'de'
    ? { pain: 'Schmerzen und Reizung', timeline: 'Zeitlicher Verlauf', discharge: 'Ausfluss', smell: 'Geruch', other: 'Sonstiges' }
    : lang === 'fr'
      ? { pain: 'Douleur et irritation', timeline: 'Chronologie', discharge: 'Pertes', smell: 'Odeur', other: 'Autre' }
      : { pain: 'Pain & irritation', timeline: 'Timeline', discharge: 'Discharge', smell: 'Smell', other: 'Other' };
  labels.forEach((label) => {
    const rule =
      SYMPTOM_GROUPING_RULES.find((r) => r.match.test(label)) ??
      SYMPTOM_GROUPING_RULES[SYMPTOM_GROUPING_RULES.length - 1];
    (groups[titles[rule.key]] ??= []).push(label);
  });
  return groups;
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
  question_slug: string;
  selected_labels: string[];
  /** Raw choice values (app_pretest_choices.value) used by the diagnostic engine. */
  selected_values: string[];
  /** Raw English labels used as fallback by the diagnostic engine. */
  selected_labels_en: string[];
  type: 'symptoms' | 'context';
};

type RecommendedArticleLink = {
  key: string;
  title: string;
  slugs: string[];
};

function getRecommendedArticleLinks(profileKey: CardKey, lang: string): RecommendedArticleLink[] {
  const balanceLinks: RecommendedArticleLink[] = [
    {
      key: 'otc-microbiome',
      title: lang === 'de'
        ? 'Rezeptfreie Produkte, die Ihr vaginales Mikrobiom unterstützen können'
        : lang === 'fr'
          ? 'Produits OTC pouvant aider votre microbiome vaginal'
          : 'OTC products that can help your vaginal microbiome',
      slugs: ['otc_products_that_can_help_your_vaginal_microbiome'],
    },
  ];

  const infectionLinks: RecommendedArticleLink[] = [
    {
      key: 'bv-yeast-trich',
      title: lang === 'de'
        ? 'BV, Hefepilzinfektionen und Trichomoniasis: Was ist der Unterschied?'
        : lang === 'fr'
          ? 'VB, mycose et trichomonase: comment les distinguer'
          : 'What is BV, yeast infections, and trichomoniasis?',
      slugs: ['what_is_bv_yeast_infections_and_trichomoniasis'],
    },
    {
      key: 'recurrent-infections',
      title: lang === 'de'
        ? 'Warum vaginale Infektionen immer wiederkehren'
        : lang === 'fr'
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
    () => groupSymptomLabels(symptomLabels, lang),
    [symptomLabels, lang]
  );
  // Master diagnostic logic v3: pretest answers -> Q1-Q8 -> 4-layer engine -> card.
  const indicative = useMemo<RenderedCard | null>(() => {
    if (!log) return null;
    const answers = mapAnswersToQuestionnaire(
      journalEntries.map((entry) => ({
        questionSlug: entry.question_slug,
        values: entry.selected_values ?? [],
        labels: entry.selected_labels_en ?? [],
      }))
    );
    return buildCard(runDiagnostic(biomarkersFromLog(log), answers), lang);
  }, [log, journalEntries, lang]);
  const recommendedLinks = useMemo(
    () =>
      indicative
        ? getRecommendedArticleLinks(indicative.profileKey, lang)
        : [],
    [indicative, lang]
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
        const useGerman = lang === 'de';
        // Fetch canonical values; local German copy is keyed by stable slugs/values.
        const [symptomsResult, contextResult] = await Promise.all([
          supabase
            .from("app_pretest_responses")
            .select(`
              app_pretest_questions!inner ( slug, prompt, prompt_french, symptom_or_context ),
              app_pretest_response_choices (
                app_pretest_choices!inner ( label, label_french, value )
              )
            `)
            .eq("test_session_id", testSessionId)
            .eq("app_pretest_questions.symptom_or_context", "symptoms"),
          supabase
            .from("app_pretest_responses")
            .select(`
              app_pretest_questions!inner ( slug, prompt, prompt_french, symptom_or_context ),
              app_pretest_response_choices (
                app_pretest_choices!inner ( label, label_french, value )
              )
            `)
            .eq("test_session_id", testSessionId)
            .eq("app_pretest_questions.symptom_or_context", "context")
        ]);

        if (!mounted) return;

        if (symptomsResult.error) throw symptomsResult.error;
        if (contextResult.error) throw contextResult.error;

        const pickPrompt = (r: any) => {
          const question = r.app_pretest_questions;
          const germanPrompt = GERMAN_PRETEST_QUESTIONS[String(question?.slug ?? '')];
          if (useGerman && germanPrompt) return germanPrompt;
          return useFrench && question?.prompt_french != null
            ? question.prompt_french
            : question?.prompt;
        };
        const pickLabel = (c: any) => {
          const choice = c.app_pretest_choices;
          const label = useFrench && choice?.label_french != null
            ? choice.label_french
            : choice?.label;
          if (!useFrench) return label;
          return String(label)
            .replace(/br[uû]lures?\s+lors\s+de\s+la\s+miction/gi, 'Brûlures en urinant')
            .replace(/br[uû]lures?\s+lors\s+de\s+la\s+uriner/gi, 'Brûlures en urinant')
            .replace(/douleurs?\s+lors\s+de\s+la\s+miction/gi, 'Douleur en urinant');
        };

        const toEntry = (r: any, type: 'symptoms' | 'context'): PretestEntry => ({
          question_prompt: pickPrompt(r),
          question_slug: r.app_pretest_questions?.slug ?? '',
          selected_labels: (r.app_pretest_response_choices ?? []).map((c: any) => {
            const questionSlug = String(r.app_pretest_questions?.slug ?? '');
            const choiceValue = String(c.app_pretest_choices?.value ?? '');
            if (useGerman) {
              return GERMAN_PRETEST_CHOICES[questionSlug]?.[choiceValue]
                ?? c.app_pretest_choices?.label;
            }
            return pickLabel(c);
          }),
          selected_values: (r.app_pretest_response_choices ?? []).map(
            (c: any) => c.app_pretest_choices?.value ?? ''
          ),
          selected_labels_en: (r.app_pretest_response_choices ?? []).map(
            (c: any) => c.app_pretest_choices?.label ?? ''
          ),
          type,
        });

        const symptoms: PretestEntry[] = (symptomsResult.data ?? []).map((r: any) =>
          toEntry(r, 'symptoms')
        );

        const context: PretestEntry[] = (contextResult.data ?? []).map((r: any) =>
          toEntry(r, 'context')
        );

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
  if (!log || !indicative) return null;

  const handleRecommendedArticlePress = async (link: RecommendedArticleLink) => {
    const article = (await getArticlesByKnownSlugs(link.slugs, lang, link.title))[0];
    if (article) {
      setSelectedArticle(article);
      setArticleModalVisible(true);
      return;
    }
    Alert.alert(
      lang === 'de' ? 'Artikel nicht gefunden' : lang === 'fr' ? 'Article introuvable' : 'Article not found',
      lang === 'de'
        ? 'Der empfohlene Artikel ist derzeit nicht verfügbar.'
        : lang === 'fr'
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
              <Text style={styles.indicativeTitle}>
                {lang === 'de' ? 'Orientierendes Ergebnis' : lang === 'fr' ? 'Résultat indicatif' : 'Indicative result'}
              </Text>
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

            {indicative.notes.length > 0 && (
              <View style={styles.indicativeNotes}>
                {indicative.notes.map((note, idx) => (
                  <View key={`note-${idx}`} style={styles.indicativeListRow}>
                    <Text style={styles.indicativeNoteBullet}>›</Text>
                    <Text style={styles.indicativeNoteText}>{note}</Text>
                  </View>
                ))}
              </View>
            )}

          <View style={styles.recommendedSection}>
            <Text style={styles.recommendedTitle}>
              {lang === 'de' ? 'Empfohlene Artikel' : lang === 'fr' ? 'Articles recommandés' : 'Recommended articles'}
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
              {lang === 'de'
                ? 'Diese Informationen sind eine allgemeine Interpretation der Gebrauchsanweisung des Kits und stellen keine medizinische Beratung dar. Wenden Sie sich für medizinische Beratung an medizinisches Fachpersonal.'
                : lang === 'fr'
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
  indicativeNotes: {
    gap: 4,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(114, 20, 34, 0.25)',
  },
  indicativeNoteBullet: {
    fontSize: 13,
    color: 'rgba(114, 20, 34, 0.7)',
    marginRight: 8,
    marginTop: 1,
  },
  indicativeNoteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
    color: 'rgba(114, 20, 34, 0.75)',
    lineHeight: 17,
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