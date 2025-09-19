import React from 'react';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View, TouchableOpacity, ReactNode } from 'react-native';

interface StepCardProps {
  title: string;
  image: ImageSourcePropType;
  description: string[];
  colorScheme?: 'light' | 'dark';
  maxImageHeight?: number;
  maxDescriptionHeight?: number;
  button?: ReactNode;
}

export default function StepCard({ 
  title, 
  image, 
  description,
  colorScheme: propColorScheme,
  maxImageHeight = 300,
  maxDescriptionHeight = 200,
  button
}: StepCardProps) {

  const dynamicStyles = StyleSheet.create({
    stepCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    stepCardTitle: {
      color: '#721422',
    },
    stepDescriptionNumber: {
      color: '#721422',
    },
    stepDescriptionText: {
      color: '#721422',
    },
    stepDescriptionBold: {
      color: '#721422',
    },
  });

  const renderDescription = () => {
    return description.map((step, index) => {
      // Parse markdown-style bold formatting
      const parts = step.split(/(\*\*.*?\*\*)/g);
      
      return (
        <View key={index} style={styles.stepDescriptionRow}>
          <Text style={[styles.stepDescriptionNumber, dynamicStyles.stepDescriptionNumber]}>
            {index + 1}.
          </Text>
          <Text style={[styles.stepDescriptionText, dynamicStyles.stepDescriptionText]}>
            {parts.map((part, partIndex) => {
              const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
              if (boldMatch) {
                return (
                  <Text key={partIndex} style={[styles.stepDescriptionBold, dynamicStyles.stepDescriptionBold]}>
                    {boldMatch[1]}
                  </Text>
                );
              } else {
                return <Text key={partIndex} style={dynamicStyles.stepDescriptionText}>{part}</Text>;
              }
            })}
          </Text>
        </View>
      );
    });
  };

  return (
    <View style={[styles.stepCard, dynamicStyles.stepCard]}>
      <Text style={[styles.stepCardTitle, dynamicStyles.stepCardTitle]}>
        {title}
      </Text>
      
      <View style={styles.stepImageContainer}>
        <Image 
          source={image}
          style={[styles.stepImage, { maxHeight: maxImageHeight }]}
          resizeMode="contain"
        />
      </View>
      <View style={styles.stepDescriptionContainer}>
        {renderDescription()}
      </View>
      {button && (
        <View style={styles.buttonContainer}>
          {button}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Main step card container that holds all step content
   * Uses glassmorphism effect and rounded corners
   */
  stepCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    paddingTop: 40,
    padding: 20,
    marginHorizontal: 1,
    marginBottom: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    flexDirection: 'column',
    flex: 1,
    maxHeight: '100%',
    overflow: 'scroll',
  },
  
  /**
   * Title text for each step card
   * Uses Chunko-Bold font for emphasis
   */
  stepCardTitle: {
    fontSize: 20,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  /**
   * Container for step instruction images
   * Centers the image horizontally with frame border
   */
  stepImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
    flexShrink: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 1)',
    marginHorizontal: 10,
  },
  
  /**
   * Step instruction images
   * Full width with aspect ratio to maintain proportions
   */
  stepImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    maxWidth: '100%',
  },
  
  /**
   * Container for step description content
   * Provides padding around the description list
   */
  stepDescriptionContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    overflow: 'scroll',
  },
  
  /**
   * Individual row in the step description list
   * Contains numbered instruction with text
   */
  stepDescriptionRow: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'flex-start',
  },
  
  /**
   * Number styling for step instructions (1., 2., etc.)
   * Fixed width for alignment
   */
  stepDescriptionNumber: {
    width: 30,
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
  },
  
  /**
   * Main text content for step instructions
   * Flexible width to fill remaining space
   */
  stepDescriptionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    marginBottom: 10,
  },
  
  /**
   * Bold text styling within step descriptions
   * Used for emphasized words in instructions
   */
  stepDescriptionBold: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: 'bold',
  },
  
  /**
   * Container for optional button at the bottom of the step card
   * Provides padding and spacing for the button
   */
  buttonContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
