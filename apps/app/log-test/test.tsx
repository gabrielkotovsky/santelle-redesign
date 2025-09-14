import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import ProgressCard from "@/src/components/tests/progress-card";
import StepCard from "@/src/components/steps/step-card";
import ResultSelector from "@/src/components/steps/result-selector";
import PHResultSelector from "@/src/components/steps/pH-result-selector";

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
  const listRef = useRef<FlatList<Step>>(null);

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentStep(index + 1);
  };

  const goToStep = (index: number) => {
    // index is 0-based internally
    listRef.current?.scrollToIndex({ index, animated: true });
    setCurrentStep(index + 1);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) goToStep(currentStep); // currentStep is 1-based
  };

  const handleBack = () => {
    if (currentStep > 1) goToStep(currentStep - 2);
  };

  return (
    <ScreenBackground>
      {/* Progress at the top (you can add Next/Back buttons here if desired) */}
      <ProgressCard
        currentStep={currentStep}
        totalSteps={totalSteps}
      />

      <View style={styles.divider} />

      {/* Swipeable steps */}
      <FlatList
        ref={listRef}
        data={steps}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item, index }) => (
          <View style={{ width: SCREEN_WIDTH }}>
            {index === 4 ? (
              <PHResultSelector 
                title="5. Wait for the pH result"
                onPHChange={(pH) => console.log('pH result:', pH)}
              />
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
        // If you sometimes change steps array length dynamically:
        onScrollToIndexFailed={({ index }) => {
          // small recovery for rare race conditions
          setTimeout(() => listRef.current?.scrollToIndex({ index, animated: true }), 100);
        }}
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