import { StyleSheet, View } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';

export default function InsightsScreen() {
  return (
    <ScreenBackground>
      <View style={styles.content}>
        {/* Insights content will go here */}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});