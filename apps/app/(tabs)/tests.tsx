import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import CurrentTest from '../../src/components/tests/current-test';
import React, { useState } from 'react';
import { Colors } from '@/src/theme/colors';

export default function TestsScreen() {
  // Mock data for current test
  const [currentStep] = useState(4);
  const [totalSteps] = useState(8);
  const [timeRemaining] = useState(420); // 7 minutes in seconds
  const [dataReady] = useState(true);

  const handleResumeTest = () => {
    console.log('Resume test pressed');
    // Navigate to test flow or continue current test
  };

  return (
    <ScreenBackground>

      <ScrollView>

        <CurrentTest
          currentStep={currentStep}
          totalSteps={totalSteps}
          timeRemaining={timeRemaining}
          onResumeTest={handleResumeTest}
          dataReady={dataReady}
        />

        <View style={styles.divider} />

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>HISTORY</Text>
        </View>

      </ScrollView>  

    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  historySection: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  historyTitle: {
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  divider: {
    height: 2,
    backgroundColor: '#721422',
    marginHorizontal: 60,
    marginVertical: 20,
  },
});