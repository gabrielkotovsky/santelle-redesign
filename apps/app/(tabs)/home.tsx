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
import { listArticles, type Article } from '../../src/features/articles/articles.api';
import TestLogModal from '../../src/components/modals/test-result';
import { useAuth } from '../../src/features/auth/auth.store';
import { getUserDisplayName } from '../../src/features/auth/auth.api';
import { useSupabaseRefresh } from '../../src/hooks/useSupabaseRefresh';
import { useTranslations } from '../../src/i18n';

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
  const scrollY = useSharedValue(0);
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);
  const [testModalVisible, setTestModalVisible] = useState(false);
  const [latestTestLog, setLatestTestLog] = useState<TestLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const router = useRouter();
  const { t, lang } = useTranslations();
  const session = useTestSession(s => s.session);
  const hydrateFromServer = useTestSession(s => s.hydrateFromServer);
  const { user } = useAuth();

  const loadFeaturedArticle = useCallback(async () => {
    try {
      const articles = await listArticles({ limit: 1, locale: lang });
      setFeaturedArticle(articles[0] ?? null);
    } catch {
      setFeaturedArticle(null);
    }
  }, [lang]);

  // Custom refresh function for home screen data
  const refreshHomeData = useCallback(async () => {
    await Promise.all([
      hydrateFromServer(),
      loadLatestTest(),
      loadDisplayName(),
      loadFeaturedArticle()
    ]);
  }, [hydrateFromServer, loadFeaturedArticle]);

  // Use the Supabase refresh hook
  const { refreshing, onRefresh } = useSupabaseRefresh({
    onRefresh: refreshHomeData,
  });

  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      await Promise.all([
        hydrateFromServer(),
        loadLatestTest(),
        loadDisplayName(),
        loadFeaturedArticle()
      ]);
      setIsLoading(false);
    };
    initData();
  }, [hydrateFromServer, loadFeaturedArticle]);
  
  useFocusEffect(useCallback(() => {
    const refreshData = async () => {
      await Promise.all([
        hydrateFromServer(),
        loadLatestTest(),
        loadDisplayName(),
        loadFeaturedArticle()
      ]);
    };
    refreshData();
  }, [hydrateFromServer, loadFeaturedArticle]));

  const loadLatestTest = async () => {
    try {
      const latestTest = await fetchLatestTestLog();
      setLatestTestLog(latestTest);
    } catch (error) {
      // Silently handle error
    }
  };

  const loadDisplayName = async () => {
    try {
      if (user?.id) {
        const name = await getUserDisplayName(user.id);
        setDisplayName(name);
      }
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
    ? t.welcomeFirstTest
    : days === 0
      ? t.welcomeToday
      : days === 1
        ? t.welcomeDaysOne
        : typeof t.welcomeDays === 'function' ? t.welcomeDays(days) : `It's been ${days} days since your last test.`;

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
              onRefresh={onRefresh}
              tintColor="transparent"
              colors={["transparent"]}
              progressViewOffset={0}
              progressBackgroundColor="transparent"
              style={{ backgroundColor: 'transparent' }}
            />
          }
        >
          {!isLoading && (
            <>
              <WelcomeCard 
                displayName={displayName || undefined}
                daysMessage={daysMessage}
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

              {featuredArticle && (
                <View style={styles.articlesContainer}>
                  <AnimatedArticleCard
                    title={featuredArticle.title}
                    description={featuredArticle.subtitle ?? t.learnBiomarkersDesc}
                    image={featuredArticle.hero_image_url ?? undefined}
                    index={0}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setArticleModalVisible(true);
                    }}
                  />
                </View>
              )}
            </>
          )}


          {featuredArticle && (
            <ArticleModal
              visible={articleModalVisible}
              onClose={() => setArticleModalVisible(false)}
              title={featuredArticle.title}
              content={featuredArticle.content_md}
              image={featuredArticle.hero_image_url ?? undefined}
              author={featuredArticle.author ?? undefined}
              publishDate={featuredArticle.published_at ?? undefined}
              category={featuredArticle.category ?? undefined}
            />
          )}
          
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