// 246 lines

import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay
} from 'react-native-reanimated';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { LottieRefreshIcon } from '../../src/components/animations/LottieRefreshIcon';
import WelcomeCard from '../../src/components/home/welcome-card';
import React, { useCallback, useEffect, useState } from 'react';
import { ArticleCard } from '../../src/components/home/article-card';
import * as Haptics from 'expo-haptics';
import { ArticleModal } from '../../src/components/modals/article-modal';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTestSession } from '../../src/features/test-session/testSession.store';
import { fetchLatestTestLog, type TestLog } from '../../src/features/test-logs/testLogs.api';
import TestLogModal from '../../src/components/modals/test-result';
import { buildWelcomeCopy } from '../../src/features/test-logs/welcomeCopy';

// utils local to this screen
function daysSince(dateStr?: string | null) {
  if (!dateStr) return null;
  const testTime = new Date(dateStr).getTime();
  if (Number.isNaN(testTime)) return null;
  const now = Date.now();
  const msPerDay = 24 * 60 * 60 * 1000;
  // floor to whole days; never negative
  return Math.max(0, Math.floor((now - testTime) / msPerDay));
}

function extractSummary(text?: string | null) {
  if (!text) return null;

  // normalize line endings
  const s = text.replace(/\r/g, "");

  // match lines like:
  // "Summary: ..." OR "# Summary: ..." OR "### Summary: ..." OR "- Summary: ..."
  const re = /(^|\n)\s{0,3}(?:[-*]\s*)?(?:#{1,6}\s*)?summary\s*:\s*(.+?)(?=\n{2,}|$)/gi;

  const all = [...s.matchAll(re)];
  if (all.length === 0) return null;

  // take the last Summary line if there are multiple
  const last = all[all.length - 1][2]
    .replace(/\*\*|__/g, "")   // strip simple bold markdown
    .trim();

  return last || null;
}

interface AnimatedArticleCardProps {
  title: string;
  description: string;
  image?: any;
  onPress: () => void;
  index: number;
}

const AnimatedArticleCard = ({ title, description, image, onPress, index }: AnimatedArticleCardProps) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    // Staggered animation - each card appears with a delay
    const delay = index * 100; // 100ms delay between each card
    
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
      <ArticleCard
        title={title}
        description={description}
        image={image}
        onPress={onPress}
      />
    </Animated.View>
  );
};

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [latestTestLog, setLatestTestLog] = useState<TestLog | null>(null);
  const router = useRouter();
  const session = useTestSession(s => s.session);
  const hydrateFromServer = useTestSession(s => s.hydrateFromServer);

  useEffect(() => {
    hydrateFromServer();
    loadLatestTest();
  }, [hydrateFromServer]);
  
  useFocusEffect(useCallback(() => {
    hydrateFromServer();
    loadLatestTest();
  }, [hydrateFromServer]));

  const loadLatestTest = async () => {
    try {
      const latestTest = await fetchLatestTestLog();
      setLatestTestLog(latestTest);
    } catch (error) {
      // Handle error silently
    }
  };
  const hasActive = !!session && session.status === 'in_progress';
  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };
  const handleViewRecentTestPress = () => {
    if (latestTestLog) {
      setTestModalVisible(true);
    }
  };
  const handleActivateKitPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/log-test/questionnaire');
  };
  const handleResumeTestPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/log-test/test');
  };
  const handleAccountPress = () => {
    // Navigate to account/profile screen
  };

  const days = daysSince(latestTestLog?.created_at);
  const daysMessage = days == null
    ? "Take your first test to get started!"
    : days === 0
      ? "Your last test was today!"
      : days === 1
        ? "It's been 1 day since your last test."
        : `It's been ${days} days since your last test.`;
  
  const healthSummary = extractSummary(latestTestLog?.analysis) || "Your health summary will appear here after analysis.";

  return (
    <ScreenBackground>
      {refreshing && (
          <View style={styles.refreshIconContainer}>
            <LottieRefreshIcon 
              size={40} 
              isRefreshing={refreshing} 
            />
          </View>
        )}
        
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={true}

          // Refresh control
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor="transparent"
              colors={["transparent"]}
              progressViewOffset={0}
              progressBackgroundColor="transparent"
              style={{ backgroundColor: 'transparent' }}
            />
          }
        >
          <WelcomeCard 
            displayName={"Gabriel"}
            daysMessage={daysMessage}
            healthSummary={healthSummary}
            hasTests={!!latestTestLog}
            selectedTestResult={latestTestLog ? { id: latestTestLog.id, result: 'positive' } : undefined}
            hasActiveSession={hasActive}
            onResumeTestPress={handleResumeTestPress}
            onViewRecentTestPress={handleViewRecentTestPress}
            onActivateKitPress={handleActivateKitPress}
            onAccountPress={handleAccountPress}
            dataReady={true}
          />
          
          <View style={[styles.divider]} />

          <View style={styles.articlesContainer}>
            <AnimatedArticleCard
              title="Learn about your biomarkers"
              description="Understand how to interpret each of your biomarkers."
              image={require('@/assets/images/fig.png')}
              index={0}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setArticleModalVisible(true);
              }}
            />
          </View>


          <ArticleModal
          visible={articleModalVisible}
          onClose={() => setArticleModalVisible(false)}
          title="Learn about your biomarkers"
          content={`### Potential Hydrogen
**pH** measures how acidic your vagina is. A healthy vagina is slightly acidic, which helps block infections. When pH rises, it usually means unwanted bacteria or parasites are taking over.

### Hydrogen Peroxide
**H₂O₂** measures the natural protection made by good bacteria (lactobacilli). If levels are low, it means those “bodyguard” bacteria aren’t keeping balance as they should.

### Leukocyte Esterase 
**LE** measures white blood cell activity. These are your body’s natural helpers, and higher activity can show they’re responding to something.

### Sialidase
**SNA** measures an enzyme linked to bacteria that cause BV (bacterial vaginosis). Its presence can point to BV being the reason for your symptoms.

### Beta-Glucuronidase
**β-G** measures an enzyme linked to bacterial or yeast overgrowth. It highlights when “too much of the wrong microbes” are present.

### N-acetyl-β-D-glucosaminidase
**NAG** measures signs of gentle irritation in the vaginal lining, helping spot when your tissue is under stress.`}
          image={require('@/assets/images/fig1.png')}
          author="Santelle Health Team"
          publishDate="December 2024"
          category="Health Education"
        />
          
        </ScrollView>
        
        <TestLogModal
          visible={testModalVisible}
          onClose={() => setTestModalVisible(false)}
          log={latestTestLog}
        />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  refreshIconContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 0,
  },
  divider: {
    height: 2,
    backgroundColor: '#721422',
    marginHorizontal: 60,
    marginVertical: 20,
  },
  articlesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    paddingTop: 0,
  },
});