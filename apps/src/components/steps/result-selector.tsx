import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { useTestSession } from '@/src/features/test-session/testSession.store';
import { upsertLogResultsFlat, type TestLog, analyzeLog, fetchLogById } from '@/src/features/test-logs/testLogs.api';
import { router } from 'expo-router';
import TestLogModal from '../modals/test-result';
import { supabase } from '@/src/services/supabase';

interface ResultSelectorProps {
  title?: string;
}

type BiomarkerKeyUI = 'H₂O₂' | 'LE' | 'SNA' | 'β-G' | 'NAG';
type TestResultsState = Record<BiomarkerKeyUI, string>;

export default function ResultSelector({ title = "Select your results" }: ResultSelectorProps) {
  const [selectedTestResults, setSelectedTestResults] = useState<TestResultsState>({
    'H₂O₂': '',
    'LE':   '',
    'SNA':  '',
    'β-G':  '',
    'NAG':  ''
  });
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
      'H₂O₂': { '+': '#fdf7f9', '±': '#fee9f0', '-': '#fdd6db' },
      'LE':   { '+++': '#a275a0', '++': '#d18eaf', '+': '#cfaebf', '±': '#d8c9ce', '-': '#f7ecea' },
      'SNA':  { '+': '#fbd4e7', '±': '#fcedf2', '-': '#ffffff' },
      'β-G':  { '+': '#bde4f3', '±': '#d8f1ed', '-': '#fcfef3' },
      'NAG':  { '+': '#ffcbb7', '±': '#fee8da', '-': '#fefff8' },
    };
    return colors[testType]?.[intensity] ?? '#FFFFFF';
  };

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
      // 1) Save final results
      const saved = await upsertLogResultsFlat(session.id, {
        h2o2:   selectedTestResults['H₂O₂'],
        le:     selectedTestResults['LE'],
        sna:    selectedTestResults['SNA'],
        beta_g: selectedTestResults['β-G'],
        nag:    selectedTestResults['NAG'],
      });

      // 2) Mark session complete
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
          console.warn('Analysis failed:', e);
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
        Refer to the color guide in the kit, and select the color that best matches each result:
        </Text>

        <View style={styles.testResultsGrid}>
          {renderRow('H₂O₂', ['+', '±', '-'])}
          {renderRow('LE', ['+++', '++', '+', '±', '-'])}
          {renderRow('SNA', ['+', '±', '-'])}
          {renderRow('β-G', ['+', '±', '-'])}
          {renderRow('NAG', ['+', '±', '-'])}
        </View>

        <ShrinkableTouchable
          style={dynamicStyles.completeBtn as any}
          onPress={handleCompletePress}
          disabled={!allSelected || saving}
          accessibilityRole="button"
          accessibilityLabel="Complete test"
        >
          <Text style={dynamicStyles.completeText}>
            {saving ? 'Saving…' : 'Complete test'}
          </Text>
        </ShrinkableTouchable>
      </View>

      {/* Modal: shown after saving + completing */}
      <TestLogModal
        visible={showResultModal}
        log={completedLog ?? undefined}
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
    overflow: 'scroll',
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
    marginBottom: 20,
  },
  testResultsGrid: { width: '100%', flex: 1, justifyContent: 'flex-start' },
  testResultRow: { flexDirection: 'row', marginBottom: 20, paddingHorizontal: 0, justifyContent: 'space-between' },
  testResultLabel: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#721422', width: 60, textAlign: 'left', alignSelf: 'flex-start', marginTop: 15 },
  testResultOptions: { flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginRight: 15 },
  testResultOption: { alignItems: 'center', padding: 8, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', marginLeft: 8 },
  testResultColor: { width: 30, height: 30, borderRadius: 6, marginBottom: 6, borderWidth: 0.3, borderColor: 'rgba(0, 0, 0, 1)' },
  testResultValue: { fontSize: 12, fontFamily: 'Poppins-SemiBold', color: '#721422', textAlign: 'center' },
});