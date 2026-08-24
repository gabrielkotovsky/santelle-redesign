import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { useTestSession } from '@/src/features/test-session/testSession.store';
import {
  upsertLogResultsFlat,
  getLogBySession,
  type TestLog,
  analyzeLog,
  fetchLogById,
} from '@/src/features/test-logs/testLogs.api';
import { router } from 'expo-router';
import TestLogModal from '../modals/test-result';
import { supabase } from '@/src/services/supabase';
import { useTranslations } from '@/src/i18n';

interface ResultSelectorProps {
  title?: string;
  /** Close the result modal and jump back to pH/markers without leaving the test flow. */
  onRequestEditResults?: () => void;
}

type BiomarkerKeyUI = 'H₂O₂' | 'LE' | 'SNA' | 'β-G' | 'NAG';
type TestResultsState = Record<BiomarkerKeyUI, string>;

const emptyResults = (): TestResultsState => ({
  'H₂O₂': '',
  'LE': '',
  'SNA': '',
  'β-G': '',
  'NAG': '',
});

export default function ResultSelector({
  title = 'Select your results',
  onRequestEditResults,
}: ResultSelectorProps) {
  const { t } = useTranslations();
  const [selectedTestResults, setSelectedTestResults] = useState<TestResultsState>(emptyResults);
  const [saving, setSaving] = useState(false);

  const session  = useTestSession(s => s.session);
  const complete = useTestSession(s => s.complete);

  // NEW: state to show modal with the just-completed log
  const [showResultModal, setShowResultModal] = useState(false);
  const [completedLog, setCompletedLog] = useState<TestLog | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const allSelected = useMemo(
    () => Object.values(selectedTestResults).every(Boolean),
    [selectedTestResults]
  );

  const setOne = (k: BiomarkerKeyUI, v: string) =>
    setSelectedTestResults(prev => ({ ...prev, [k]: v }));

  const getTestResultColor = (testType: BiomarkerKeyUI, intensity: string): string => {
    const colors: Record<BiomarkerKeyUI, Record<string, string>> = {
      'H₂O₂': { '+': '#fef8f9', '±': '#f0d3dc', '-': '#e1aac0' },
      'LE':   { '+++': '#785d73', '++': '#a4768c', '+': '#b598a2', '±': '#d2c3c4', '-': '#f3eae5' },
      'SNA':  { '+': '#f0d3dc', '±': '#faecef', '-': '#ffffff' },
      'β-G':  { '+': '#c2dfe3', '±': '#e0efec', '-': '#ffffff' },
      'NAG':  { '+': '#97a2af', '±': '#c1c0bc', '-': '#ffffff' },
    };
    return colors[testType]?.[intensity] ?? '#FFFFFF';
  };

  // Prefill chips from an existing log (supports re-edit after completion).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session?.id) return;
      try {
        const log = await getLogBySession(session.id);
        if (cancelled || !log) return;
        setSelectedTestResults((prev) => ({
          'H₂O₂': log.h2o2 || prev['H₂O₂'],
          'LE': log.le || prev['LE'],
          'SNA': log.sna || prev['SNA'],
          'β-G': log.beta_g || prev['β-G'],
          'NAG': log.nag || prev['NAG'],
        }));
      } catch {
        // Silently handle load error
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session?.id]);

  useEffect(() => {
    if (!completedLog?.id) return;

    const channel = supabase
      .channel(`test_logs:${completedLog.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'test_logs', filter: `id=eq.${completedLog.id}` },
        (payload) => {
          const next = payload.new as TestLog;
          setCompletedLog(next);
          if (next.analysis) setAnalyzing(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [completedLog?.id]);

  async function handleCompletePress() {
    if (!session || saving || !allSelected) return;
    setSaving(true);
    try {
      // 1) Save final results (upsert overwrites by session — works after completed too)
      const saved = await upsertLogResultsFlat(session.id, {
        h2o2:   selectedTestResults['H₂O₂'],
        le:     selectedTestResults['LE'],
        sna:    selectedTestResults['SNA'],
        beta_g: selectedTestResults['β-G'],
        nag:    selectedTestResults['NAG'],
      });

      // 2) Mark session complete (idempotent if already completed)
      await complete();

      // 3) Show modal with this completed log (so user sees what they just saved)
      setCompletedLog(saved);
      setShowResultModal(true);
      setAnalysisError(null);
      setAnalyzing(true);

      // 4) Analyze the log
      analyzeLog(saved.id)
        .then(async () => {
          // Optional fallback poll once after a short delay, in case Realtime is off:
          setTimeout(async () => {
            const refreshed = await fetchLogById(saved.id);
            if (refreshed) {
              setCompletedLog(refreshed);
              if (refreshed.analysis) setAnalyzing(false);
            }
          }, 1500);
        })
        .catch((e) => {
          setAnalyzing(false);
          setAnalysisError('Failed to analyze your results. Please try again.');
        });

    } catch (e) {
      // Handle test finalization error
    } finally {
      setSaving(false);
    }
  }

  const dynamicStyles = StyleSheet.create({
    resultCard: { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
    resultCardTitle: { color: '#721422' },
    instructionText: { fontSize: 16, fontFamily: 'Poppins-Regular', color: '#721422' },
    testResultOptionSelected: { borderColor: '#721422', backgroundColor: 'rgba(114, 20, 34, 0.1)' },
    testResultValue: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#721422' },
    testResultLabel: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#721422' },
    completeBtn: {
      backgroundColor: allSelected && !saving ? '#721422' : 'rgba(114,20,34,0.3)',
      borderRadius: 28,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 10,
    },
    completeText: {
      color: 'white',
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
    },
  });

  const renderRow = (testType: BiomarkerKeyUI, intensities: string[]) => (
    <View key={testType} style={styles.testResultRow}>
      <View style={styles.testResultOptions}>
        {intensities.map((intensity) => (
          <ShrinkableTouchable
            key={`${testType}-${intensity}`}
            style={[
              styles.testResultOption,
              selectedTestResults[testType] === intensity && dynamicStyles.testResultOptionSelected
            ] as any}
            onPress={() => setOne(testType, intensity)}
            disabled={saving}
          >
            <View style={[styles.testResultColor, { backgroundColor: getTestResultColor(testType, intensity) }]} />
            <Text style={[styles.testResultValue, dynamicStyles.testResultValue]}>{intensity}</Text>
          </ShrinkableTouchable>
        ))}
      </View>
      <Text style={[styles.testResultLabel, dynamicStyles.testResultLabel]}>{testType}</Text>
    </View>
  );



  return (
    <>
      <View style={[styles.resultCard, dynamicStyles.resultCard]}>
        <Text style={[styles.resultCardTitle, dynamicStyles.resultCardTitle]}>{title}</Text>
        <Text style={[styles.instructionText, dynamicStyles.instructionText]}>
        {t.testResultGuideInstruction}
        </Text>

        <View style={styles.testResultsGrid}>
          {renderRow('H₂O₂', ['+', '±', '-'])}
          {renderRow('LE', ['+++', '++', '+', '±', '-'])}
          {renderRow('SNA', ['+', '±', '-'])}
          {renderRow('β-G', ['+', '±', '-'])}
          {renderRow('NAG', ['+', '±', '-'])}
          <View style={styles.calibrationRow}>
            <View style={styles.calibrationInfoContainer}>
              <Text style={styles.calibrationNote} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                {t.calibrationMarkerNote}
              </Text>
            </View>
            <Text style={styles.calibrationLabel}>CAL</Text>
          </View>
        </View>

        <ShrinkableTouchable
          style={dynamicStyles.completeBtn as any}
          onPress={handleCompletePress}
          disabled={!allSelected || saving}
          accessibilityRole="button"
          accessibilityLabel="Complete test"
        >
          <Text style={dynamicStyles.completeText}>
            {saving ? t.savingResults : t.completeTest}
          </Text>
        </ShrinkableTouchable>
      </View>

      {/* Modal: shown after saving + completing */}
      <TestLogModal
        visible={showResultModal}
        log={completedLog ?? undefined}
        onEditResults={() => {
          setShowResultModal(false);
          onRequestEditResults?.();
        }}
        onClose={() => {
          setShowResultModal(false);
          // after user closes the modal, go back to the Tests tab
          router.replace('/(tabs)/tests');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 40,
    padding: 20,
    marginHorizontal: 1,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    flexDirection: 'column',
    flex: 1,
    maxHeight: '100%',
    overflow: 'visible',
  },
  resultCardTitle: {
    fontSize: 20,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 12,
  },
  testResultsGrid: { width: '100%', flex: 1, justifyContent: 'flex-start' },
  testResultRow: { flexDirection: 'row', marginBottom: 14, paddingHorizontal: 0, justifyContent: 'space-between' },
  testResultLabel: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#721422', width: 60, textAlign: 'left', alignSelf: 'flex-start', marginTop: 15 },
  testResultOptions: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 15 },
  testResultOption: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', marginLeft: 8 },
  testResultColor: { width: 30, height: 30, borderRadius: 6, marginBottom: 6, borderWidth: 0.3, borderColor: 'rgba(0, 0, 0, 1)' },
  testResultValue: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#721422', textAlign: 'center' },
  calibrationRow: { flexDirection: 'row', marginBottom: 12, justifyContent: 'space-between', alignItems: 'center' },
  calibrationInfoContainer: { flex: 1, marginRight: 15, alignItems: 'flex-end' },
  calibrationLabel: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#721422', width: 60, textAlign: 'left', alignSelf: 'flex-start' },
  calibrationNote: { fontSize: 11, lineHeight: 14, fontFamily: 'Poppins-Regular', color: '#721422', textAlign: 'right', opacity: 0.8 },
});
