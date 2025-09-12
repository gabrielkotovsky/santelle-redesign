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

interface CurrentTestProps {
  currentStep: number;
  totalSteps: number;
  timeRemaining: number; // in seconds
  onResumeTest: () => void;
  dataReady: boolean;
}

export default function CurrentTest({
  currentStep,
  totalSteps,
  timeRemaining,
  onResumeTest,
  dataReady
}: CurrentTestProps) {
  // Animation values
  const cardTranslateY = useSharedValue(-200);
  const cardOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Timer state
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Trigger animation when data is ready
  useEffect(() => {
    if (dataReady) {
      const timer = setTimeout(() => {
        cardTranslateY.value = withSpring(0, {
          damping: 100,
          stiffness: 80,
          mass: 1.0,
          overshootClamping: true,
        });
        cardOpacity.value = withTiming(1, { duration: 100 });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [dataReady]);

  // Update timer display
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayTime(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleResumeTest = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate button press
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });

    // Call the parent handler
    onResumeTest();
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
    timerText: {
      fontSize: 50,
      fontFamily: 'Poppins-Medium',
      color: Colors.light.rush,
      textAlign: 'center',
      marginBottom: 10,
    },
    stepText: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: Colors.light.rush,
      textAlign: 'center',
      marginBottom: 10,
      marginTop: 30,
    },
    progressBar: {
      height: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 4,
      marginBottom: 20,
      marginHorizontal: 20,
      borderWidth: .5,
      borderColor: '#721422',
    },
    progressFill: {
      height: '100%',
      backgroundColor: Colors.light.rush,
      borderRadius: 4,
      width: `${progressPercentage}%`,
    },
    resumeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.light.rush,
      borderRadius: 99,
      padding: 10,
      marginHorizontal: 40,
      marginBottom: 30,
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

        <Text style={dynamicStyles.stepText}>
            Step {currentStep} of {totalSteps}
        </Text>

        <View style={styles.progressContainer}> 
          <View style={dynamicStyles.progressBar}>
            <View style={dynamicStyles.progressFill} />
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={dynamicStyles.timerText}>
            {formatTime(displayTime)}
          </Text>
        </View>

        <ShrinkableTouchable style={dynamicStyles.resumeButton} onPress={handleResumeTest}>
            <SLogoIcon 
                size={20} 
                color="#FFFFFF" 
            />
            <Text style={dynamicStyles.buttonText}>Resume Test</Text>
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
    paddingTop: 380,
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 7.5,
    marginBottom: 0,
  },
  progressContainer: {
    paddingHorizontal: 7.5,
    marginBottom: 0,
  },
});
