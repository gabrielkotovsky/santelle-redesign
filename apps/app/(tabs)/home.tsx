import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
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
      console.error('Error fetching latest test:', error);
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
    console.log('Account pressed');
    // Navigate to account/profile screen
  };

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
            daysMessage={"It's been 3 days since your last test"}
            healthSummary={"Your health is looking great!"}
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
            <ArticleCard
              title="Learn about your biomarkers"
              description="Understand how to interpret each of your biomarkers."
              image={require('@/assets/images/fig.png')}
              delay={800}
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
    paddingBottom: 75,
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
    paddingBottom: 20,
    paddingTop: 0,
  },
});
