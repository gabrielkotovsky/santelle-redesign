import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface ProgressCardProps {
  currentStep: number;
  totalSteps: number;
  colorScheme?: 'light' | 'dark';
}

export default function ProgressCard({ 
  currentStep, 
  totalSteps,
}: ProgressCardProps) {

  const dynamicStyles = StyleSheet.create({
    progressLine: {
      backgroundColor: '#721422',
      position: 'absolute',
      top: 17.5, // Center of 25px circle (25/2 = 12.5)
      left: 10,
      right: 10,
      height: 2,
      zIndex: 1,
    },
    progressCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      paddingTop: Platform.OS === 'android' ? 30 : 60,
    },
    step: {
      alignItems: 'center',
      zIndex: 2,
    },
    stepDot: {
      width: 25,
      height: 25,
      borderRadius: 999,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderColor: '#721422',
    },
    stepNumber: {
      fontSize: 14,
      fontFamily: 'Poppins-SemiBold',
      color: '#721422',
      textAlign: 'center',
    },
    stepDotCompleted: {
      backgroundColor: '#721422',
      borderColor: '#721422',
    },
    stepNumberCompleted: {
      color: '#FFFFFF',
    },
    stepDotCurrent: {
      backgroundColor: '#EF7D88',
      borderColor: '#721422',
    },
    stepNumberCurrent: {
      color: '#FFFFFF',
    },
  });

  // Generate step components dynamically
  const renderSteps = () => {
    const steps = [];
    for (let i = 1; i <= totalSteps; i++) {
      const isCompleted = currentStep >= i;
      const isCurrent = currentStep === i;
      
      steps.push(
        <View key={i} style={dynamicStyles.step}>
          <View style={[
            dynamicStyles.stepDot,
            isCompleted && dynamicStyles.stepDotCompleted,
            isCurrent && dynamicStyles.stepDotCurrent
          ]}>
            <Text style={[
              dynamicStyles.stepNumber,
              isCompleted && dynamicStyles.stepNumberCompleted,
              isCurrent && dynamicStyles.stepNumberCurrent
            ]}>{i}</Text>
          </View>
        </View>
      );
    }
    return steps;
  };

  return (
    <View style={[styles.progressCard, dynamicStyles.progressCard]}>
      <View style={styles.progressContainer}>
        <View style={dynamicStyles.progressLine} />
        <View style={styles.stepsContainer}>
          {renderSteps()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 30,
    padding: 10,
    paddingTop: 60,
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
  },
  progressContainer: {
    position: 'relative',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});
