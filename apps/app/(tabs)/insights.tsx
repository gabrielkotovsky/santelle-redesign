import { BlurView } from 'expo-blur';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import { BiomarkerChart, categoricalToNumeric, PH_VALUES } from '../../src/components/charts/BiomarkerChart';
import { LottieRefreshIcon } from '../../src/components/animations/LottieRefreshIcon';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { useSupabaseRefresh } from '../../src/hooks/useSupabaseRefresh';
import { supabase } from '../../src/services/supabase';
import type { TestLog } from '../../src/features/test-logs/testLogs.api';
import { Colors } from '../../src/theme/colors';
import { useTranslations } from '../../src/i18n';

type BiomarkerKey = 'pH' | 'h2o2' | 'le' | 'sna' | 'beta_g' | 'nag';

export default function InsightsScreen() {
  const [testHistory, setTestHistory] = useState<TestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations();
  const BIOMARKER_CONFIG = React.useMemo(() => ({
    pH: { title: t.insightsPh, color: '#E57373', unit: '', minValue: 3.5, maxValue: 7.5, description: t.insightsPhDesc },
    h2o2: { title: t.insightsH2o2, color: '#64B5F6', unit: '', description: t.insightsH2o2Desc },
    le: { title: t.insightsLe, color: '#81C784', unit: '', description: t.insightsLeDesc },
    sna: { title: t.insightsSna, color: '#FFB74D', unit: '', description: t.insightsSnaDesc },
    beta_g: { title: t.insightsBetaG, color: '#BA68C8', unit: '', description: t.insightsBetaGDesc },
    nag: { title: t.insightsNag, color: '#4DD0E1', unit: '', description: t.insightsNagDesc },
  }), [t]);

  const fetchTestHistory = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('test_logs')
        .select('*')
        .order('created_at', { ascending: true }); // Ascending for chronological charts
      
      if (error) throw error;
      setTestHistory(data || []);
    } catch (err) {
      console.error('Error fetching test history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Custom refresh function
  const refreshData = useCallback(async () => {
    await fetchTestHistory();
  }, [fetchTestHistory]);

  const { refreshing, onRefresh } = useSupabaseRefresh({
    onRefresh: refreshData,
  });

  useFocusEffect(
    useCallback(() => {
      fetchTestHistory();
    }, [fetchTestHistory])
  );

  // Prepare chart data for each biomarker
  const chartData = useMemo(() => {
    if (testHistory.length < 2) return null;

    const biomarkers: Record<BiomarkerKey, { value: number; date: Date }[]> = {
      pH: [],
      h2o2: [],
      le: [],
      sna: [],
      beta_g: [],
      nag: [],
    };

    testHistory.forEach(test => {
      const date = new Date(test.created_at);

      // pH is numeric
      if (test.ph !== null && test.ph !== undefined) {
        biomarkers.pH.push({ value: test.ph, date });
      }

      // Categorical biomarkers
      if (test.h2o2) {
        const numericValue = categoricalToNumeric(test.h2o2);
        if (numericValue > 0) {
          biomarkers.h2o2.push({ value: numericValue, date });
        }
      }

      if (test.le) {
        const numericValue = categoricalToNumeric(test.le);
        if (numericValue > 0) {
          biomarkers.le.push({ value: numericValue, date });
        }
      }

      if (test.sna) {
        const numericValue = categoricalToNumeric(test.sna);
        if (numericValue > 0) {
          biomarkers.sna.push({ value: numericValue, date });
        }
      }

      if (test.beta_g) {
        const numericValue = categoricalToNumeric(test.beta_g);
        if (numericValue > 0) {
          biomarkers.beta_g.push({ value: numericValue, date });
        }
      }

      if (test.nag) {
        const numericValue = categoricalToNumeric(test.nag);
        if (numericValue > 0) {
          biomarkers.nag.push({ value: numericValue, date });
        }
      }
    });

    return biomarkers;
  }, [testHistory]);

  const hasEnoughData = testHistory.length >= 2;

  return (
    <ScreenBackground>
      {refreshing && (
        <View style={styles.loadingContainer}>
          <LottieRefreshIcon 
            size={40} 
            isRefreshing={refreshing} 
          />
        </View>
      )}
      
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            progressViewOffset={0}
            progressBackgroundColor="transparent"
            style={{ backgroundColor: 'transparent' }}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <BlurView intensity={20} tint="light" style={styles.headerBubble}>
            <Text style={styles.headerTitle}>{t.insightsHeader}</Text>
          </BlurView>
        </View>

        {loading ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t.loadingYourData}</Text>
          </View>
        ) : !hasEnoughData ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>{t.trackYourProgress}</Text>
            <Text style={styles.emptyStateText}>
              {t.completeTwoTests}
            </Text>
            <View style={styles.testCountBadge}>
              <Text style={styles.testCountText}>
                {typeof t.testsCompleted === 'function' ? t.testsCompleted(testHistory.length, 2) : `${testHistory.length} / 2 tests completed`}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* pH Chart - always first as it's the primary indicator */}
            {chartData && chartData.pH.length >= 2 && (
              <BiomarkerChart
                title={BIOMARKER_CONFIG.pH.title}
                data={chartData.pH}
                color={BIOMARKER_CONFIG.pH.color}
                unit={BIOMARKER_CONFIG.pH.unit}
                customYLabels={[...PH_VALUES]}
                evenlySpaced
                height={180}
              />
            )}

            {/* Other biomarker charts (categorical: −, ±, +) */}
            {chartData && chartData.h2o2.length >= 2 && (
              <BiomarkerChart
                title={BIOMARKER_CONFIG.h2o2.title}
                data={chartData.h2o2}
                color={BIOMARKER_CONFIG.h2o2.color}
                minValue={0.5}
                maxValue={3.5}
                isCategorical
              />
            )}

            {chartData && chartData.le.length >= 2 && (
              <BiomarkerChart
                title={BIOMARKER_CONFIG.le.title}
                data={chartData.le}
                color={BIOMARKER_CONFIG.le.color}
                minValue={0.5}
                maxValue={3.5}
                isCategorical
              />
            )}

            {chartData && chartData.sna.length >= 2 && (
              <BiomarkerChart
                title={BIOMARKER_CONFIG.sna.title}
                data={chartData.sna}
                color={BIOMARKER_CONFIG.sna.color}
                minValue={0.5}
                maxValue={3.5}
                isCategorical
              />
            )}

            {chartData && chartData.beta_g.length >= 2 && (
              <BiomarkerChart
                title={BIOMARKER_CONFIG.beta_g.title}
                data={chartData.beta_g}
                color={BIOMARKER_CONFIG.beta_g.color}
                minValue={0.5}
                maxValue={3.5}
                isCategorical
              />
            )}

            {chartData && chartData.nag.length >= 2 && (
              <BiomarkerChart
                title={BIOMARKER_CONFIG.nag.title}
                data={chartData.nag}
                color={BIOMARKER_CONFIG.nag.color}
                minValue={0.5}
                maxValue={3.5}
                isCategorical
              />
            )}
          </>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'transparent',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  headerBubble: {
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 22,
  },
  testCountBadge: {
    marginTop: 24,
    backgroundColor: 'rgba(114, 20, 34, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.2)',
  },
  testCountText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
  },
});
