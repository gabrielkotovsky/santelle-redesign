import { useCallback, useState } from 'react';
import { useAuth } from '@/src/features/auth/auth.store';
import { supabase } from '@/src/services/supabase';
import { sessionRecoveryService } from '@/src/services/sessionRecovery';
import NetInfo from '@react-native-community/netinfo';
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
 * Custom hook that provides pull-to-refresh functionality with enhanced Supabase reconnection
 * Attempts to refresh the session and reconnect Realtime when there's no valid connection
 */
export function useSupabaseRefresh(options: UseSupabaseRefreshOptions = {}): UseSupabaseRefreshReturn {
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated, refreshSession, session, reinitializeListener } = useAuth();
  const { onRefresh: customOnRefresh, hapticFeedback = true } = options;

  const reconnectRealtime = async (): Promise<void> => {
    try {
      // Check network connectivity first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return;
      }

      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      
      if (token) {
        // Disconnect first to clean up stale connections
        supabase.realtime.disconnect();
        
        // Wait a bit before reconnecting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set auth and reconnect
        supabase.realtime.setAuth(token);
        supabase.realtime.connect();
        
        // Re-subscribe channels
        const channels = supabase.getChannels();
        for (const channel of channels) {
          if (channel.state !== 'joined') {
            await channel.subscribe();
          }
        }
      }
    } catch (error) {
      // Silently handle Realtime reconnection error
    }
  };

  const handleRefresh = useCallback(async () => {
    if (refreshing) return; // Prevent multiple simultaneous refreshes
    
    setRefreshing(true);
    
    try {
      // Provide haptic feedback
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        return;
      }

      // Check if we have a valid session
      const hasValidSession = isAuthenticated && session?.access_token;
      
      if (!hasValidSession) {
        
        // Try to refresh the session with timeout
        const refreshPromise = supabase.auth.refreshSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session refresh timeout')), 15000)
        );
        
        await Promise.race([refreshPromise, timeoutPromise]);
        await refreshSession();
      } else {
        // Proactively refresh if session expires soon
        const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
        const timeUntilExpiry = expiresAt - Date.now();
        
        if (timeUntilExpiry <= 10 * 60 * 1000) { // 10 minutes
          await supabase.auth.refreshSession();
          await refreshSession();
        }
      }

      // Reinitialize auth listener
      await reinitializeListener();
      
      // Reconnect Realtime
      await reconnectRealtime();
      
      // Force a session recovery check
      await sessionRecoveryService.forceCheck();

      // Call custom refresh function if provided
      if (customOnRefresh) {
        await customOnRefresh();
      }

    } catch (error) {
      // Fallback: try basic recovery
      try {
        await refreshSession();
        await reconnectRealtime();
      } catch (fallbackError) {
        // Silently handle fallback error
      }
    } finally {
      setRefreshing(false);
    }
  }, [refreshing, isAuthenticated, session, refreshSession, reinitializeListener, customOnRefresh, hapticFeedback]);

  return {
    refreshing,
    onRefresh: handleRefresh,
    isConnected: isAuthenticated && !!session?.access_token,
  };
}
