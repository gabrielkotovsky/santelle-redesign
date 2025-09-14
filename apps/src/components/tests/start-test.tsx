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
import { SLogoIcon } from '../icons/svg/SLogoIcon';
import { router } from 'expo-router';

export default function StartTest() {
  // Animation values
  const cardTranslateY = useSharedValue(-200);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Animate component in on mount
  useEffect(() => {
    cardTranslateY.value = withTiming(0, { duration: 1000 });
    cardOpacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const handleStartTest = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate button press
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });

    // Navigate to questionnaire page
    router.push('/log-test/questionnaire');
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

  const dynamicStyles = StyleSheet.create({
    startButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.light.rush,
      borderRadius: 99,
      padding: 8,
      marginHorizontal: 40,
      marginBottom: 20,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginLeft: 8,
    },
    glassmorphismCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
  });

  return (
    <Animated.View style={[styles.glassmorphismCardContainer, cardAnimatedStyle]}>
      <BlurView intensity={30} tint="light" style={[styles.glassmorphismCard, dynamicStyles.glassmorphismCard]}>

        <ShrinkableTouchable style={dynamicStyles.startButton} onPress={handleStartTest}>
            <SLogoIcon 
                size={20} 
                color="#FFFFFF" 
            />
            <Text style={dynamicStyles.buttonText}>Activate Kit</Text>
        </ShrinkableTouchable>

      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  glassmorphismCardContainer: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginHorizontal: 0,
    marginTop: -340,
    marginBottom: 0,
    overflow: 'hidden',
  },
  glassmorphismCard: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingTop: 410,
  },
});
