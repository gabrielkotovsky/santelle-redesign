import { ScrollView, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import CurrentTest from '../../src/components/tests/current-test';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Colors } from '../../src/theme/colors';
import StartTest from '../../src/components/tests/start-test';
import CompactTest from '../../src/components/tests/compact-test';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTestSession } from '../../src/features/test-session/testSession.store';
import { supabase } from '../../src/services/supabase';
import type { TestLog } from '../../src/features/test-logs/testLogs.api';
import TestLogModal from '../../src/components/modals/test-result';


export default function TestsScreen() {
  const router = useRouter();
  const session = useTestSession(s => s.session);
  const hydrateFromServer = useTestSession(s => s.hydrateFromServer);
  const [now, setNow] = useState(() => Date.now());
  const isActive = !!session && session.status === 'in_progress';
  const currentStep = session?.current_step ?? 1;
  const [testHistory, setTestHistory] = useState<TestLog[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTestLog, setSelectedTestLog] = useState<TestLog | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchTestHistory = async () => {
        const { data, error } = await supabase
          .from('test_logs')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching test history:', error);
          return;
        }
        setTestHistory((data ?? []) as TestLog[]);
      };
      fetchTestHistory();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      hydrateFromServer();
    }, [hydrateFromServer])
  );

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const totalSteps = 7; // update if your flow changes
  const resultsEndsAt = session?.results_ready_at
    ? new Date(session.results_ready_at).getTime()
    : undefined;
  const timeRemaining = resultsEndsAt ? Math.max(0, Math.ceil((resultsEndsAt - now) / 1000)) : 0;
  const dataReady = true; // toggle if you want skeletons

  const handleResumeTest = () => router.push('/log-test/test');
  const handleTestPress = (testLog: TestLog) => {
    setSelectedTestLog(testLog);
    setModalVisible(true);
  };

  // ---- grid layout for history ----
  const numColumns = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = 110;
    const gap = 10;
    const padding = 20;
    const availableWidth = screenWidth - padding;
    const columns = Math.floor(availableWidth / (cardWidth + gap));
    return Math.max(2, Math.min(4, columns));
  }, []);

  const renderTestItem = ({ item }: { item: TestLog }) => {
    const created = new Date(item.created_at);
    const date = created.toLocaleDateString();
    const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <CompactTest
        date={date}
        time={time}
        pH={item.ph}
        H2O2={item.h2o2}
        LE={item.le}
        SNA={item.sna}
        betaG={item.beta_g}
        NAG={item.nag}
        onPress={() => handleTestPress(item)}
      />
    )
  }

  return (
    <ScreenBackground>
      <ScrollView>
        {isActive ? (
          <CurrentTest
            currentStep={currentStep}
            totalSteps={totalSteps}
            timeRemaining={timeRemaining}   // seconds until results are ready
            onResumeTest={handleResumeTest}
            dataReady={dataReady}
          />
        ) : (
          <StartTest />
        )}

        <View style={styles.divider} />

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>HISTORY</Text>
        </View>

        <FlatList
          data={testHistory}
          renderItem={renderTestItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
        />
      </ScrollView>
      
      <TestLogModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        log={selectedTestLog}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  historySection: {},
  historyTitle: {
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#721422',
    marginHorizontal: 60,
    marginVertical: 20,
  },
  gridContainer: {
    marginBottom: 100,
  },
  row: {
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
});