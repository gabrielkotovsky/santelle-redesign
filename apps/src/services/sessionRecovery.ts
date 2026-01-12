// src/services/sessionRecovery.ts
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_RECOVERY_KEY = 'santelle_session_recovery';
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes (reduced from 10)

interface SessionRecoveryData {
  lastCheck: number;
  sessionValid: boolean;
  retryCount: number;
}

export class SessionRecoveryService {
  private static instance: SessionRecoveryService;
  private checkTimeout: ReturnType<typeof setTimeout> | null = null;
  private isMonitoring = false;

  static getInstance(): SessionRecoveryService {
    if (!SessionRecoveryService.instance) {
      SessionRecoveryService.instance = new SessionRecoveryService();
    }
    return SessionRecoveryService.instance;
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    
    // Initial check
    await this.checkAndRecoverSession();
    
    // Set up recursive timeout for more reliable background execution
    this.scheduleNextCheck();
  }

  private scheduleNextCheck(): void {
    if (!this.isMonitoring) return;
    
    this.checkTimeout = setTimeout(async () => {
      await this.checkAndRecoverSession();
      this.scheduleNextCheck(); // Schedule next check after completion
    }, SESSION_CHECK_INTERVAL);
  }

  stopMonitoring(): void {
    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
      this.checkTimeout = null;
    }
    this.isMonitoring = false;
  }

  private async checkAndRecoverSession(): Promise<void> {
    if (!this.isMonitoring) return;
    
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        await this.handleRefreshFailure();
        return;
      }
      
      if (!sessionData.session) {
        return;
      }

      const session = sessionData.session;
      const now = Date.now();
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const timeUntilExpiry = expiresAt - now;

      // If session is expired or expires within 20 minutes, try to refresh
      if (timeUntilExpiry <= 20 * 60 * 1000) {
        try {
          console.log('🔄 Refreshing token (session recovery)', {
            timeUntilExpiry: `${Math.round(timeUntilExpiry / 1000 / 60)} minutes`,
          });
          const { data: refreshData, error } = await supabase.auth.refreshSession();
          
          if (error) {
            await this.handleRefreshFailure();
          } else if (refreshData.session) {
            await this.updateRecoveryData(true);
            
            // Update Realtime auth token after successful refresh
            if (refreshData.session.access_token) {
              supabase.realtime.setAuth(refreshData.session.access_token);
            }
          }
        } catch (refreshError) {
          await this.handleRefreshFailure();
        }
      } else {
        // Session is still valid
        await this.updateRecoveryData(true);
      }
    } catch (error) {
      await this.handleRefreshFailure();
    }
  }

  private async handleRefreshFailure(): Promise<void> {
    const recoveryData = await this.getRecoveryData();
    const newRetryCount = (recoveryData?.retryCount || 0) + 1;
    
    await this.updateRecoveryData(false, newRetryCount);
    
    // If we've failed too many times (increased to 5 attempts), clear the session
    // This prevents premature sign-outs due to temporary network issues
    if (newRetryCount >= 5) {
      try {
        await supabase.auth.signOut();
      } catch (signOutError) {
        // Silently handle sign out error
      }
    }
  }

  private async updateRecoveryData(sessionValid: boolean, retryCount = 0): Promise<void> {
    const recoveryData: SessionRecoveryData = {
      lastCheck: Date.now(),
      sessionValid,
      retryCount,
    };
    
    try {
      await AsyncStorage.setItem(SESSION_RECOVERY_KEY, JSON.stringify(recoveryData));
    } catch (error) {
      // Silently handle storage error
    }
  }

  private async getRecoveryData(): Promise<SessionRecoveryData | null> {
    try {
      const data = await AsyncStorage.getItem(SESSION_RECOVERY_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  async getLastRecoveryStatus(): Promise<SessionRecoveryData | null> {
    return this.getRecoveryData();
  }

  async clearRecoveryData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_RECOVERY_KEY);
    } catch (error) {
      // Silently handle storage error
    }
  }

  // Force an immediate session check (useful for manual recovery)
  async forceCheck(): Promise<void> {
    await this.checkAndRecoverSession();
  }
}

export const sessionRecoveryService = SessionRecoveryService.getInstance();
