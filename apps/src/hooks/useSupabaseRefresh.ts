import { useCallback, useState } from 'react';
import { useAuth } from '@/src/features/auth/auth.store';
import * as Haptics from 'expo-haptics';

export interface UseSupabaseRefreshOptions {
  onRefresh?: () => Promise<void>;
  hapticFeedback?: boolean;
}

export interface UseSupabaseRefreshReturn {
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  isConnected: boolean;
}

/**
 * Custom hook that provides pull-to-refresh functionality with Supabase reconnection
 * Attempts to refresh the session when there's no valid connection
 */
export function useSupabaseRefresh(options: UseSupabaseRefreshOptions = {}): UseSupabaseRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated, refreshSession, session } = useAuth();
  const { onRefresh: customOnRefresh, hapticFeedback = true } = options;

  const handleRefresh = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes
    
    setRefreshing(true);
    
    try {
      // Provide haptic feedback
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Check if we have a valid session
      const hasValidSession = isAuthenticated && session?.access_token;
      
      if (!hasValidSession) {
        console.log('No valid session found, attempting to refresh...');
        // Try to refresh the session
        await refreshSession();
      }

      // Call custom refresh function if provided
      if (customOnRefresh) {
        await customOnRefresh();
      }

    } catch (error) {
      console.error('Refresh error:', error);
      // Don't throw the error - let the UI handle it gracefully
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, isAuthenticated, session, refreshSession, customOnRefresh, hapticFeedback]);

  return {
    refreshing,
    onRefresh: handleRefresh,
    isConnected: isAuthenticated && !!session?.access_token,
  };
}
