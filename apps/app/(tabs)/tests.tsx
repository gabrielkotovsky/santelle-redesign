// app/(tabs)/tests.tsx
import { ScrollView, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import CurrentTest from '../../src/components/tests/current-test';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Colors } from '../../src/theme/colors';
import StartTest from '../../src/components/tests/start-test';
import CompactTest from '../../src/components/tests/compact-test';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTestSession } from '../../src/features/test-session/testSession.store';

export default function TestsScreen() {
  const router = useRouter();

  // ---- session from store + hydrate on focus ----
  const session = useTestSession(s => s.session);
  const hydrateFromServer = useTestSession(s => s.hydrateFromServer);

  useFocusEffect(
    useCallback(() => {
      hydrateFromServer();
    }, [hydrateFromServer])
  );

  // ---- ticking clock so CurrentTest countdown stays live ----
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- derive UI state for CurrentTest ----
  const isActive = !!session && session.status === 'in_progress';
  const currentStep = session?.current_step ?? 1;
  const totalSteps = 7; // update if your flow changes
  const resultsEndsAt = session?.results_ready_at
    ? new Date(session.results_ready_at).getTime()
    : undefined;
  const timeRemaining = resultsEndsAt ? Math.max(0, Math.ceil((resultsEndsAt - now) / 1000)) : 0;
  const dataReady = true; // toggle if you want skeletons

  // ---- handlers ----
  const handleResumeTest = () => router.push('/log-test/test');
  const handleTestPress = (testId: string) => {
    // open details / modal
    console.log('Test pressed:', testId);
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

  // ---- mock history (unchanged) ----
  const testHistory = [
    { id: '1', date: '01-01-2025', time: '12:00', pH: 4.4, H2O2: '-', LE: '++', SNA: '±', betaG: '+', NAG: '+' },
    { id: '2', date: '31-12-2024', time: '09:30', pH: 4.2, H2O2: '+', LE: '+++', SNA: '+', betaG: '+', NAG: '±' },
    { id: '3', date: '30-12-2024', time: '15:45', pH: 4.0, H2O2: '-', LE: '-', SNA: '-', betaG: '-', NAG: '-' },
    { id: '4', date: '29-12-2024', time: '11:20', pH: 4.6, H2O2: '±', LE: '+', SNA: '+', betaG: '+', NAG: '+' },
    { id: '5', date: '28-12-2024', time: '14:15', pH: 4.1, H2O2: '-', LE: '±', SNA: '-', betaG: '±', NAG: '-' },
    { id: '6', date: '27-12-2024', time: '16:30', pH: 4.3, H2O2: '+', LE: '++', SNA: '+', betaG: '+', NAG: '+' },
  ];

  const renderTestItem = ({ item }: { item: typeof testHistory[0] }) => (
    <CompactTest
      date={item.date}
      time={item.time}
      pH={item.pH}
      H2O2={item.H2O2}
      LE={item.LE}
      SNA={item.SNA}
      betaG={item.betaG}
      NAG={item.NAG}
      onPress={() => handleTestPress(item.id)}
    />
  );

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