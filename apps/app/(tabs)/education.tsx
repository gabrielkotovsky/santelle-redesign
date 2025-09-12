import { StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { ScrollView } from 'react-native';
import { ArticleModal } from '../../src/components/modals/article-modal';
import { useState } from 'react';
import { ArticleCard } from '@/src/components/home/article-card';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../src/theme/colors';

export default function EducationScreen() {
  const [articleModalVisible, setArticleModalVisible] = useState(false);

  return (
    <ScreenBackground>
      
      <ScrollView>
        <View style={styles.learnSection}>
          <Text style={styles.learnTitle}>LEARN</Text>
        </View>

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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  learnSection: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
  },
  learnTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  articlesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
});