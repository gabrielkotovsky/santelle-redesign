import { supabase } from "@/src/services/supabase";

{/* SIGN IN / SIGN UP WITH EMAIL */}

export async function requestEmailOtp(email:string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true
        },
    });
    if (error) throw error;
    return data;
}

export async function verifyEmailOtp(email:string, token:string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
    });
    if (error) throw error;
    return data.session ?? null;
}

{/* SIGN IN / SIGN UP WITH APPLE */}

export async function signInWithApple(identityToken: string, nonce: string) {
    try {      
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: identityToken,
        nonce: nonce,
      });

      if (error) {
        // Handle authentication error
        return {
          success: false,
          message: error.message || 'Failed to sign in with Apple. Please try again.'
        };
      }
      return {
        success: true,
        message: 'Successfully signed in with Apple!',
        user: data.user
      };
    } catch (error) {
      // Handle unexpected error
      return {
        success: false,
        message: 'An unexpected error occurred during Apple sign-in.'
      };
    }
}

{/* HELPERS */}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session ?? null;
}

export async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user ?? null;
}

export async function needsOnboarding(): Promise<boolean> {
    const user = await getUser();
    if (!user) return false;
    
    // Check if user has completed onboarding by querying the onboarding_responses table
    const { data, error } = await supabase
        .from('onboarding_responses')
        .select('onboarding_complete')
        .eq('user_id', user.id)
        .single();
    
    // If no record exists or onboarding is not complete, user needs onboarding
    if (error || !data) {
        return true;
    }
    
    return !data.onboarding_complete;
}

export async function needsQuestionnaire(): Promise<boolean> {
    const user = await getUser();
    if (!user) return false;
    
    // Check if user has completed all questionnaire questions
    const isComplete = await hasCompletedQuestionnaire(user.id);
    return !isComplete;
}

export async function getUserNavigationRoute(): Promise<string> {
    try {
        const user = await getUser();
        if (!user) return '/(auth)/landing';
        
        // Check onboarding status
        const needsOnboardingFlow = await needsOnboarding();
        if (needsOnboardingFlow) {
            return '/(onboarding)/name';
        }
        
        // Check questionnaire status
        const needsQuestionnaireFlow = await needsQuestionnaire();
        if (needsQuestionnaireFlow) {
            return '/(questionnaire)/motivation';
        }
        
        // Both complete, go to home
        return '/(tabs)/home';
    } catch (error: any) {
        // If user doesn't exist or any error, return to landing
        return '/(auth)/landing';
    }
}

export async function updateUserMetadata(metadata: Record<string, any>) {
    const { data, error } = await supabase.auth.updateUser({
        data: metadata
    });
    if (error) throw error;
    return data.user;
}

// Onboarding database functions
export async function createOnboardingResponse(userId: string, displayName: string) {
    const user = await getUser();
    const { data, error } = await supabase
        .from('onboarding_responses')
        .insert({
            user_id: userId,
            display_name: displayName,
            email: user?.email,
            onboarding_complete: false
        })
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

export async function updateOnboardingResponse(userId: string, updates: Partial<{
    display_name: string;
    date_of_birth: string;
    country: string;
    terms_accepted: boolean;
    privacy_accepted: boolean;
    marketing_consent: boolean;
    contact_method: string;
    language: string;
    onboarding_complete: boolean;
}>) {
    const { data, error } = await supabase
        .from('onboarding_responses')
        .update({
            ...updates,
            updated_at: new Date().toISOString(),
            ...(updates.onboarding_complete && { completed_at: new Date().toISOString() })
        })
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

export async function getOnboardingResponse(userId: string) {
    const { data, error } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
    }
    
    return data;
}

export async function getUserDisplayName(userId: string): Promise<string | null> {
    const data = await getOnboardingResponse(userId);
    return data?.display_name || null;
}

// Questionnaire database functions
export async function createQuestionnaireEntry(userId: string) {
    const { data, error } = await supabase
        .from('questionnaire')
        .insert({
            user_id: userId,
            questionnaire_complete: false
        })
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

export async function getQuestionnaireEntry(userId: string) {
    const { data, error } = await supabase
        .from('questionnaire')
        .select('*')
        .eq('user_id', userId)
        .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
    }
    
    return data;
}

export async function saveQuestionnaireAnswer(
    userId: string, 
    questionNumber: number, 
    answerValue: number | number[]
) {
    const columnName = `q${questionNumber}`;
    
    const { data, error } = await supabase
        .from('questionnaire')
        .update({ [columnName]: answerValue })
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

export async function markQuestionnaireComplete(userId: string) {
    const { data, error } = await supabase
        .from('questionnaire')
        .update({ questionnaire_complete: true })
        .eq('user_id', userId)
        .select()
        .single();
    
    if (error) throw error;
    return data;
}

export async function hasCompletedQuestionnaire(userId: string): Promise<boolean> {
    const entry = await getQuestionnaireEntry(userId);
    
    if (!entry) return false;
    
    return entry.questionnaire_complete === true;
}

// Subscription database functions
export async function getProfile(userId: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) {
            // PGRST116 is "no rows returned" - this is expected if profile doesn't exist
            if (error.code === 'PGRST116') {
                return null;
            }
            // For other errors, throw
            throw error;
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

export async function hasActiveSubscriptionOrTrial(): Promise<boolean> {
    const user = await getUser();
    if (!user) return false;
    
    try {
        const profile = await getProfile(user.id);
        
        // If no profile exists, user doesn't have subscription
        if (!profile) {
            return false;
        }
        
        const now = new Date();
        const subscriptionStatus = profile.subscription_status?.toLowerCase();
        
        // Check if user has active subscription
        if (subscriptionStatus === 'active') {
            // Verify subscription hasn't expired
            if (profile.current_period_end) {
                const periodEnd = new Date(profile.current_period_end);
                if (periodEnd > now) {
                    return true;
                }
            } else {
                // If active but no period_end, assume valid (might be legacy or setup issue)
                return true;
            }
        }
        
        // Check if user is trialing
        if (subscriptionStatus === 'trialing') {
            // If trial_end_date exists, verify it hasn't passed
            if (profile.trial_end_date) {
                const trialEnd = new Date(profile.trial_end_date);
                // Check if date is valid
                if (!isNaN(trialEnd.getTime()) && trialEnd > now) {
                    return true;
                }
            } else {
                // If trialing but no trial_end_date, assume valid (similar to active without period_end)
                return true;
            }
        }
        
        // Check if subscription is canceled but still in grace period
        if (subscriptionStatus === 'canceled' && profile.current_period_end) {
            const periodEnd = new Date(profile.current_period_end);
            if (periodEnd > now && profile.cancel_at_period_end === true) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        // If there's an error checking subscription, deny access for safety
        return false;
    }
}