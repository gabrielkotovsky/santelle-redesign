import { ArticleCard } from '@/src/components/home/article-card';
import { listArticles, type Article } from '@/src/features/articles/articles.api';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, RefreshControl, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { LottieRefreshIcon } from '../../src/components/animations/LottieRefreshIcon';
import { ArticleModal } from '../../src/components/modals/article-modal';
import { Colors } from '../../src/theme/colors';
import { useSupabaseRefresh } from '../../src/hooks/useSupabaseRefresh';

interface AnimatedArticleCardProps {
  title: string;
  description: string;
  image?: string;
  index: number;
  onPress: () => void;
}

const AnimatedArticleCard = ({ title, description, image, index, onPress }: AnimatedArticleCardProps) => {
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

export default function EducationScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedArticles = await listArticles();
      setArticles(fetchedArticles);
    } finally {
      setLoading(false);
    }
  }, []);

  // Custom refresh function for education screen data
  const refreshEducationData = useCallback(async () => {
    await fetchArticles();
  }, [fetchArticles]);

  // Use the Supabase refresh hook
  const { refreshing, onRefresh } = useSupabaseRefresh({
    onRefresh: refreshEducationData,
  });

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openArticle = (article: Article) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(article);
    setArticleModalVisible(true);
  };

  const renderItem = ({ item, index }: { item: Article; index: number }) => {
    return (
      <AnimatedArticleCard
        key={item.id}
        title={item.title}
        description={item.subtitle ?? ''}
        image={item.hero_image_url ?? undefined}
        index={index}
        onPress={() => openArticle(item)}
      />
    );
  };

  return (
    <ScreenBackground>
      {/* Fixed LEARN bubble */}
      <BlurView intensity={20} tint="light" style={styles.learnBubble}>
        <Text style={styles.learnTitle}>LEARN</Text>
      </BlurView>
      
      {/* Loading spinner positioned between LEARN bubble and articles */}
      {(loading || refreshing) && (
        <View style={styles.loadingContainer}>
          <LottieRefreshIcon 
            size={40} 
            isRefreshing={loading || refreshing} 
          />
        </View>
      )}
      
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.articlesContainer}
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
      />

      {selected && (
        <ArticleModal
          visible={articleModalVisible}
          onClose={() => setArticleModalVisible(false)}
          title={selected.title}
          content={selected.content_md}
          image={selected.hero_image_url ?? undefined}
          author={selected.author ?? undefined}
          publishDate={selected.published_at ?? undefined}
          category={selected.category ?? undefined}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  learnBubble: {
    position: 'absolute',
    top: 65,
    left: 20,
    right: 20,
    borderRadius: 99,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 1000,
    overflow: 'hidden',
  },
  learnTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 125, // Position between LEARN bubble (top: 65 + height ~60) and articles (paddingTop: 125)
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  articlesContainer: {
    paddingHorizontal: 20,
    paddingTop: 125, // Add top padding to account for fixed bubble
    paddingBottom: 90,
  },
});