import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';

interface ResultSelectorProps {
  title?: string;
  onResultsChange?: (results: TestResults) => void;
}

interface TestResults {
  'H₂O₂': string;
  'LE': string;
  'SNA': string;
  'β-G': string;
  'NAG': string;
}

export default function ResultSelector({ title = "Select your results", onResultsChange }: ResultSelectorProps) {
  const [selectedTestResults, setSelectedTestResults] = useState<TestResults>({
    'H₂O₂': '',
    'LE': '',
    'SNA': '',
    'β-G': '',
    'NAG': ''
  });

  const setSelectedTestResultsWithSave = (newResults: TestResults) => {
    setSelectedTestResults(newResults);
    onResultsChange?.(newResults);
  };

  const getTestResultColor = (testType: string, intensity: string): string => {
    const colors = {
      'H₂O₂': { '+': '#fdf7f9', '±': '#fee9f0', '-': '#fdd6db' },
      'LE': { '+++': '#a275a0', '++': '#d18eaf', '+': '#cfaebf', '±': '#d8c9ce', '-': '#f7ecea' },
      'SNA': { '+': '#fbd4e7', '±': '#fcedf2', '-': '#ffffff' },
      'β-G': { '+': '#bde4f3', '±': '#d8f1ed', '-': '#fcfef3' },
      'NAG': { '+': '#ffcbb7', '±': '#fee8da', '-': '#f2e8cd' }
    };
    return colors[testType as keyof typeof colors]?.[intensity as keyof typeof colors[keyof typeof colors]] || '#FFFFFF';
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
    testResultOptionSelected: {
      borderColor: '#721422',
      backgroundColor: 'rgba(114, 20, 34, 0.1)',
    },
    testResultValue: {
      fontSize: 12,
      fontFamily: 'Poppins-SemiBold',
      color: '#721422',
    },
    testResultLabel: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#721422',
    },
  });

  const renderTestResultRow = (testType: keyof TestResults, intensities: string[]) => (
    <View key={testType} style={styles.testResultRow}>
      <View style={styles.testResultOptions}>
        {intensities.map((intensity) => (
          <ShrinkableTouchable
            key={`${testType}-${intensity}`}
            style={[
              styles.testResultOption,
              selectedTestResults[testType] === intensity && dynamicStyles.testResultOptionSelected
            ] as any}
            onPress={() => {
              const newResults = {
                ...selectedTestResults,
                [testType]: intensity
              };
              setSelectedTestResultsWithSave(newResults);
            }}
          >
            <View style={[styles.testResultColor, { backgroundColor: getTestResultColor(testType, intensity) }]} />
            <Text style={[styles.testResultValue, dynamicStyles.testResultValue]}>{intensity}</Text>
          </ShrinkableTouchable>
        ))}
      </View>
      <Text style={[styles.testResultLabel, dynamicStyles.testResultLabel]}>{testType}</Text>
    </View>
  );

  return (
    <View style={[styles.resultCard, dynamicStyles.resultCard]}>
      <Text style={[styles.resultCardTitle, dynamicStyles.resultCardTitle]}>
        {title}
      </Text>
      
      <Text style={[styles.instructionText, dynamicStyles.instructionText]}>
        Refer to the color guide in the kit, and select your final test results:
      </Text>
      
      <View style={styles.testResultsGrid}>
        {renderTestResultRow('H₂O₂', ['+', '±', '-'])}
        {renderTestResultRow('LE', ['+++', '++', '+', '±', '-'])}
        {renderTestResultRow('SNA', ['+', '±', '-'])}
        {renderTestResultRow('β-G', ['+', '±', '-'])}
        {renderTestResultRow('NAG', ['+', '±', '-'])}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * Main result card container that holds the title and selector
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
   * Title text for the result selector card
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
   * Instruction text above the result selector
   * Guides users to refer to the color guide
   */
  instructionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  /**
   * Grid container for test result selection
   * Full width container for the selection grid, centered in card
   */
  testResultsGrid: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
  },
  
  /**
   * Individual row for each test type (H₂O₂, LE, SNA, etc.)
   * Horizontal layout with label on left, options on right
   */
  testResultRow: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  
  /**
   * Test type label (H₂O₂, LE, SNA, β-G, NAG)
   * Fixed width for consistent alignment
   */
  testResultLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    width: 60,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  
  /**
   * Container for test result intensity options (+, ±, -)
   * Horizontal layout aligned to the right
   */
  testResultOptions: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginRight: 15,
  },
  
  /**
   * Individual test result option container
   * Contains color block and intensity symbol
   */
  testResultOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    marginLeft: 8,
  },
  
  /**
   * Color block showing test result color
   * Square block with rounded corners
   */
  testResultColor: {
    width: 30,
    height: 30,
    borderRadius: 6,
    marginBottom: 6,
    borderWidth: 0,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  
  /**
   * Test result intensity symbol (+, ±, -)
   * Centered below color block
   */
  testResultValue: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    textAlign: 'center',
  },
});