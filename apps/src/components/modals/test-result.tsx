// src/components/modals/test-result.tsx
import { getArticleBySlug } from '@/src/features/articles/articles.api';
import { Colors } from '@/src/theme/colors';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

        // Fetch symptoms and context
        const [symptomsResult, contextResult] = await Promise.all([
          supabase
            .from("app_pretest_responses")
            .select(`
              app_pretest_questions!inner ( prompt, symptom_or_context ),
              app_pretest_response_choices (
                app_pretest_choices!inner ( label )
              )
            `)
            .eq("test_session_id", testSessionId)
            .eq("app_pretest_questions.symptom_or_context", "symptoms"),
          supabase
            .from("app_pretest_responses")
            .select(`
              app_pretest_questions!inner ( prompt, symptom_or_context ),
              app_pretest_response_choices (
                app_pretest_choices!inner ( label )
              )
            `)
            .eq("test_session_id", testSessionId)
            .eq("app_pretest_questions.symptom_or_context", "context")
        ]);

        if (!mounted) return;

        if (symptomsResult.error) throw symptomsResult.error;
        if (contextResult.error) throw contextResult.error;

        const symptoms: PretestEntry[] = (symptomsResult.data ?? []).map((r: any) => ({
          question_prompt: r.app_pretest_questions.prompt,
          selected_labels: (r.app_pretest_response_choices ?? []).map(
            (c: any) => c.app_pretest_choices.label
          ),
          type: 'symptoms' as const,
        }));

        const context: PretestEntry[] = (contextResult.data ?? []).map((r: any) => ({
          question_prompt: r.app_pretest_questions.prompt,
          selected_labels: (r.app_pretest_response_choices ?? []).map(
            (c: any) => c.app_pretest_choices.label
          ),
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
  }, [visible, log?.id, log?.test_session_id]);

  // Early return AFTER all hooks
  if (!log) return null;

  // Handle medical term clicks
  const handleMedicalTermPress = (url: string) => {
    // Extract the term from the URL (medical://term)
    const term = decodeURIComponent(url.replace('medical://', ''));
    
    // Terms that should route to the BV/yeast/trichomoniasis article
    const infectionTerms = ['bv', 'trich', 'trichomonas', 'bacterial vaginosis', 'trichomoniasis', 'yeast'];
    
    if (infectionTerms.includes(term.toLowerCase())) {
      // Handle async operation without blocking
      getArticleBySlug('what_is_bv_yeast_infections_and_trichomoniasis')
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
              ? getPHStatus(Number(value))
              : getBiomarkerStatus(value!, name, log.ph ?? undefined);
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
                        biomarkers.map(([n, v]) => ({ name: n, value: v || '' }))
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
                              <Text style={styles.disclaimerText}>{disclaimer}</Text>
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
            <Text style={styles.learnMoreButtonText}>Learn more about your biomarkers</Text>
          </ShrinkableTouchable>

          <View style={styles.divider} />

          {/* Journal Entry */}
          {(log.test_session_id || log.id) && (
            <View style={styles.journalCard}>
              <ShrinkableTouchable 
                style={styles.journalHeader}
                onPress={() => setJournalExpanded(!journalExpanded)}
              >
                <Text style={styles.journalButtonText}>
                  🔖 Journal Entry
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
                    {totalInsights === 1 ? 'note' : 'notes'}
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
                      <Text style={styles.journalLoadingText}>Loading journal entry...</Text>
                    </View>
                  ) : (
                    <>
                      {journalEntries.length === 0 ? (
                        <Text style={styles.journalEmptyText}>No journal entry data available for this test.</Text>
                      ) : (
                        <>
                          {symptomLabels.length > 0 && (
                            <View style={[styles.journalSection, styles.journalSectionPrimary]}>
                              <Text style={styles.journalSectionTitle}>Symptoms</Text>
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
                              <Text style={styles.journalSectionTitle}>Context</Text>
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
                              pathname: '/log-test/context',
                              params: { test_session_id: sessionId, edit: 'true' }
                            });
                          }
                        }}
                      >
                        <Text style={styles.journalEditButtonText}>Edit Answers</Text>
                      </ShrinkableTouchable>
                    </>
                  )}
                </Animated.View>
              )}
            </View>
          )}

          <View style={styles.divider} />

          {/* Ask Santelle Button */}
          <ShrinkableTouchable 
            style={styles.askSantelleButton}
            onPress={() => setAskSantelleModalVisible(true)}
          >
            <LinearGradient
              colors={['#EF7D88','#FFEBCE','#FABDD7','#FD9EAA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.askSantelleGradient}
            >
              <Text style={styles.askSantelleButtonText}>Ask Santelle</Text>
            </LinearGradient>
          </ShrinkableTouchable>

          {/* Chatbot Button */}
          <ShrinkableTouchable 
            style={styles.chatbotButton}
            onPress={() => setChatbotModalVisible(true)}
          >
            <Text style={styles.chatbotButtonText}>Chat</Text>
          </ShrinkableTouchable>

        </ScrollView>
        </View>
      </ScreenBackground>

      <ArticleModal
        visible={articleModalVisible}
        onClose={() => {
          setArticleModalVisible(false);
          setSelectedArticle(null);
        }}
        title={selectedArticle?.title || "Learn about your biomarkers"}
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
  scroll: { padding: 20, paddingTop: 95, paddingBottom: 50 },
  biomarkerBlock: { marginBottom: 5 },
  biomarkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    gap: 8 
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  biomarkerLabel: { fontFamily: 'Poppins-SemiBold', fontSize: 16, color: Colors.light.rush },
  biomarkerValue: { fontFamily: 'Poppins-Bold', fontSize: 16, color: Colors.light.rush },
  circle: { width: 12, height: 12, borderRadius: 6 },
  biomarkerExpandIcon: {
    fontSize: 12,
    color: Colors.light.rush,
    opacity: 0.8,
    marginLeft: 6,
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

  analysisBox: { marginTop: -10, padding: 15, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.5)' },
  analysisTitle: { fontSize: 18, fontFamily: 'Poppins-SemiBold', color: Colors.light.rush, marginBottom: 8 },
  analysisText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Colors.light.rush },

  headerBubble: {
    position: 'absolute',
    top: 15,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
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
     fontSize: 14,
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
    fontSize: 14,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: -15,
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
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
    alignItems: 'center',
    marginTop: 0,
  },
  learnMoreButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
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