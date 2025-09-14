import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SmallTimerCardProps {
  timeRemaining: number;
}

export default function SmallTimerCard({ timeRemaining }: SmallTimerCardProps) {
  return (
    <View style={styles.smallTimerCard}>
      <Text style={styles.smallTimerTitle}>Results will be ready in...</Text>
      <Text style={styles.smallTimerText}>
        {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  smallTimerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    height: 100,
    alignItems: 'center',
  },
  smallTimerTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    textAlign: 'center',
  },
  smallTimerText: {
    fontSize: 40,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
  },
});
