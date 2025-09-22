// src/components/modals/test-result.tsx
import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/theme/colors';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { getBiomarkerDescription, getBiomarkerStatus, getPHStatus } from './biomarker-utils';
import { ScreenBackground } from '../layout/ScreenBackground';
import Animated, { FadeInDown, FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { ArticleModal } from './article-modal';
import Markdown from 'react-native-markdown-display';

type Props = {
  visible: boolean;
  onClose: () => void;
  log?: {
    id: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
    created_at?: string;
    analysis?: string | null;
  } | null;
  analyzing?: boolean;
  analysisError?: string | null;
};


export default function TestLogModal({ visible, onClose, log, analyzing = false, analysisError }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  if (!log) return null;

  const toggle = (key: string) => {
    const copy = new Set(expanded);
    copy.has(key) ? copy.delete(key) : copy.add(key);
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
         {/* Header */}
         <View style={styles.header}>
           <View style={styles.headerLeft}>
             <Text style={styles.dateText} numberOfLines={1}>{date}</Text>
           </View>

           <View style={styles.timeWrapper} pointerEvents="none">
             <Text style={styles.timeText}>{time}</Text>
           </View>

           <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
             <Text style={styles.cancelButtonText}>×</Text>
           </TouchableOpacity>
         </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Biomarker Grid */}
          {biomarkers.filter(([_, v]) => v).map(([name, value]) => {
            const status = name === 'pH'
              ? getPHStatus(Number(value))
              : getBiomarkerStatus(value!, name, log.ph ?? undefined);
            const isExpanded = expanded.has(name);
            return (
              <Animated.View layout={LinearTransition.duration(200)} key={name} style={styles.biomarkerBlock}>
              <View key={name} style={styles.biomarkerBlock}>
                <ShrinkableTouchable
                  style={[styles.biomarkerRow, { backgroundColor: (status?.color ?? '#000') + '30' }]}
                  onPress={() => toggle(name)}
                >
                  <View style={styles.leftSection}>
                    <Text style={styles.biomarkerLabel}>{name}</Text>
                    <View style={[styles.circle, { backgroundColor: status?.color }]} />
                  </View>
                  <View style={styles.rightSection}>
                    <Text style={styles.biomarkerValue}>{value}</Text>
                    <View style={styles.questionMarkContainer}>
                      <Text style={styles.questionMark}>?</Text>
                    </View>
                  </View>
                </ShrinkableTouchable>

                {isExpanded && (
                  <Animated.View
                  entering={FadeInUp}
                  exiting={FadeOutUp.duration(180)}
                  layout={LinearTransition.duration(200)}
                  style={[styles.detailBox, { backgroundColor: (status?.color ?? '#000') + '20' }]}
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
              </Animated.View>
            );
          })}

          {/* Learn More Button */}
          <ShrinkableTouchable 
            style={styles.learnMoreButton}
            onPress={() => setArticleModalVisible(true)}
          >
            <Text style={styles.learnMoreButtonText}>Learn more about your results</Text>
          </ShrinkableTouchable>

          <View style={styles.divider} />

          {/* Analysis */}
          <View style={styles.analysisBox}>
            <Text style={styles.analysisTitle}>Santelle Analysis</Text>
            {analyzing ? (
              <View style={styles.loadingContainer}>
               <LottieView
                 source={require('@/assets/animations/Loading.json')}
                 autoPlay
                 loop
                 style={styles.loadingAnimation}
              />
               <Text style={styles.loadingText}>Analyzing your results…</Text>
              </View>
              ) : analysisError ? (
              <Text style={styles.errorText}>{analysisError}</Text>
            ) : log.analysis ? (
              <Markdown style={md}>
                {log.analysis?.trim() || ''}
              </Markdown>
              ) : (
              <Text style={styles.analysisText}>No analysis is available yet.</Text>
              )}
          </View>

        </ScrollView>
        </View>
      </ScreenBackground>

      <ArticleModal
        visible={articleModalVisible}
        onClose={() => setArticleModalVisible(false)}
        title="Learn about your biomarkers"
        content={`### Potential Hydrogen
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
        image={require('@/assets/images/fig.png')}
      />
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  biomarkerBlock: { marginBottom: 5 },
  biomarkerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
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
  questionMarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(114, 20, 34, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  questionMark: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: Colors.light.rush,
    opacity: 0.8,
  },

  detailBox: { padding: 12, borderRadius: 8, marginTop: 6, marginRight: 15 },
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
  // center absolute overlay so it’s perfectly centered regardless of left/right widths
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
  cancelButton: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  loadingAnimation: { width: 56, height: 56, marginBottom: 8 },
  loadingText: { fontSize: 14, fontFamily: 'Poppins-Regular', color: Colors.light.rush, opacity: 0.8 },
  errorText: { fontSize: 14, fontFamily: 'Poppins-SemiBold', color: '#D92D20' },
  learnMoreButton: {
    backgroundColor: 'rgba(114, 20, 34, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.2)',
    alignItems: 'center',
    marginTop: 10,
  },
  learnMoreButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
});

const md = {
  body: {
    color: Colors.light.rush,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  heading1: {
    color: Colors.light.rush,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    marginBottom: 6,
  },
  heading2: {
    color: Colors.light.rush,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginTop: 6,
    marginBottom: 6,
  },
  heading3: {
    color: Colors.light.rush,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginTop: 6,
    marginBottom: 4,
  },
  heading4: {
    color: Colors.light.rush,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 2,
  },
  strong: {
    fontFamily: 'Poppins-SemiBold',
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 8,
  },
  bullet_list_icon: {
    color: Colors.light.rush,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  list_item_content: {
    flex: 1,
    color: Colors.light.rush,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  hr: {
    backgroundColor: Colors.light.rush,
    opacity: 0.25,
    height: 1,
    marginVertical: 10,
  },
  paragraph: {
    marginTop: 2,
    marginBottom: 8,
  },
  code_inline: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    paddingVertical: 1,
  },
} as const;