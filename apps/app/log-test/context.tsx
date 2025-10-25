import React, { useState, useEffect, useRef } from 'react';
import { 
  Alert,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import { router } from 'expo-router';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { ArrowLeftIcon } from '@/src/components/icons/svg/ArrowLeftIcon';

// Types for our questionnaire data
interface PreTestAnswers {
  symptoms: string[];
  symptomOnset: string | null;
  dischargeColor: string | null;
  dischargeOdor: string | null;
  recentFactors: string[];
  cyclePosition: string | null;
  isPregnant: string | null;
  hasFeverOrPain: string | null;
}

const SYMPTOMS_OPTIONS = [
  { id: 'itching', label: '✋ Itching or irritation' },
  { id: 'burning', label: '🚽🔥 Burning when peeing' },
  { id: 'discharge', label: '💧 Unusual discharge' },
  { id: 'odor', label: '👃 Unusual odor' },
  { id: 'pain-sex', label: '❤️‍🔥 Pain during sex' },
  { id: 'pelvic-pain', label: '💢 Pelvic or lower belly pain' },
];

const SYMPTOM_ONSET_OPTIONS = [
  { id: 'today', label: '🌞 Today' },
  { id: '1-3-days', label: '⏳ 1–3 days ago' },
  { id: '4-7-days', label: '📆 4–7 days ago' },
  { id: 'more-week', label: '🕰️ More than 1 week ago' },
];

const DISCHARGE_COLOR_OPTIONS = [
  { id: 'clear', label: '💎 Clear' },
  { id: 'white-thick', label: '🥛 White and thick' },
  { id: 'gray', label: '🌫️ Gray' },
  { id: 'yellow-green', label: '🧃 Yellow-green' },
  { id: 'bloody', label: '🩸 Bloody' },
];

const DISCHARGE_ODOR_OPTIONS = [
  { id: 'no-smell', label: '🌸 No unusual smell' },
  { id: 'fishy', label: '🐠 Fishy smell (sharp, unpleasant, stronger after sex or during period)' },
  { id: 'yeasty', label: '🥐 Yeasty smell (like bread or beer)' },
  { id: 'strong-unpleasant', label: '💨😖 Strong unpleasant smell (rotten, sour)' },
  { id: 'other', label: '🤔 Other / not sure' },
];

const RECENT_FACTORS_OPTIONS = [
  { id: 'antibiotics', label: '💊 I recently took antibiotics' },
  { id: 'sick', label: '🤒 I\'ve been sick (cold, flu, or other illness)' },
  { id: 'wet-clothing', label: '👙 I wore a wet swimsuit or tight sportswear for hours' },
  { id: 'unprotected-sex', label: '💋 I had unprotected sex or a new partner' },
  { id: 'stress', label: '🧠💭 I\'ve been under high stress or sleeping poorly' },
  { id: 'vaginal-wash', label: '🫧 I used a vaginal wash, wipes, or scented soap' },
  { id: 'routine-change', label: '🌍✈️ I recently traveled or my routine changed' },
];

const CYCLE_POSITION_OPTIONS = [
  { id: 'after-period', label: '🌹 Just after period' },
  { id: 'mid-cycle', label: '🌼 Mid-cycle' },
  { id: 'before-period', label: '🌧️ Just before period' },
  { id: 'not-sure', label: '🤷‍♀️ Not sure / irregular / not applicable' },
];

interface AnimatedOptionProps {
  option: { id: string; label: string };
  isSelected: boolean;
  onPress: () => void;
  multiline?: boolean;
}

function AnimatedOption({ option, isSelected, onPress, multiline = false }: AnimatedOptionProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isSelected]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={({ pressed }) => [
          styles.optionButton,
          isSelected && styles.optionButtonSelected,
          pressed && { opacity: 0.8 }
        ]}
        onPress={onPress}
      >
        <Text style={[
          styles.optionTitle,
          multiline && styles.optionTitleMultiline,
          isSelected && styles.optionTitleSelected
        ]}>
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function PreTestQuestions() {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<PreTestAnswers>({
    symptoms: [],
    symptomOnset: null,
    dischargeColor: null,
    dischargeOdor: null,
    recentFactors: [],
    cyclePosition: null,
    isPregnant: null,
    hasFeverOrPain: null,
  });

  const toggleMultiSelect = (key: 'symptoms' | 'recentFactors', id: string) => {
    setAnswers(prev => ({
      ...prev,
      [key]: prev[key].includes(id) 
        ? prev[key].filter(item => item !== id)
        : [...prev[key], id]
    }));
  };

  const setSingleSelect = (key: keyof PreTestAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    // Check if current page has required answers
    if (currentPage === 0) {
      if (answers.symptoms.length === 0) {
        Alert.alert('Required', 'Please select at least one symptom');
        return;
      }
      if (!answers.symptomOnset) {
        Alert.alert('Required', 'Please indicate when symptoms started');
        return;
      }
    } else if (currentPage === 2) {
      if (!answers.cyclePosition) {
        Alert.alert('Required', 'Please indicate where you are in your cycle');
        return;
      }
      if (!answers.isPregnant) {
        Alert.alert('Required', 'Please answer the pregnancy question');
        return;
      }
    } else if (currentPage === 3) {
      if (!answers.hasFeverOrPain) {
        Alert.alert('Required', 'Please answer the severity question');
        return;
      }
    }

    if (currentPage < 3) {
      setCurrentPage(prev => prev + 1);
    } else {
      // All done - proceed to test
      router.replace('/log-test/test');
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    } else {
      router.back();
    }
  };

  const canContinue = () => {
    switch (currentPage) {
      case 0: return answers.symptoms.length > 0 && answers.symptomOnset !== null;
      case 1: return true; // Recent factors is optional
      case 2: return answers.cyclePosition !== null && answers.isPregnant !== null;
      case 3: return answers.hasFeverOrPain !== null;
      default: return false;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return renderSymptomsPage();
      case 1:
        return renderRecentFactorsPage();
      case 2:
        return renderCycleHormonalPage();
      case 3:
        return renderSeverityPage();
      default:
        return null;
    }
  };

  const renderSymptomsPage = () => (
    <>
      <View style={styles.headerSection}>
        <LogoCrossIcon size={60} color="#721422" />
        <Text style={styles.title}>What are your main symptoms right now?</Text>
        <Text style={styles.subtitle}>Page 1 of 4 • Select all that apply</Text>
      </View>

      <View style={styles.optionsContainer}>
        {SYMPTOMS_OPTIONS.map((option) => (
          <AnimatedOption
            key={option.id}
            option={option}
            isSelected={answers.symptoms.includes(option.id)}
            onPress={() => toggleMultiSelect('symptoms', option.id)}
          />
        ))}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>When did these symptoms start?</Text>
      <View style={styles.optionsContainer}>
        {SYMPTOM_ONSET_OPTIONS.map((option) => (
          <AnimatedOption
            key={option.id}
            option={option}
            isSelected={answers.symptomOnset === option.id}
            onPress={() => setSingleSelect('symptomOnset', option.id)}
          />
        ))}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Have you noticed changes in your discharge?</Text>
      <Text style={styles.sectionSubtitle}>Color (select one):</Text>
      <View style={styles.optionsContainer}>
        {DISCHARGE_COLOR_OPTIONS.map((option) => (
          <AnimatedOption
            key={option.id}
            option={option}
            isSelected={answers.dischargeColor === option.id}
            onPress={() => setSingleSelect('dischargeColor', option.id)}
          />
        ))}
      </View>

      <Text style={[styles.sectionSubtitle, { marginTop: 20 }]}>Odor (select one):</Text>
      <View style={styles.optionsContainer}>
        {DISCHARGE_ODOR_OPTIONS.map((option) => (
          <AnimatedOption
            key={option.id}
            option={option}
            isSelected={answers.dischargeOdor === option.id}
            onPress={() => setSingleSelect('dischargeOdor', option.id)}
            multiline={true}
          />
        ))}
      </View>
    </>
  );

  const renderRecentFactorsPage = () => (
    <>
      <View style={styles.headerSection}>
        <LogoCrossIcon size={60} color="#721422" />
        <Text style={styles.title}>Recent Factors</Text>
        <Text style={styles.subtitle}>Page 2 of 4 • Select all that apply</Text>
      </View>

      <Text style={styles.introCopy}>
        Some things can temporarily affect your vaginal balance or increase the chance of an infection.{'\n\n'}Have any of these applied to you recently?
      </Text>

      <View style={styles.optionsContainer}>
        {RECENT_FACTORS_OPTIONS.map((option) => (
          <AnimatedOption
            key={option.id}
            option={option}
            isSelected={answers.recentFactors.includes(option.id)}
            onPress={() => toggleMultiSelect('recentFactors', option.id)}
            multiline={true}
          />
        ))}
      </View>
    </>
  );

  const renderCycleHormonalPage = () => (
    <>
      <View style={styles.headerSection}>
        <LogoCrossIcon size={60} color="#721422" />
        <Text style={styles.title}>Cycle & Hormonal Context</Text>
        <Text style={styles.subtitle}>Page 3 of 4</Text>
      </View>

      <Text style={styles.sectionTitle}>Where are you in your menstrual cycle?</Text>
      <View style={styles.optionsContainer}>
        {CYCLE_POSITION_OPTIONS.map((option) => (
          <AnimatedOption
            key={option.id}
            option={option}
            isSelected={answers.cyclePosition === option.id}
            onPress={() => setSingleSelect('cyclePosition', option.id)}
            multiline={true}
          />
        ))}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.sectionTitle}>Are you currently pregnant?</Text>
      <View style={styles.yesNoContainer}>
        <AnimatedOption
          option={{ id: 'yes', label: '🤰 Yes' }}
          isSelected={answers.isPregnant === 'yes'}
          onPress={() => setSingleSelect('isPregnant', 'yes')}
        />
        <AnimatedOption
          option={{ id: 'no', label: '❌ No' }}
          isSelected={answers.isPregnant === 'no'}
          onPress={() => setSingleSelect('isPregnant', 'no')}
        />
        <AnimatedOption
          option={{ id: 'not-sure', label: '❓ Not sure' }}
          isSelected={answers.isPregnant === 'not-sure'}
          onPress={() => setSingleSelect('isPregnant', 'not-sure')}
        />
      </View>
    </>
  );

  const renderSeverityPage = () => (
    <>
      <View style={styles.headerSection}>
        <LogoCrossIcon size={60} color="#721422" />
        <Text style={styles.title}>Severity & Red Flags</Text>
        <Text style={styles.subtitle}>Page 4 of 4</Text>
      </View>

      <Text style={styles.sectionTitle}>Do you currently have fever or severe pelvic pain?</Text>
      <View style={styles.yesNoContainer}>
        <AnimatedOption
          option={{ id: 'yes', label: '⚠️ Yes' }}
          isSelected={answers.hasFeverOrPain === 'yes'}
          onPress={() => setSingleSelect('hasFeverOrPain', 'yes')}
        />
        <AnimatedOption
          option={{ id: 'no', label: '✅ No' }}
          isSelected={answers.hasFeverOrPain === 'no'}
          onPress={() => setSingleSelect('hasFeverOrPain', 'no')}
        />
      </View>

      {answers.hasFeverOrPain === 'yes' && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Please seek medical care promptly. These symptoms can indicate a more serious infection.
          </Text>
        </View>
      )}
    </>
  );

  return (
    <ScreenBackground>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <Pressable
            style={({ pressed }) => [styles.backButtonPressable, pressed && { opacity: 0.7 }]}
            onPress={handleBack}
          >
            <ArrowLeftIcon size={24} color="#721422" />
          </Pressable>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderPage()}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              !canContinue() && styles.continueButtonDisabled,
              pressed && { opacity: 0.8 }
            ]}
            onPress={handleContinue}
            disabled={!canContinue()}
          >
            <Text style={[
              styles.continueButtonText,
              !canContinue() && styles.continueButtonTextDisabled
            ]}>
              {currentPage === 3 ? 'Start Test' : 'Continue'}
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: 'absolute', top: 60, left: 20, zIndex: 1 },
  backButtonPressable: { padding: 8 },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 100, paddingBottom: 120, paddingHorizontal: 20 },
  headerSection: { alignItems: 'center', marginBottom: 30 },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    fontFamily: 'Chunko-Bold', 
    marginTop: 10, 
    color: '#721422', 
    textAlign: 'center', 
    paddingHorizontal: 20 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#721422', 
    marginTop: 8, 
    textAlign: 'center', 
    fontFamily: 'Poppins-Regular' 
  },
  introCopy: {
    fontSize: 15,
    color: '#721422',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  sectionSubtitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(114, 20, 34, 0.2)',
    marginVertical: 30,
  },
  optionsContainer: { gap: 12, marginBottom: 20 },
  yesNoContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  optionButton: { 
    backgroundColor: 'rgba(255, 255, 255, 0.3)', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.4)', 
    padding: 16 
  },
  optionButtonSelected: { 
    backgroundColor: '#EF7D88', 
    borderColor: '#EF7D88', 
    borderWidth: 1.5 
  },
  optionTitle: { 
    fontSize: 16, 
    fontFamily: 'Poppins-Medium', 
    color: '#721422', 
    lineHeight: 24,
    textAlign: 'center',
  },
  optionTitleMultiline: {
    textAlign: 'left',
  },
  optionTitleSelected: { 
    fontFamily: 'Poppins-SemiBold', 
    fontWeight: '600', 
    color: '#FFFFFF' 
  },
  warningBox: {
    backgroundColor: 'rgba(255, 200, 100, 0.3)',
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  warningText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
    lineHeight: 22,
    textAlign: 'center',
  },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: 'transparent', 
    paddingHorizontal: 20, 
    paddingBottom: 30, 
    paddingTop: 10 
  },
  continueButton: { 
    backgroundColor: '#721422', 
    borderRadius: 10, 
    minHeight: 50, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  continueButtonDisabled: { 
    backgroundColor: 'rgba(114, 20, 34, .5)' 
  },
  continueButtonText: { 
    fontSize: 16, 
    fontWeight: '600', 
    fontFamily: 'Poppins-Medium', 
    color: '#FFFFFF' 
  },
  continueButtonTextDisabled: { 
    color: 'rgba(255, 255, 255, .5)' 
  },
});

