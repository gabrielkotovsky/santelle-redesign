import { StyleSheet, View, Text } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';

export default function InsightsScreen() {
  return (
    <ScreenBackground>
      <View style={styles.content}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
      </View>
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
  comingSoonText: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
});