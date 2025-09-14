import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity } from "react-native";
import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import ProgressCard from "@/src/components/tests/progress-card";
import StepCard from "@/src/components/steps/step-card";
import ResultSelector from "@/src/components/steps/result-selector";
import PHResultSelector from "@/src/components/steps/pH-result-selector";
import PHTimerCard from "@/src/components/steps/pH-timer-card";
import TestTimerCard from "@/src/components/steps/test-timer-card";
import SmallTimerCard from "@/src/components/steps/small-timer-card";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Step = {
  title: string;
  image?: any;          // require(...) - optional
  description: string[];
};

export default function TestScreen() {
  const steps: Step[] = useMemo(
    () => [
      {
        title: "1. Collect your sample",
        image: require("@/assets/images/step1.png"),
        description: [
          "**Insert** the swab gently about 5 cm into your vagina",
          "**Rotate** the swab slowly and evenly against the vaginal wall for 10–15 seconds",
          "**Make sure** vaginal secretions are visible on the swab",
          "**Remove** the swab and do not touch it to any surface"
        ],
      },
      {
        title: "2. Prepare your solution",
        image: require("@/assets/images/step2.png"),
        description: [
          "**Insert** the swab into the sample tube (purple) containing diluent",
          "**Swish** it around for 10 seconds",
          "**Squeeze** the tube walls for a few seconds to extract the sample"
        ],
      },
      {
        title: "3. Add your solution to the wells",
        image: require("@/assets/images/step3.png"),
        description: [
          "**Discard** the swab",
          "**Tighten** the sample tube cap",
          "**Remove** the dropper cap",
          "**Add 1 drop** of the solution to each reaction well"
        ],
      },
      {
        title: "4. Add reagent to the SNA well",
        image: require("@/assets/images/step4.png"),
        description: [
          "Use the pasteur dropper to **add 1 drop of reagent** (blue cap) to the SNA well ONLY"
        ],
      },
      {
        title: "5. Wait for the pH result",
        description: [
          "**Log your pH results**"
        ],
      },
      {
        title: "6. Wait for the rest of the results",
        image: require("@/assets/images/step6.png"),
        description: [
          "**Add 1 drop** of stop solution (grey cap) to the NAG well",
          "**Note:** Disregard all results past 15 minutes"
        ],
      },
      {
        title: "7. Log Final Results",
        description: [
          "**Log your final test results**"
        ],
      }
    ],
    []
  );

  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState(1); // 1-based for UI
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [canAccessStep5, setCanAccessStep5] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  
  const [step6TimerActive, setStep6TimerActive] = useState(false);
  const [step6TimeRemaining, setStep6TimeRemaining] = useState(0);
  const [canAccessStep7, setCanAccessStep7] = useState(false);
  const [step6TimerStarted, setStep6TimerStarted] = useState(false);
  const listRef = useRef<FlatList<Step>>(null);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const newStep = index + 1;
    setCurrentStep(newStep);
    
    // Start both timers only once when reaching step 4
    if (newStep === 4 && !timerStarted) {
      startTimer(60); // 1 minute timer for pH
      setTimerStarted(true);
    }
    if (newStep === 4 && !step6TimerStarted) {
      startStep6Timer(600); // 10 minute timer for step 6
      setStep6TimerStarted(true);
    }
    
    // Prevent access to step 7 (final results) if step 6 timer hasn't completed
    if (newStep === 7 && !canAccessStep7) {
      goToStep(5); // Go back to step 6 (timer/final results card)
    }
  };

  const startTimer = (seconds: number) => {
    setTimeRemaining(seconds);
    setTimerActive(true);
    setCanAccessStep5(false);
  };

  const skipTimer = () => {
    setTimerActive(false);
    setCanAccessStep5(true);
    setTimeRemaining(0);
  };

  const startStep6Timer = (seconds: number) => {
    setStep6TimeRemaining(seconds);
    setStep6TimerActive(true);
    setCanAccessStep7(false);
  };

  const skipStep6Timer = () => {
    setStep6TimerActive(false);
    setCanAccessStep7(true);
    setStep6TimeRemaining(0);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setCanAccessStep5(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeRemaining]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (step6TimerActive && step6TimeRemaining > 0) {
      interval = setInterval(() => {
        setStep6TimeRemaining((prev) => {
          if (prev <= 1) {
            setStep6TimerActive(false);
            setCanAccessStep7(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step6TimerActive, step6TimeRemaining]);

  const goToStep = (index: number) => {
    // index is 0-based internally
    listRef.current?.scrollToIndex({ index, animated: true });
    setCurrentStep(index + 1);
  };

  return (
    <ScreenBackground>
      {/* Progress at the top (you can add Next/Back buttons here if desired) */}
      <ProgressCard
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <View style={styles.divider} />

      {/* Timer card above all steps except step 6+ */}
      {step6TimerActive && currentStep < 6 && currentStep > 3 && (
        <SmallTimerCard timeRemaining={step6TimeRemaining} />
      )}

      {/* Swipeable steps */}
      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            {index === 4 ? (
              timerActive ? (
                <PHTimerCard 
                  timeRemaining={timeRemaining}
                  onSkip={skipTimer}
                />
              ) : (
                <PHResultSelector 
                  title="5. Log pH Results"
                  onPHChange={(pH) => console.log('pH result:', pH)}
                />
              )
            ) : index === 5 ? (
              step6TimerActive ? (
                <TestTimerCard 
                  timeRemaining={step6TimeRemaining}
                  onSkip={skipStep6Timer}
                />
              ) : (
                <StepCard title={item.title} image={item.image} description={item.description} />
              )
            ) : index === 6 ? (
              <ResultSelector 
                title="7. Log Final Results"
                onResultsChange={(results) => console.log('Test results:', results)}
              />
            ) : (
              <StepCard title={item.title} image={item.image} description={item.description} />
            )}
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        initialScrollIndex={currentStep - 1}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginVertical: 10,
  },
});