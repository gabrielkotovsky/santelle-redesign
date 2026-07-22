// 395 lines

import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, Dimensions, NativeScrollEvent, NativeSyntheticEvent, Text, TouchableOpacity, Alert } from "react-native";
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";

// Component imports
import { ScreenBackground } from "@/src/components/layout/ScreenBackground";
import ProgressCard from "@/src/components/tests/progress-card";
import StepCard from "@/src/components/steps/step-card";
import ResultSelector from "@/src/components/steps/result-selector";
import PHResultSelector from "@/src/components/steps/pH-result-selector";
import PHTimerCard from "@/src/components/steps/pH-timer-card";
import TestTimerCard from "@/src/components/steps/test-timer-card";
import SmallTimerCard from "@/src/components/steps/small-timer-card";

// SVG imports
import Step0Svg from "@/assets/images/step0.svg";
import Step1Svg from "@/assets/images/step1.svg";
import Step2Svg from "@/assets/images/step2.svg";
import Step3Svg from "@/assets/images/step3.svg";
import Step4Svg from "@/assets/images/step4.svg";

// Service imports
import { scheduleResultsReady, ensureNotifPermission, cancelNotification } from "@/src/services/notifications";

// Store imports
import { useTestSession } from "@/src/features/test-session/testSession.store";
import { getLogBySession } from "@/src/features/test-logs/testLogs.api";
import { useTranslations } from "@/src/i18n";

// Constants
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Types
import { SvgProps } from "react-native-svg";

type Step = {
  title: string;
  image?: any;
  SvgImage?: React.FC<SvgProps>;
  description: string[];
};

