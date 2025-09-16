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
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { scheduleResultsReady } from "@/src/services/notifications";
import { ensureNotifPermission, cancelNotification } from "@/src/services/notifications";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Step = {
  title: string;
  image?: any;
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
  const [phEndsAt, setPhEndsAt] = useState<string | null>(null);
  const [resultsEndsAt, setResultsEndsAt] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const listRef = useRef<FlatList<Step>>(null);
  const phRemaining = phEndsAt ? Math.max(0, new Date(phEndsAt).getTime() - now) : 0;
  const isPHTimerRunning = !!phEndsAt && phRemaining > 0;
  const resultsRemaining = resultsEndsAt ? Math.max(0, new Date(resultsEndsAt).getTime() - now) : 0;
  const isResultsTimerRunning = !!resultsEndsAt && resultsRemaining > 0;
  const [resultsNotifId, setResultsNotifId] = useState<string | undefined>(undefined);

  const onStepChanged = async (newStep: number) => {
    setCurrentStep(newStep);

    if (newStep === 4) {
      const t = Date.now();
      if (!phEndsAt) setPhEndsAt(new Date(t + 60 * 1000).toISOString());
      if (!resultsEndsAt) setResultsEndsAt(new Date(t + 600 * 1000).toISOString());

      try {
        await ensureNotifPermission();
        if (resultsNotifId) await cancelNotification(resultsNotifId);
        const id = await scheduleResultsReady(new Date(t + 600 * 1000).toISOString());
        setResultsNotifId(id);
      } catch (e) {
        console.warn('Notification scheduling skipped:', e);
      }
    }

    if (newStep === 7 && isResultsTimerRunning) {
      goToStep(5);
      return;
    }
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    onStepChanged(index + 1);
  };

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const goToStep = (index0: number) => {
    // index is 0-based internally
    listRef.current?.scrollToIndex({ index: index0, animated: true });
    onStepChanged(index0 + 1);
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
      {isResultsTimerRunning && currentStep < 6 && currentStep > 3 && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
        >
          <SmallTimerCard timeRemaining={Math.floor(resultsRemaining / 1000)} />
        </Animated.View>
      )}

      {/* Swipeable steps */}
      <Animated.View layout={LinearTransition.duration(200)} style={{ flex: 1 }}>
      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            {index === 4 ? (
              isPHTimerRunning ? (
                <PHTimerCard 
                  timeRemaining={Math.floor(phRemaining / 1000)}
                  onSkip={() => setPhEndsAt(new Date().toISOString())}
                />
              ) : (
                <PHResultSelector 
                  title="5. Log pH Results"
                  onPHChange={(pH) => console.log('pH result:', pH)}
                />
              )
            ) : index === 5 ? (
              isResultsTimerRunning ? (
                <TestTimerCard 
                  timeRemaining={Math.floor(resultsRemaining / 1000)}
                  onSkip={() => setResultsEndsAt(new Date().toISOString())}
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
        windowSize={2}
        maxToRenderPerBatch={1}
        onMomentumScrollEnd={onMomentumEnd}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        initialScrollIndex={currentStep - 1}
      />
      </Animated.View>
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