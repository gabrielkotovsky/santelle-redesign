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
        console.error('🔐 [Apple Sign-In] Authentication failed:', error);
        console.error('🔐 [Apple Sign-In] Error details:', {
          message: error.message,
          status: (error as any).status,
          name: error.name,
          stack: error.stack
        });
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
      console.error('🔐 [Apple Sign-In] Unexpected error:', error);
      console.error('🔐 [Apple Sign-In] Error type:', typeof error);
      console.error('🔐 [Apple Sign-In] Error constructor:', error?.constructor?.name);
      console.error('🔐 [Apple Sign-In] Full error object:', JSON.stringify(error, null, 2));
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