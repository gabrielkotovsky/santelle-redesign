import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { ArticleModal } from '../../src/components/modals/article-modal';
import { useState, useEffect, useCallback } from 'react';
import { ArticleCard } from '@/src/components/home/article-card';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../src/theme/colors';
import { listArticles, type Article } from '@/src/features/articles/articles.api';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay
} from 'react-native-reanimated';

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
      <BlurView intensity={20} style={styles.learnBubble}>
        <Text style={styles.learnTitle}>LEARN</Text>
      </BlurView>
      
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.rush} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.articlesContainer}
        />
      )}

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
    top: 70,
    left: 20,
    right: 20,
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
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
  articlesContainer: {
    paddingHorizontal: 20,
    paddingTop: 135, // Add top padding to account for fixed bubble
    paddingBottom: 90,
  },
});