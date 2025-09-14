import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';

interface WarningModalProps {
  visible: boolean;
  onGoBack: () => void;
  onContinueAnyway: () => void;
}

export default function WarningModal({ visible, onGoBack, onContinueAnyway }: WarningModalProps) {
  if (!visible) return null;

  const dynamicStyles = StyleSheet.create({
    recommendationWarning: {
      fontSize: 32,
      textAlign: 'center',
      marginBottom: 10,
    },
    recommendationTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: '#721422',
      textAlign: 'center',
      marginBottom: 15,
    },
    recommendationText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: '#721422',
      textAlign: 'center',
      marginBottom: 15,
    },
    recommendationListItem: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#721422',
      marginBottom: 8,
    },
  });

  return (
    <View style={styles.modalOverlay}>
      <BlurView intensity={20} tint="light" style={styles.blurBackground} />
      <View style={styles.modalContent}>
        <Text style={[styles.recommendationWarning, dynamicStyles.recommendationWarning]}>⚠️</Text>
        <Text style={[styles.recommendationTitle, dynamicStyles.recommendationTitle]}>Test Not Recommended</Text>
        <Text style={[styles.recommendationText, dynamicStyles.recommendationText]}>
          We recommend waiting until:
        </Text>
        <View style={styles.recommendationList}>
          <Text style={[styles.recommendationListItem, dynamicStyles.recommendationListItem]}>
            Your period has ended
          </Text>
          <Text style={[styles.recommendationListItem, dynamicStyles.recommendationListItem]}>
            24h have passed since you last had sex
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <ShrinkableTouchable style={[styles.modalButton, styles.goBackButton] as any} onPress={onGoBack}>
            <Text style={[styles.modalButtonText, styles.goBackButtonText]}>Go Back</Text>
          </ShrinkableTouchable>
          <ShrinkableTouchable style={[styles.modalButton, styles.continueButton] as any} onPress={onContinueAnyway}>
            <Text style={styles.modalButtonText}>Continue</Text>
          </ShrinkableTouchable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Modal overlay for warning
   * Full screen overlay with semi-transparent background
   */
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  /**
   * Blur background for modal
   * Covers the entire overlay area
   */
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  /**
   * Modal content container
   * Centered modal with glassmorphism effect
   */
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, .5)',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    maxWidth: 350,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.2)',
  },
  
  /**
   * Warning emoji styling
   */
  recommendationWarning: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 10,
  },
  
  /**
   * Modal title styling
   */
  recommendationTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  /**
   * Modal description text
   */
  recommendationText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 15,
  },
  
  /**
   * Container for recommendation list
   */
  recommendationList: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  
  /**
   * Individual recommendation list item
   */
  recommendationListItem: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  /**
   * Container for modal buttons
   */
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    justifyContent: 'center',
  },
  
  /**
   * Base modal button styling
   */
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  
  /**
   * Go Back button styling
   */
  goBackButton: {
    backgroundColor: 'rgba(114, 20, 34, 0.1)',
    borderWidth: 2,
    borderColor: '#721422',
  },
  
  /**
   * Continue Anyway button styling
   */
  continueButton: {
    backgroundColor: '#721422',
  },
  
  /**
   * Modal button text
   */
  modalButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  
  /**
   * Go Back button text
   */
  goBackButtonText: {
    color: '#721422',
  },
});
