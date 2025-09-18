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
import { router } from "expo-router";
import { useTestSession } from "@/src/features/test-session/testSession.store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Step = {
  title: string;
  image?: any;
  description: string[];
};

export default function TestScreen() {

  // Zustand variables
  const session = useTestSession(s => s.session);
  const storeSetStep = useTestSession(s => s.setStep);
  const storeSetResults = useTestSession(s => s.setResultsReadyAt);
  const storeSetPhResults = useTestSession(s => s.setPhResultsReadyAt);
  const abortSession = useTestSession(s => s.abort);
  const hydrate = useTestSession(s => s.hydrateFromServer);

  // Test steps data
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
        title: "5. Log your pH results",
        description: [
          "**Log your pH results**"
        ],
      },
      {
        title: "6. Stop the NAG reaction",
        image: require("@/assets/images/step6.png"),
        description: [
          "**Add 1 drop** of stop solution (grey cap) to the NAG well",
          "**Note:** Disregard all results past 15 minutes"
        ],
      },
      {
        title: "7. Log your final test results",
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
  const programmaticScroll = useRef(false);
  const hasSyncedFromServer = useRef(false);
  const [ step3Confirmed, setStep3Confirmed ] = useState<boolean>(() => {
    const s = useTestSession.getState().session;
    return (s?.current_step ?? 1) >= 4;
  });
  const [minAllowedStep, setMinAllowedStep] = useState<number>(1);

  const onStepChanged = async (newStep: number) => {
    if (newStep === 4 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 2, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    
    setCurrentStep(newStep);

    if (newStep === 4) {
      const t = Date.now();
      if (!phEndsAt) 
        setPhEndsAt(new Date(t + 60 * 1000).toISOString());
      if (!resultsEndsAt) 
        setResultsEndsAt(new Date(t + 600 * 1000).toISOString());
      if (session && !phEndsAt) 
        await storeSetPhResults(new Date(t + 60 * 1000).toISOString());
      if (session && !resultsEndsAt) 
        await storeSetResults(new Date(t + 600 * 1000).toISOString());

      try {
        await ensureNotifPermission();
        if (resultsNotifId) await cancelNotification(resultsNotifId);
        const id = await scheduleResultsReady(new Date(t + 600 * 1000).toISOString());
        setResultsNotifId(id);
      } catch (e) {
        console.warn('Notification scheduling skipped:', e);
      }

      if (session) {
        await storeSetStep(newStep);
      }
    }

    if (newStep === 7 && isResultsTimerRunning) {
      goToStep(5);
      return;
    }
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (programmaticScroll.current) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const step = index + 1;
    if (step === 4 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 2, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    if (step < minAllowedStep) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: minAllowedStep - 1, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    if (step !== currentStep) {
      onStepChanged(step);
    }
  };

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    (async () => {
      if (!session) await hydrate();
    })();
  },[])

  useEffect(() => {
    if (!session || !listRef.current) return;
    const step = Math.max(1, Math.min(7, session.current_step || 1));
    setMinAllowedStep(step);
    if (session.ph_result_ready_at && !phEndsAt) {
      setPhEndsAt(session.ph_result_ready_at);
    }
    if (session.results_ready_at && !resultsEndsAt) {
      setResultsEndsAt(session.results_ready_at);
      setCurrentStep(step);
      if (step >= 4) setStep3Confirmed(true);
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: step - 1, animated: false });
        hasSyncedFromServer.current = true;
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
    }
  }, [session, phEndsAt, resultsEndsAt]);

  const goToStep = (index0: number) => {
    const targetStep = index0 + 1;
    const clampedStep = Math.max(minAllowedStep, targetStep);
    const clampedIndex = clampedStep - 1;
    if (clampedIndex !== index0) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: clampedIndex, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
    } else {
      listRef.current?.scrollToIndex({ index: clampedIndex, animated: true });
    }
    onStepChanged(clampedStep);
    };

  const handleCancelTest = async () => {
    if (resultsNotifId) {
      await cancelNotification(resultsNotifId);
    }
    await abortSession();
    router.replace('/(tabs)/tests');
  };

  return (
    <ScreenBackground>
      {/* Progress at the top (you can add Next/Back buttons here if desired) */}
      <ProgressCard
        currentStep={currentStep}
        totalSteps={totalSteps}
        onCancel={handleCancelTest}
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
            {index === 2 ? (
              <>
                <StepCard title={item.title} image={item.image} description={item.description} />
                <View style={{ paddingHorizontal: 20, marginTop: 12 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#721422',
                      borderRadius: 28,
                      paddingVertical: 12,
                      marginBottom: 30,
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setStep3Confirmed(true);
                      setMinAllowedStep(4);
                      onStepChanged(4);
                      programmaticScroll.current = true;
                      requestAnimationFrame(() => {
                        listRef.current?.scrollToIndex({ index: 3, animated: true }); // 0-based -> step 4
                        setTimeout(() => { programmaticScroll.current = false; }, 50);
                      });
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Confirm you have added one drop to each well"
                  >
                    <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
                      I've added 1 drop to each well
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : index === 4 ? (
              isPHTimerRunning ? (
                <PHTimerCard 
                  timeRemaining={Math.floor(phRemaining / 1000)}
                  onSkip={() => setPhEndsAt(new Date().toISOString())}
                />
              ) : (
                <PHResultSelector 
                  title="5. Log your pH results"
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
                title="7. Log your final test results"
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
        initialScrollIndex={0}
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