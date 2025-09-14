import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';

// Interface for the test result data
interface CompactTestProps {
  date: string;
  time: string;
  pH: number;
  H2O2: string;
  LE: string;
  SNA: string;
  betaG: string;
  NAG: string;
  onPress?: () => void;
}

export default function CompactTest({
  date,
  time,
  pH,
  H2O2,
  LE,
  SNA,
  betaG,
  NAG,
  onPress
}: CompactTestProps) {
  // Animation values
  const cardTranslateY = useSharedValue(-100);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Animate component in on mount
  useEffect(() => {
    cardTranslateY.value = withTiming(0, { duration: 600 });
    cardOpacity.value = withTiming(1, { duration: 600 });
  }, []);

  const handlePress = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate button press
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });

    // Call the parent handler if provided
    if (onPress) {
      onPress();
    }
  };

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: cardTranslateY.value }],
      opacity: cardOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const getBiomarkerStatus = (value: string, biomarker: string) => {
    switch (biomarker) {
      case 'H₂O₂':
        switch (value) {
          case '-':
            return { color: '#4CAF50' };
          case '±':
            return { color: '#FF9800' };
          case '+':
            return { color: '#F44336' };
          default:
            return { color: '#721422' };
        }
      case 'LE':
        switch (value) {
          case '-':
          case '±':
            return { color: '#4CAF50' };
          case '+':
          case '++':
          case '+++':
            return { color: '#F44336' };
          default:
            return { color: '#721422' };
        }
      case 'SNA':
        switch (value) {
          case '-':
            return { color: '#4CAF50' };
          case '±':
            return { color: '#FF9800' };
          case '+':
            return { color: '#F44336' };
          default:
            return { color: '#721422' };
        }
      case 'β-G':
        switch (value) {
          case '-':
            return { color: '#4CAF50' };
          case '±':
            return { color: '#FF9800' };
          case '+':
            return { color: '#F44336' };
          default:
            return { color: '#721422' };
        }
      case 'NAG':
        switch (value) {
          case '-':
            return { color: '#4CAF50' };
          case '±':
            return { color: '#FF9800' };
          case '+':
            return { color: '#F44336' };
          default:
            return { color: '#721422' };
        }
      default:
        return { color: '#721422' };
    }
  };

  const getPHStatus = (pH: number) => {
    if (pH >= 3.8 && pH <= 4.4) {
      return { color: '#4CAF50' };
    } else if (pH > 4.4) {
      return { color: '#F44336' };
    }
    return { color: '#721422' };
  };

  const dynamicStyles = StyleSheet.create({
    glassmorphismCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
  });

  return (
    <ShrinkableTouchable onPress={handlePress} style={styles.clickableCard}>
    <Animated.View style={[styles.resultCardContainer, cardAnimatedStyle]}>
 
        <BlurView intensity={30} tint="light" style={styles.resultCard}>
          
          {/* Date and Time Header */}
          <View style={styles.dateTimeSection}>
            <Text style={styles.resultDate}>{date}</Text>
            <Text style={styles.resultTime}>{time}</Text>
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* Test Results */}
          <View style={styles.testResultsContainer}>
            <View style={[styles.testResultItem, { backgroundColor: getPHStatus(pH).color + '20' }]}>
              <Text style={styles.testLabel}>pH</Text>
              <Text style={[styles.testValue, getPHStatus(pH)]}>{pH}</Text>
            </View>
            
            <View style={[styles.testResultItem, { backgroundColor: getBiomarkerStatus(H2O2, 'H₂O₂').color + '20' }]}>
              <Text style={styles.testLabel}>H₂O₂</Text>
              <Text style={[styles.testValue, getBiomarkerStatus(H2O2, 'H₂O₂')]}>{H2O2}</Text>
            </View>
            
            <View style={[styles.testResultItem, { backgroundColor: getBiomarkerStatus(LE, 'LE').color + '20' }]}>
              <Text style={styles.testLabel}>LE</Text>
              <Text style={[styles.testValue, getBiomarkerStatus(LE, 'LE')]}>{LE}</Text>
            </View>
            
            <View style={[styles.testResultItem, { backgroundColor: getBiomarkerStatus(SNA, 'SNA').color + '20' }]}>
              <Text style={styles.testLabel}>SNA</Text>
              <Text style={[styles.testValue, getBiomarkerStatus(SNA, 'SNA')]}>{SNA}</Text>
            </View>
            
            <View style={[styles.testResultItem, { backgroundColor: getBiomarkerStatus(betaG, 'β-G').color + '20' }]}>
              <Text style={styles.testLabel}>β-G</Text>
              <Text style={[styles.testValue, getBiomarkerStatus(betaG, 'β-G')]}>{betaG}</Text>
            </View>
            
            <View style={[styles.testResultItem, { backgroundColor: getBiomarkerStatus(NAG, 'NAG').color + '20' }]}>
              <Text style={styles.testLabel}>NAG</Text>
              <Text style={[styles.testValue, getBiomarkerStatus(NAG, 'NAG')]}>{NAG}</Text>
            </View>
          </View>

        </BlurView>
      
    </Animated.View>
    </ShrinkableTouchable>
  );
}

const styles = StyleSheet.create({
  resultCardContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    width: 110,
    backgroundColor: 'rgba(255, 255, 255, 0.57)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    marginHorizontal: 0,
    marginVertical: 0,
  },
  clickableCard: {
    flex: 1,
  },
  resultCard: {
    borderRadius: 15,
    paddingHorizontal: 0,
    paddingTop: 10,
    paddingBottom: 0,
  },
  dateTimeSection: {
    alignItems: 'center',
  },
  resultTime: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultDate: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 0,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#721422',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  testResultsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  testResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 6,
  },
  testLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
  testValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
  resultPH: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
});