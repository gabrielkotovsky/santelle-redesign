import { StyleSheet, Text, View, ScrollView, RefreshControl } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import { LottieRefreshIcon } from '../../src/components/animations/LottieRefreshIcon';
import { useSupabaseRefresh } from '../../src/hooks/useSupabaseRefresh';

export default function InsightsScreen() {
  // Use the Supabase refresh hook
  const { refreshing, onRefresh } = useSupabaseRefresh();

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
        contentContainerStyle={styles.content}
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
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
});