export default function TestScreen() {
  const { t } = useTranslations();
  const { editResults } = useLocalSearchParams<{ editResults?: string }>();
  const isEditingResults = editResults === '1' || editResults === 'true';
  const TEST_STEPS: Step[] = useMemo(() => [
    { title: t.step1Title, SvgImage: Step0Svg, description: [t.step1Desc1, t.step1Desc2, t.step1Desc3] },
    { title: t.step2Title, SvgImage: Step1Svg, description: [t.step2Desc1, t.step2Desc2, t.step2Desc3, t.step2Desc4] },
    { title: t.step3Title, SvgImage: Step2Svg, description: [t.step3Desc1, t.step3Desc2, t.step3Desc3, t.step3Desc4] },
    { title: t.step4Title, SvgImage: Step3Svg, description: [t.step4Desc1, t.step4Desc2, t.step4Desc3, t.step4Desc4] },
    { title: t.step5Title, description: [t.step5Desc1] },
    { title: t.step6Title, description: [t.step6Desc1] },
  ], [t]);

  // ===============================
  // Zustand store hooks
  // ===============================
  const session = useTestSession(s => s.session);
  const storeSetStep = useTestSession(s => s.setStep);
  const storeSetResults = useTestSession(s => s.setResultsReadyAt);
  const storeSetPhResults = useTestSession(s => s.setPhResultsReadyAt);
  const abortSession = useTestSession(s => s.abort);
  const hydrate = useTestSession(s => s.hydrateFromServer);
  const resetLocal = useTestSession(s => s.resetLocal);

  // ===============================
  // Component state
  // ===============================
  const totalSteps = TEST_STEPS.length;
  
  // Step management state
  const [currentStep, setCurrentStep] = useState(1); // 1-based for UI
  const [minAllowedStep, setMinAllowedStep] = useState<number>(1);
  const [step3Confirmed, setStep3Confirmed] = useState<boolean>(() => {
    const s = useTestSession.getState().session;
    return (s?.current_step ?? 1) >= 5;
  });
  
  // Timer state
  const [phEndsAt, setPhEndsAt] = useState<string | null>(null);
  const [resultsEndsAt, setResultsEndsAt] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const [resultsNotifId, setResultsNotifId] = useState<string | undefined>(undefined);
  
  // pH validation state
  const [phSelected, setPhSelected] = useState<boolean>(false);
  
  // Swipe hint overlay state
  const [showSwipeHint, setShowSwipeHint] = useState<boolean>(true);
  
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
    if (newStep === 5 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 3, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }

    // Prevent navigation to step 6 without pH selection
    if (newStep === 6 && !phSelected) {
      Alert.alert(
        t.testStepPhRequired,
        t.testStepPhRequiredMessage,
        [{ text: t.ok }]
      );
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 4, animated: true }); // Go back to step 5 (pH)
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    
    setCurrentStep(newStep);

    if (newStep === 5) {
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
        // Silently handle notification scheduling error
      }

      if (session) {
        await storeSetStep(newStep);
      }
    }

    if (newStep === 6 && isResultsTimerRunning) {
      goToStep(5);
      return;
    }
  };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Hide swipe hint on any swipe
    if (showSwipeHint) setShowSwipeHint(false);
    
    if (programmaticScroll.current) return;
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    const step = index + 1;
    if (step === 5 && !step3Confirmed) {
      programmaticScroll.current = true;
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: 3, animated: true });
        setTimeout(() => { programmaticScroll.current = false; }, 50);
      });
      return;
    }
    if (step === 6 && !phSelected) {
      Alert.alert(
        t.testStepPhRequired,
        t.testStepPhRequiredMessage,
        [{ text: t.ok }]
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

  // Auto-hide swipe hint after 3 seconds
  useEffect(() => {
    if (showSwipeHint) {
      const timer = setTimeout(() => setShowSwipeHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSwipeHint]);

  // Cancel notification when timer expires
  useEffect(() => {
    if (resultsNotifId && resultsRemaining <= 0) {
      cancelNotification(resultsNotifId);
      setResultsNotifId(undefined);
    }
  }, [resultsRemaining, resultsNotifId]);

  // Hydrate session on mount (skip when re-entering to edit a completed log)
  useEffect(() => {
    (async () => {
      if (isEditingResults) return;
      if (!session) await hydrate();
    })();
  }, []);

  // History → Edit results: jump straight to pH / markers with timers expired.
  useEffect(() => {
    if (!isEditingResults || !session?.id) return;

    setStep3Confirmed(true);
    setPhSelected(true);
    setMinAllowedStep(5);
    setCurrentStep(5);
    const past = new Date(Date.now() - 1000).toISOString();
    setPhEndsAt(session.ph_result_ready_at ?? past);
    setResultsEndsAt(session.results_ready_at ?? past);

    programmaticScroll.current = true;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: 4, animated: false });
      setTimeout(() => {
        programmaticScroll.current = false;
      }, 50);
    });
  }, [isEditingResults, session?.id]);

  // Sync with server session data
  useEffect(() => {
    if (!session || !listRef.current) return;
    const step = Math.max(1, Math.min(6, session.current_step || 1));
    setMinAllowedStep(step);
    if (session.ph_result_ready_at && !phEndsAt) {
      setPhEndsAt(session.ph_result_ready_at);
    }
    if (session.results_ready_at && !resultsEndsAt) {
      setResultsEndsAt(session.results_ready_at);
      setCurrentStep(step);
      if (step >= 5) setStep3Confirmed(true);
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
        // Only ever confirm selection — a stale read returning null must not
        // revoke a selection the user just made (the save may still be in flight).
        if (!cancelled && log?.ph != null) {
          setPhSelected(true);
        }
      } catch (e) {
        // Silently handle pH check error
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
    // Editing a completed log from history — never delete the session.
    if (isEditingResults || session?.status === 'completed') {
      resetLocal();
      router.replace('/(tabs)/tests');
      return;
    }
    await abortSession();
    router.replace('/(tabs)/tests');
  };

  /** Re-open pH then markers after post-complete "Edit results" — stay on the test screen. */
  const handleRequestEditResults = () => {
    // Allow swiping between steps 5–6 even if session is already completed.
    setMinAllowedStep(5);
    setCurrentStep(5);
    programmaticScroll.current = true;
    requestAnimationFrame(() => {
      listRef.current?.scrollToIndex({ index: 4, animated: true });
      setTimeout(() => {
        programmaticScroll.current = false;
      }, 50);
    });
  };

  // ===============================
  // Render
  // ===============================
  return (
    <ScreenBackground>
      {/* Progress indicator */}
      <View style={{ zIndex: 30, elevation: 30 }}>
        <ProgressCard
          currentStep={currentStep}
          totalSteps={totalSteps}
          onCancel={handleCancelTest}
        />
      </View>

      {/* Divider */}
      <View style={{height: 1, backgroundColor: "rgba(255,255,255,0.3)", marginVertical: 10}} />

      {/* Timer card for results countdown */}
      {isResultsTimerRunning && currentStep < 6 && currentStep > 4 && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOutUp.duration(200)}
        >
          <SmallTimerCard timeRemaining={Math.floor(resultsRemaining / 1000)} />
        </Animated.View>
      )}

      {/* Swipeable test steps */}
      <Animated.View layout={LinearTransition.duration(200)} style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {/* Swipe hint overlay */}
        {showSwipeHint && currentStep === 1 && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 10,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 40,
            }}
            pointerEvents="none"
          >
            <View style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
            }}>
              <Text style={{
                fontSize: 32,
                marginBottom: 12,
              }}>
                ⏮️ ⏭️
              </Text>
              <Text style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: '#721422',
                textAlign: 'center',
                marginBottom: 4,
              }}>
                {t.testStepSwipeToNavigate}
              </Text>
              <Text style={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: '#666',
                textAlign: 'center',
              }}>
                {t.testStepSwipeHint}
              </Text>
            </View>
          </Animated.View>
        )}
        
        <FlatList
          ref={listRef}
          data={TEST_STEPS}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <View style={{ width: SCREEN_WIDTH }}>
              {/* Step 4: Add solution to wells - requires confirmation */}
              {index === 3 ? (
                <StepCard 
                  title={item.title} 
                  SvgImage={item.SvgImage}
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
                          t.testStepStartTimer,
                          t.testStepStartTimerConfirm,
                          [
                            {
                              text: t.testStepCancel,
                              style: 'cancel',
                            },
                            {
                              text: t.testStepYesStartTimer,
                              style: 'default',
                              onPress: () => {
                                setStep3Confirmed(true);
                                setMinAllowedStep(5);
                                onStepChanged(5);
                                programmaticScroll.current = true;
                                requestAnimationFrame(() => {
                                  listRef.current?.scrollToIndex({ index: 4, animated: true }); // 0-based -> step 5
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
                      accessibilityLabel={t.testStepStartTimer}
                    >
                      <Text style={{ color: 'white', fontFamily: 'Poppins-SemiBold', fontSize: 16 }}>
                        {t.testStepStartTimer}
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
                    title={t.step5Title}
                    SvgImage={Step4Svg}
                    onSelectionChange={() => setPhSelected(true)}
                  />
                )
              ) : index === 5 ? (
                /* Step 6: Final results - timer or selector */
                isResultsTimerRunning ? (
                  <TestTimerCard 
                    timeRemaining={Math.floor(resultsRemaining / 1000)}
                    onSkip={() => setResultsEndsAt(new Date().toISOString())}
                  />
                ) : (
                  <ResultSelector
                    title={t.step6Title}
                    onRequestEditResults={handleRequestEditResults}
                  />
                )
              ) : (
                /* All other steps: standard step card */
                <StepCard title={item.title} SvgImage={item.SvgImage} description={item.description} />
              )}
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          windowSize={2}
          maxToRenderPerBatch={1}
          onMomentumScrollEnd={onMomentumEnd}
          onScrollBeginDrag={() => { if (showSwipeHint) setShowSwipeHint(false); }}
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