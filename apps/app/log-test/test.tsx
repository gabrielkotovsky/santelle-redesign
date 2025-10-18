// 395 lines

import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity, Alert } from "react-native";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { router } from "expo-router";

// Component imports
import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import ProgressCard from "@/src/components/tests/progress-card";
import StepCard from "@/src/components/steps/step-card";
import ResultSelector from "@/src/components/steps/result-selector";
import PHResultSelector from "@/src/components/steps/pH-result-selector";
import PHTimerCard from "@/src/components/steps/pH-timer-card";
import TestTimerCard from "@/src/components/steps/test-timer-card";
import SmallTimerCard from "@/src/components/steps/small-timer-card";

// Service imports
import { scheduleResultsReady, ensureNotifPermission, cancelNotification } from "@/src/services/notifications";

// Store imports
import { useTestSession } from "@/src/features/test-session/testSession.store";
import { getLogBySession } from "@/src/features/test-logs/testLogs.api";

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Types
type Step = {
  title: string;
  image?: any;
  description: string[];
};

// Constants
const TEST_STEPS: Step[] = [
  {
    title: "1. Collect your sample",
    image: require("@/assets/images/step1.png"),
    description: [
      "**Insert** the swab gently about half an index into your vagina",
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
];

export default function TestScreen() {
  // ===============================
  // Zustand store hooks
  // ===============================
  const session = useTestSession(s => s.session);
  const storeSetStep = useTestSession(s => s.setStep);
  const storeSetResults = useTestSession(s => s.setResultsReadyAt);
  const storeSetPhResults = useTestSession(s => s.setPhResultsReadyAt);
  const abortSession = useTestSession(s => s.abort);
  const hydrate = useTestSession(s => s.hydrateFromServer);

  // ===============================
  // Component state
  // ===============================
  const totalSteps = TEST_STEPS.length;
  
  // Step management state
  const [currentStep, setCurrentStep] = useState(1); // 1-based for UI
  const [minAllowedStep, setMinAllowedStep] = useState<number>(1);
  const [step3Confirmed, setStep3Confirmed] = useState<boolean>(() => {
    const s = useTestSession.getState().session;
    return (s?.current_step ?? 1) >= 4;
  });
  
  // Timer state
  const [phEndsAt, setPhEndsAt] = useState<string | null>(null);
  const [resultsEndsAt, setResultsEndsAt] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [resultsNotifId, setResultsNotifId] = useState<string | undefined>(undefined);
  
  // pH validation state
  const [phSelected, setPhSelected] = useState<boolean>(false);
  
  // Refs
  const listRef = useRef<FlatList<Step>>(null);
  const programmaticScroll = useRef(false);
  const hasSyncedFromServer = useRef(false);
  
  // ===============================
  // Computed values
  // ===============================
  const phRemaining = phEndsAt ? Math.max(0, new Date(phEndsAt).getTime() - now) : 0;
  const isPHTimerRunning = !!phEndsAt && phRemaining > 0;
  const resultsRemaining = resultsEndsAt ? Math.max(0, new Date(resultsEndsAt).getTime() - now) : 0;
  const isResultsTimerRunning = !!resultsEndsAt && resultsRemaining > 0;

  // ===============================
  // Event handlers and functions
  // ===============================
  const onStepChanged = async (newStep: number) => {
    if (newStep === 4 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 2, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }

    // Prevent navigation to step 7 without pH selection
    if (newStep === 7 && !phSelected) {
      Alert.alert(
        'pH Required',
        'Please select your pH result before proceeding to final results.',
        [{ text: 'OK' }]
      );
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 4, animated: true }); // Go back to step 5 (pH)
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
    if (step === 7 && !phSelected) {
      Alert.alert(
        'pH Required',
        'Please select your pH result before proceeding to final results.',
        [{ text: 'OK' }]
      );
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 4, animated: true });
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

  // ===============================
  // useEffect hooks
  // ===============================
  // Timer update effect
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Cancel notification when timer expires
  useEffect(() => {
    if (resultsNotifId && resultsRemaining <= 0) {
      cancelNotification(resultsNotifId);
      setResultsNotifId(undefined);
    }
  }, [resultsRemaining, resultsNotifId]);

  // Hydrate session on mount
  useEffect(() => {
    (async () => {
      if (!session) await hydrate();
    })();
  }, []);

  // Sync with server session data
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

  // Check if pH has been selected - poll periodically when on step 5 or later
  useEffect(() => {
    if (!session?.id || currentStep < 5) return;
    
    let cancelled = false;
    
    const checkPH = async () => {
      try {
        const log = await getLogBySession(session.id);
        if (!cancelled && log?.ph != null) {
          setPhSelected(true);
        } else if (!cancelled) {
          setPhSelected(false);
        }
      } catch (e) {
        console.warn("[TestScreen] Failed to check pH selection:", e);
      }
    };
    
    // Initial check
    checkPH();
    
    // Poll every 2 seconds while on step 5 or later
    const interval = setInterval(checkPH, 2000);
    
    return () => { 
      cancelled = true;
      clearInterval(interval);
    };
  }, [session?.id, currentStep]);

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
      setResultsNotifId(undefined);
    }
    await abortSession();
    router.replace('/(tabs)/tests');
  };

  // ===============================
  // Render
  // ===============================
  return (
    <ScreenBackground>
      {/* Progress indicator */}
      <ProgressCard
        currentStep={currentStep}
        totalSteps={totalSteps}
        onCancel={handleCancelTest}
      />

      {/* Divider */}
      <View style={{height: 1, backgroundColor: "rgba(255,255,255,0.3)", marginVertical: 10}} />

      {/* Timer card for results countdown */}
      {isResultsTimerRunning && currentStep < 6 && currentStep > 3 && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
        >
          <SmallTimerCard timeRemaining={Math.floor(resultsRemaining / 1000)} />
        </Animated.View>
      )}

      {/* Swipeable test steps */}
      <Animated.View layout={LinearTransition.duration(200)} style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={TEST_STEPS}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <View style={{ width: SCREEN_WIDTH }}>
              {/* Step 3: Add solution to wells - requires confirmation */}
              {index === 2 ? (
                <StepCard 
                  title={item.title} 
                  image={item.image} 
                  description={item.description}
                  button={
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#721422',
                        borderRadius: 99,
                        paddingVertical: 12,
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        Alert.alert(
                          'Start Results Timer',
                          'Have you added 1 drop of solution to each reaction well?',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Yes, Start Timer',
                              style: 'default',
                              onPress: () => {
                                setStep3Confirmed(true);
                                setMinAllowedStep(4);
                                onStepChanged(4);
                                programmaticScroll.current = true;
                                requestAnimationFrame(() => {
                                  listRef.current?.scrollToIndex({ index: 3, animated: true }); // 0-based -> step 4
                                  setTimeout(() => { programmaticScroll.current = false; }, 50);
                                });
                              },
                            },
                          ],
                          { 
                            cancelable: true
                          }
                        );
                      }}
                      accessibilityRole="button"
                      accessibilityLabel="Start Results Timer"
                    >
                      <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
                        Start Results Timer
                      </Text>
                    </TouchableOpacity>
                  }
                />
              ) : index === 4 ? (
                /* Step 5: pH results - timer or selector */
                isPHTimerRunning ? (
                  <PHTimerCard 
                    timeRemaining={Math.floor(phRemaining / 1000)}
                    onSkip={async () => {
                      if (resultsNotifId) await cancelNotification(resultsNotifId);
                      setResultsNotifId(undefined);
                      setPhEndsAt(new Date().toISOString())
                    }}
                  />
                ) : (
                  <PHResultSelector 
                    title="5. Log your pH results"
                  />
                )
              ) : index === 5 ? (
                /* Step 6: NAG reaction - timer or instructions */
                isResultsTimerRunning ? (
                  <TestTimerCard 
                    timeRemaining={Math.floor(resultsRemaining / 1000)}
                    onSkip={() => setResultsEndsAt(new Date().toISOString())}
                  />
                ) : (
                  <StepCard title={item.title} image={item.image} description={item.description} />
                )
              ) : index === 6 ? (
                /* Step 7: Final results */
                <ResultSelector 
                  title="7. Log your final test results"
                />
              ) : (
                /* All other steps: standard step card */
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