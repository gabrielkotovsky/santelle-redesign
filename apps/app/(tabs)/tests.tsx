// 164 lines

import { BlurView } from 'expo-blur';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View, RefreshControl } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { LottieRefreshIcon } from '../../src/components/animations/LottieRefreshIcon';
import TestLogModal from '../../src/components/modals/test-result';
import CompactTest from '../../src/components/tests/compact-test';
import CurrentTest from '../../src/components/tests/current-test';
import StartTest from '../../src/components/tests/start-test';
import type { TestLog } from '../../src/features/test-logs/testLogs.api';
import { useTestSession } from '../../src/features/test-session/testSession.store';
import { supabase } from '../../src/services/supabase';
import { Colors } from '../../src/theme/colors';
import { useSupabaseRefresh } from '../../src/hooks/useSupabaseRefresh';
import { useTranslations } from '../../src/i18n';

interface AnimatedCompactTestProps {
  date: string;
  time: string;
  pH: number;
  H2O2: string;
  LE: string;
  SNA: string;
  betaG: string;
  NAG: string;
  onPress: () => void;
  index: number;
}

const AnimatedCompactTest = ({ 
  date, 
  time, 
  pH, 
  H2O2, 
  LE, 
  SNA, 
  betaG, 
  NAG, 
  onPress, 
  index 
}: AnimatedCompactTestProps) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Staggered animation - each test appears with a delay
    const delay = index * 100; // 100ms delay between each test
    
    translateY.value = withDelay(delay, withTiming(0, { duration: 600 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 600 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <CompactTest
        date={date}
        time={time}
        pH={pH}
        H2O2={H2O2}
        LE={LE}
        SNA={SNA}
        betaG={betaG}
        NAG={NAG}
        onPress={onPress}
      />
    </Animated.View>
  );
};

export default function TestsScreen() {
  const router = useRouter();
  const { t } = useTranslations();
  const session = useTestSession(s => s.session);
  const hydrateFromServer = useTestSession(s => s.hydrateFromServer);
  const [now, setNow] = useState(() => Date.now());
  const isActive = !!session && session.status === 'in_progress';
  const currentStep = session?.current_step ?? 1;
  const [testHistory, setTestHistory] = useState<TestLog[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTestLog, setSelectedTestLog] = useState<TestLog | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // Custom refresh function for tests screen data
  const refreshTestsData = useCallback(async () => {
    await hydrateFromServer();
    await fetchTestHistory();
  }, [hydrateFromServer]);

  // Use the Supabase refresh hook
  const { refreshing, onRefresh } = useSupabaseRefresh({
    onRefresh: refreshTestsData,
  });

  const fetchTestHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from('test_logs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return;
    }
    setTestHistory(data || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTestHistory();
    }, [fetchTestHistory])
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
    setAnalyzing(!Boolean(testLog.analysis));
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

  const renderTestItem = ({ item, index }: { item: TestLog; index: number }) => {
    const created = new Date(item.created_at);
    const date = created.toLocaleDateString();
    const time = created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return (
      <AnimatedCompactTest
        date={date}
        time={time}
        pH={item.ph ?? 0}
        H2O2={item.h2o2 ?? ''}
        LE={item.le ?? ''}
        SNA={item.sna ?? ''}
        betaG={item.beta_g ?? ''}
        NAG={item.nag ?? ''}
        onPress={() => handleTestPress(item)}
        index={index}
      />
    )
  }

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
          <BlurView intensity={20} tint="light" style={styles.historyBubble}>
            <Text style={styles.historyTitle}>{t.history}</Text>
          </BlurView>
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
  historySection: {
    alignItems: 'center',
    marginBottom: 10,
  },
  historyBubble: {
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  historyTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#721422',
    marginHorizontal: 60,
    marginVertical: 20,
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
  gridContainer: {
    marginBottom: 100,
  },
  row: {
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
});