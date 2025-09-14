import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TestTimerCardProps {
  timeRemaining: number;
  onSkip: () => void;
}

export default function TestTimerCard({ timeRemaining, onSkip }: TestTimerCardProps) {
  return (
    <View style={styles.timerContainer}>
      <Text style={styles.timerTitle}>Waiting for test results...</Text>
      <Text style={styles.timerText}>
        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
      </Text>
      <Text style={styles.timerSubtext}>Please wait before proceeding to step 7</Text>
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    padding: 40,
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
  },
  timerTitle: {
    fontSize: 24,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 10,
  },
  timerSubtext: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
  },
  skipButton: {
    backgroundColor: 'rgba(114, 20, 34, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
