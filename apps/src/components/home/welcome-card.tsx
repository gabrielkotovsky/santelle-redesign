import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { Colors } from '../../theme/colors';

import { LogoCrossIcon } from '../icons/svg/LogoCrossIcon';
import { SLogoIcon } from '../icons/svg/SLogoIcon';
import { UserIcon } from '../icons/svg/UserIcon';

interface WelcomeCardProps {
  displayName?: string;
  daysMessage: string;
  healthSummary?: string;
  hasTests: boolean;
  selectedTestResult?: any;
  onViewRecentTestPress: () => void;
  onActivateKitPress: () => void;
  onAccountPress: () => void;
  dataReady: boolean;
}

export default function WelcomeCard({
  displayName,
  daysMessage,
  healthSummary,
  hasTests,
  selectedTestResult,
  onViewRecentTestPress,
  onActivateKitPress,
  onAccountPress,
  dataReady
}: WelcomeCardProps) {  
  // Animation refs for button feedback and welcome card
  const buttonScale = useSharedValue(1);
  const welcomeCardTranslateY = useSharedValue(-200); // Start above screen
  const welcomeCardOpacity = useSharedValue(0);
  const welcomeCardShadowOpacity = useSharedValue(0);

  // Trigger welcome card animation when data is ready
  useEffect(() => {
    if (dataReady) {
      // Small delay to ensure text rendering is complete
      const timer = setTimeout(() => {
        // Start the notification-style animation with a slight bounce
        welcomeCardTranslateY.value = withSpring(0, {
          damping: 100,
          stiffness: 80,
          mass: 1.0,
          overshootClamping: true,
        });
        welcomeCardOpacity.value = withTiming(1, { duration: 100 });
        welcomeCardShadowOpacity.value = withTiming(0.3, { duration: 400 });
      }, 100); // 100ms delay for text rendering

      return () => {
        clearTimeout(timer);
      };
    }
  }, [dataReady]);

  const handleActivateKitPress = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate button press - scale down and back up
    buttonScale.value = withTiming(0.95, { duration: 100 }, () => {
      buttonScale.value = withTiming(1, { duration: 100 });
    });

    // Call the parent handler
    onActivateKitPress();
  };

  const handleViewRecentTestPress = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onViewRecentTestPress();
  };

  const handleAccountPress = () => {
    // Trigger haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onAccountPress();
  };

  // Animated styles for welcome card and button
  const welcomeCardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: welcomeCardTranslateY.value }],
      opacity: welcomeCardOpacity.value,
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const dynamicStyles = StyleSheet.create({
    greetingText: {
      fontSize: 28,
      fontFamily: 'Chunko-Bold',
      color: Colors["light"].rush,
      textAlign: 'left',
      marginBottom: 8,
    },
    daysText: {
      fontSize: 23,
      fontFamily: 'Poppins-SemiBold',
      color: Colors["light"].rush,
      textAlign: 'left',
      marginBottom: 8,
    },
    healthText: {
      fontSize: 23,
      fontFamily: 'Poppins-SemiBold',
      color: Colors["light"].rush,
      textAlign: 'left',
    },
    viewRecentTestButtonText: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginLeft: 8,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#FFFFFF',
      textAlign: 'center',
      marginLeft: 8,
    },
    viewRecentTestButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EF7D88',
      borderRadius: 35,
      padding: 8,
      marginHorizontal: 7.5,
      marginBottom: 10,
      borderWidth: 0,
      shadowColor: 'transparent',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    logTestButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors["light"].rush,
      borderRadius: 35,
      padding: 8,
      marginHorizontal: 7.5,
      marginBottom: 15,
      borderWidth: 0,
      shadowColor: 'transparent',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    glassmorphismCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderTopColor: 'rgba(255, 255, 255, 0.3)',
    },
  });

  return (
    <Animated.View style={[styles.glassmorphismCardContainer, welcomeCardAnimatedStyle]}>
      <BlurView intensity={30} tint="light" style={[styles.glassmorphismCard, dynamicStyles.glassmorphismCard]}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          {/* Logo */}
          <LogoCrossIcon 
            size={30}
            color={Colors["light"].rush}
          />
          
          {/* Account Icon */}
          <ShrinkableTouchable 
            style={styles.accountButton}
            onPress={handleAccountPress}
          >
            <View style={styles.accountIconContainer}>
              <UserIcon 
                size={18} 
                color={Colors["light"].rush} 
              />
            </View>
          </ShrinkableTouchable>
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={dynamicStyles.greetingText}>
            Hello {displayName || 'there'},
          </Text>
          <Text style={dynamicStyles.daysText}>{daysMessage}</Text>
          {hasTests && healthSummary && (
            <Text style={dynamicStyles.healthText}>{healthSummary}</Text>
          )}
        </View>
        
        {/* View Recent Test Button */}
        {hasTests && selectedTestResult && (
          <ShrinkableTouchable 
            style={dynamicStyles.viewRecentTestButton}
            onPress={handleViewRecentTestPress}
            activeOpacity={0.8}
          >
            <Text style={dynamicStyles.viewRecentTestButtonText}>View Latest Test</Text>
          </ShrinkableTouchable>
        )}
        
        {/* Log Test Button with Visual Feedback */}
        <Animated.View style={buttonAnimatedStyle}>
          <ShrinkableTouchable 
            style={dynamicStyles.logTestButton}
            onPress={handleActivateKitPress}
            activeOpacity={1}
          >
            <SLogoIcon 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={dynamicStyles.buttonText}>Activate Kit</Text>
          </ShrinkableTouchable>
        </Animated.View>
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
    padding: 20,
    paddingTop: 400,
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    // Explicitly disable shadows to prevent production rendering issues
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginBottom: 0,
  },
  accountButton: {
    position: 'relative',
    zIndex: 10,
  },
  accountIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  textContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 7.5,
    marginBottom: 0,
  },
});
