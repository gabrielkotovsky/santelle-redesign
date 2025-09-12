import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { LottieRefreshIcon } from '../../src/components/animations/LottieRefreshIcon';
import WelcomeCard from '../../src/components/home/welcome-card';
import React, { useState } from 'react';
import { ArticleCard } from '../../src/components/home/article-card';
import * as Haptics from 'expo-haptics';
import { ArticleModal } from '../../src/components/modals/article-modal';


export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  const [articleModalVisible, setArticleModalVisible] = useState(false);


  const handleScroll = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // await loadTestData();
      // Add any other refresh logic here
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };
  const handleViewRecentTestPress = () => {
    console.log('View recent test pressed');
    // Navigate to test results or modal
  };
  const handleActivateKitPress = () => {
    console.log('Activate kit pressed');
    // Navigate to test activation flow
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
              onRefresh={onRefresh}
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
            hasTests={true}
            selectedTestResult={true ? { id: 1, result: 'positive' } : undefined}
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
