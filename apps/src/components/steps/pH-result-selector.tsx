import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';

interface PHResultSelectorProps {
  title?: string;
  onPHChange?: (pH: number) => void;
}

export default function PHResultSelector({ title = "Log pH Results", onPHChange }: PHResultSelectorProps) {
  const [selectedPH, setSelectedPH] = useState<number | null>(null);

  const setSelectedPHWithSave = (pH: number) => {
    setSelectedPH(pH);
    onPHChange?.(pH);
  };

  const dynamicStyles = StyleSheet.create({
    resultCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    resultCardTitle: {
      color: '#721422',
    },
    instructionText: {
      fontSize: 16,
      fontFamily: 'Poppins-Regular',
      color: '#721422',
    },
    phOptionSelected: {
      borderColor: '#721422',
      backgroundColor: 'rgba(114, 20, 34, 0.1)',
    },
    phValue: {
      fontSize: 12,
      fontFamily: 'Poppins-SemiBold',
      color: '#721422',
    },
  });

  const pHOptions = [
    { value: 5.4, color: '#087ebe' },
    { value: 4.8, color: '#38828d' },
    { value: 4.6, color: '#3e958d' },
    { value: 4.4, color: '#6fa68f' },
    { value: 3.8, color: '#d2bd7a' },
  ];

  return (
    <View style={[styles.resultCard, dynamicStyles.resultCard]}>
      <Text style={[styles.resultCardTitle, dynamicStyles.resultCardTitle]}>
        {title}
      </Text>
      
      <Text style={[styles.instructionText, dynamicStyles.instructionText]}>
        Refer to the color guide in the kit, and select your pH result:
      </Text>
      
      <View style={styles.phOptionsContainer}>
        {pHOptions.map((option) => (
          <ShrinkableTouchable
            key={option.value}
            style={[
              styles.phOption,
              selectedPH === option.value && dynamicStyles.phOptionSelected
            ] as any}
            onPress={() => setSelectedPHWithSave(option.value)}
          >
            <View style={[styles.phColorBlock, { backgroundColor: option.color }]} />
            <Text style={[styles.phValue, dynamicStyles.phValue]}>{option.value}</Text>
          </ShrinkableTouchable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Main result card container that holds the title and pH selector
   * Uses glassmorphism effect and rounded corners matching other step cards
   */
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 40,
    padding: 20,
    marginHorizontal: 1,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    flexDirection: 'column',
    flex: 1,
    maxHeight: '100%',
    overflow: 'scroll',
  },
  
  /**
   * Title text for the pH result selector card
   * Uses Chunko-Bold font for emphasis, matching other step cards
   */
  resultCardTitle: {
    fontSize: 20,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  /**
   * Instruction text above the pH selector
   * Guides users to refer to the color guide
   */
  instructionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  /**
   * Container for pH option buttons
   * Horizontal layout with equal spacing, centered in card
   */
  phOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    flex: 1,
  },
  
  /**
   * Individual pH option container
   * Contains color block and pH value
   */
  phOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  
  /**
   * Color block showing pH result color
   * Square block with rounded corners
   */
  phColorBlock: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  /**
   * pH value text
   * Centered below color block
   */
  phValue: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
  },
});