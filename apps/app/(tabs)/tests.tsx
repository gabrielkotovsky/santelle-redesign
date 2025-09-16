import { ScrollView, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import { ScreenBackground } from '../../src/components/layout/ScreenBackground';
import CurrentTest from '../../src/components/tests/current-test';
import React, { useState, useMemo } from 'react';
import { Colors } from '../../src/theme/colors';
import StartTest from '../../src/components/tests/start-test';
import CompactTest from '../../src/components/tests/compact-test';
import { useRouter } from 'expo-router';
import { useTestSession } from '../../src/features/test-session/testSession.store';

export default function TestsScreen() {
  // Mock data for current test
  const [currentStep] = useState(4);
  const [totalSteps] = useState(8);
  const [timeRemaining] = useState(420); // 7 minutes in seconds
  const [dataReady] = useState(true);

  // Calculate dynamic number of columns based on screen width
  const numColumns = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const cardWidth = 110; // Card width from compact-test component
    const gap = 10; // Gap between cards
    const padding = 20; // Horizontal padding
    
    const availableWidth = screenWidth - padding;
    const columns = Math.floor(availableWidth / (cardWidth + gap));
    
    // Ensure minimum 2 columns and maximum 4 columns
    return Math.max(2, Math.min(4, columns));
  }, []);

  // Mock test history data
  const testHistory = [
    {
      id: '1',
      date: '01-01-2025',
      time: '12:00',
      pH: 4.4,
      H2O2: '-',
      LE: '++',
      SNA: '±',
      betaG: '+',
      NAG: '+',
    },
    {
      id: '2',
      date: '31-12-2024',
      time: '09:30',
      pH: 4.2,
      H2O2: '+',
      LE: '+++',
      SNA: '+',
      betaG: '+',
      NAG: '±',
    },
    {
      id: '3',
      date: '30-12-2024',
      time: '15:45',
      pH: 4.0,
      H2O2: '-',
      LE: '-',
      SNA: '-',
      betaG: '-',
      NAG: '-',
    },
    {
      id: '4',
      date: '29-12-2024',
      time: '11:20',
      pH: 4.6,
      H2O2: '±',
      LE: '+',
      SNA: '+',
      betaG: '+',
      NAG: '+',
    },
    {
      id: '5',
      date: '28-12-2024',
      time: '14:15',
      pH: 4.1,
      H2O2: '-',
      LE: '±',
      SNA: '-',
      betaG: '±',
      NAG: '-',
    },
    {
      id: '6',
      date: '27-12-2024',
      time: '16:30',
      pH: 4.3,
      H2O2: '+',
      LE: '++',
      SNA: '+',
      betaG: '+',
      NAG: '+',
    },
  ];

  const handleResumeTest = () => {
    console.log('Resume test pressed');
    // Navigate to test flow or continue current test
  };

  const handleTestPress = (testId: string) => {
    console.log('Test pressed:', testId);
    // Navigate to test details or open modal
  };

  const renderTestItem = ({ item }: { item: typeof testHistory[0] }) => (
    <CompactTest
      date={item.date}
      time={item.time}
      pH={item.pH}
      H2O2={item.H2O2}
      LE={item.LE}
      SNA={item.SNA}
      betaG={item.betaG}
      NAG={item.NAG}
      onPress={() => handleTestPress(item.id)}
    />
  );


  return (
    <ScreenBackground>
      <ScrollView>
        {/*<CurrentTest
          currentStep={currentStep}
          totalSteps={totalSteps}
          timeRemaining={timeRemaining}
          onResumeTest={handleResumeTest}
          dataReady={dataReady}
        />*/}

        <StartTest />

        <View style={styles.divider} />

        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>HISTORY</Text>
        </View>

        <FlatList
          data={testHistory}
          renderItem={renderTestItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
        />

      </ScrollView>  
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  historySection: {
  },
  historyTitle: {
    fontSize: 25,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 2,
    backgroundColor: '#721422',
    marginHorizontal: 60,
    marginVertical: 20,
  },
  gridContainer: {
    marginBottom: 100,
  },
  row: {
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
});