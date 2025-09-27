import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { ArticleModal } from '../../src/components/modals/article-modal';
import { useState, useEffect, useCallback } from 'react';
import { ArticleCard } from '@/src/components/home/article-card';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../src/theme/colors';
import { listArticles } from '@/src/features/articles/articles.api';

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

  const renderItem = ({ item }: { item: Article }) => {
    return (
      <ArticleCard
        key={item.id}
        title={item.title}
        description={item.subtitle}
        image={item.hero_image_url ?? undefined}
        delay={800}
        onPress={() => openArticle(item)}
      />
    );
  };

  return (
    <ScreenBackground>
      <View style={styles.learnSection}>
        <Text style={styles.learnTitle}>LEARN</Text>
      </View>
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
          image={selected.hero_image_url}
          author={selected.author}
          publishDate={selected.publish_date}
          category={selected.category}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  learnSection: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  learnTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  articlesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    paddingTop: 0,
  },
});