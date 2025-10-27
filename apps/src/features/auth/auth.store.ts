import { supabase } from '@/src/services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
    getSession as apiGetSession,
    getUser as apiGetUser,
    signOut as apiSignOut,
    requestEmailOtp,
    signInWithApple,
    verifyEmailOtp
} from './auth.api';

// Store auth subscription at module level so we can clean it up and recreate it
let authSubscription: { unsubscribe: () => void } | null = null;

// Types
export type User = {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  updated_at?: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  confirmation_sent_at?: string;
  recovery_sent_at?: string;
  email_change_sent_at?: string;
  new_email?: string;
  new_phone?: string;
  invited_at?: string;
  action_link?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  confirmed_at?: string;
  email_change_confirm_status?: number;
  banned_until?: string;
  reauthentication_sent_at?: string;
  reauthentication_confirm_status?: number;
  is_sso_user?: boolean;
  deleted_at?: string;
  is_anonymous?: boolean;
};

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
};

export type AuthState = {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Email OTP State
  emailOtpLoading: boolean;
  emailOtpSent: boolean;
  emailOtpError: string | null;
  
  // Apple Sign-In State
  appleSignInLoading: boolean;
  appleSignInError: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  requestEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, token: string) => Promise<void>;
  signInWithApple: (identityToken: string, nonce: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  clearEmailOtpState: () => void;
  refreshSession: () => Promise<void>;
  reinitializeListener: () => Promise<void>;
  
  // Internal actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      loading: true,
      error: null,
      isAuthenticated: false,
      emailOtpLoading: false,
      emailOtpSent: false,
      emailOtpError: null,
      appleSignInLoading: false,
      appleSignInError: null,

      // Initialize auth state
      initialize: async () => {
        set({ loading: true, error: null });
        
        try {
          // Get current session
          const session = await apiGetSession();
          let user = null;
          
          if (session?.user) {
            try {
              user = await apiGetUser();
            } catch (userError: any) {
              // If user doesn't exist (deleted from database), clear the session
              if (userError.message?.includes('User from sub claim in JWT does not exist')) {
                await apiSignOut();
                set({
                  session: null,
                  user: null,
                  isAuthenticated: false,
                  loading: false,
                });
                return;
              }
              throw userError;
            }
          }
          
          set({
            session,
            user,
            isAuthenticated: !!session && !!user,
            loading: false,
          });

          // Clean up old subscription if it exists
          if (authSubscription) {
            authSubscription.unsubscribe();
            authSubscription = null;
          }

          // Set up auth state change listener
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              let newUser = null;
              
              if (newSession?.user) {
                try {
                  newUser = await apiGetUser();
                } catch (userError: any) {
                  // If user doesn't exist, clear session
                  if (userError.message?.includes('User from sub claim in JWT does not exist')) {
                    await apiSignOut();
                    set({
                      session: null,
                      user: null,
                      isAuthenticated: false,
                      loading: false,
                    });
                    return;
                  }
                }
              }
              
              set({
                session: newSession,
                user: newUser,
                isAuthenticated: !!newSession && !!newUser,
                loading: false,
              });

              // Clear email OTP state on successful sign in
              if (event === 'SIGNED_IN') {
                set({ emailOtpSent: false, emailOtpError: null });
              }
            }
          );

          // Store subscription so we can clean it up later
          authSubscription = subscription;
          
        } catch (error: any) {
          // If it's a user doesn't exist error, clear everything
          if (error.message?.includes('User from sub claim in JWT does not exist')) {
            try {
              await apiSignOut();
            } catch (e) {
              // Ignore sign out errors
            }
            set({
              session: null,
              user: null,
              error: null,
              loading: false,
              isAuthenticated: false,
            });
          } else {
            set({
              error: error.message || 'Failed to initialize authentication',
              loading: false,
              isAuthenticated: false,
            });
          }
        }
      },

      // Request email OTP
      requestEmailOtp: async (email: string) => {
        set({ emailOtpLoading: true, emailOtpError: null });
        
        try {
          await requestEmailOtp(email);
          set({ 
            emailOtpSent: true, 
            emailOtpLoading: false,
            emailOtpError: null 
          });
        } catch (error: any) {
          set({ 
            emailOtpError: error.message || 'Failed to send verification code',
            emailOtpLoading: false,
            emailOtpSent: false
          });
          throw error;
        }
      },

      // Verify email OTP
      verifyEmailOtp: async (email: string, token: string) => {
        set({ loading: true, error: null });
        
        try {
          const session = await verifyEmailOtp(email, token);
          
          if (session) {
            const user = await apiGetUser();
            set({
              session,
              user,
              isAuthenticated: true,
              loading: false,
              error: null,
              emailOtpSent: false,
              emailOtpError: null,
            });
          } else {
            throw new Error('No session returned from OTP verification');
          }
        } catch (error: any) {
          set({
            error: error.message || 'Failed to verify code',
            loading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Apple Sign-In
      signInWithApple: async (identityToken: string, nonce: string) => {
        set({ appleSignInLoading: true, appleSignInError: null });
        
        try {
          const result = await signInWithApple(identityToken, nonce);
          
          if (result.success) {
            // Get updated session and user
            const session = await apiGetSession();
            const user = await apiGetUser();
            
            set({
              session,
              user,
              isAuthenticated: true,
              appleSignInLoading: false,
              appleSignInError: null,
              error: null,
            });
          } else {
            throw new Error(result.message);
          }
        } catch (error: any) {
          set({
            appleSignInError: error.message || 'Failed to sign in with Apple',
            appleSignInLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Sign out
      signOut: async () => {
        set({ loading: true, error: null });
        
        try {
          await apiSignOut();
          
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            emailOtpSent: false,
            emailOtpError: null,
            appleSignInError: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to sign out',
            loading: false,
          });
          throw error;
        }
      },

      // Refresh session
      refreshSession: async () => {
        try {
          const session = await apiGetSession();
          let user = null;
          
          if (session?.user) {
            try {
              user = await apiGetUser();
            } catch (userError: any) {
              // If user doesn't exist (deleted from database), clear the session
              if (userError.message?.includes('User from sub claim in JWT does not exist')) {
                await apiSignOut();
                set({
                  session: null,
                  user: null,
                  isAuthenticated: false,
                  loading: false,
                });
                return;
              }
              throw userError;
            }
          }
          
          set({
            session,
            user,
            isAuthenticated: !!session && !!user,
          });
        } catch (error: any) {
          console.warn('Session refresh error:', error);
          set({ error: error.message || 'Failed to refresh session' });
        }
      },

      // Reinitialize auth state listener (useful when app comes back from background)
      reinitializeListener: async () => {
        try {
          // Clean up old listener
          if (authSubscription) {
            authSubscription.unsubscribe();
            authSubscription = null;
          }

          // Create a fresh listener
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, newSession) => {
              let newUser = null;
              
              if (newSession?.user) {
                try {
                  newUser = await apiGetUser();
                } catch (userError: any) {
                  if (userError.message?.includes('User from sub claim in JWT does not exist')) {
                    await apiSignOut();
                    set({
                      session: null,
                      user: null,
                      isAuthenticated: false,
                      loading: false,
                    });
                    return;
                  }
                }
              }
              
              set({
                session: newSession,
                user: newUser,
                isAuthenticated: !!newSession && !!newUser,
                loading: false,
              });

              if (event === 'SIGNED_IN') {
                set({ emailOtpSent: false, emailOtpError: null });
              }
            }
          );

          authSubscription = subscription;
        } catch (error: any) {
          // Silently handle listener errors - don't disrupt the app
          console.warn('Failed to reinitialize auth listener:', error);
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Clear email OTP state
      clearEmailOtpState: () => {
        set({ 
          emailOtpSent: false, 
          emailOtpError: null,
          emailOtpLoading: false 
        });
      },

      // Internal setters (for direct state updates if needed)
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      setSession: (session: Session | null) => {
        set({ session, isAuthenticated: !!session });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: 'santelle-auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist essential auth data, not loading states
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Convenience hooks for specific auth state
export const useAuth = () => {
  const store = useAuthStore();
  return {
    user: store.user,
    session: store.session,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    signOut: store.signOut,
    clearError: store.clearError,
    refreshSession: store.refreshSession,
  };
};

export const useEmailAuth = () => {
  const store = useAuthStore();
  return {
    emailOtpLoading: store.emailOtpLoading,
    emailOtpSent: store.emailOtpSent,
    emailOtpError: store.emailOtpError,
    requestEmailOtp: store.requestEmailOtp,
    verifyEmailOtp: store.verifyEmailOtp,
    clearEmailOtpState: store.clearEmailOtpState,
  };
};

export const useAppleAuth = () => {
  const store = useAuthStore();
  return {
    appleSignInLoading: store.appleSignInLoading,
    appleSignInError: store.appleSignInError,
    signInWithApple: store.signInWithApple,
  };
};

// Initialize auth store on app start
export const initializeAuth = () => {
  const store = useAuthStore.getState();
  store.initialize();
};
