// src/services/sessionRecovery.ts
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_RECOVERY_KEY = 'santelle_session_recovery';
const SESSION_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes

interface SessionRecoveryData {
  lastCheck: number;
  sessionValid: boolean;
  retryCount: number;
}

export class SessionRecoveryService {
  private static instance: SessionRecoveryService;
  private checkInterval: number | null = null;
  private isMonitoring = false;

  static getInstance(): SessionRecoveryService {
    if (!SessionRecoveryService.instance) {
      SessionRecoveryService.instance = new SessionRecoveryService();
    }
    return SessionRecoveryService.instance;
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('Starting session recovery monitoring');
    
    // Initial check
    await this.checkAndRecoverSession();
    
    // Set up periodic checks
    this.checkInterval = setInterval(async () => {
      await this.checkAndRecoverSession();
    }, SESSION_CHECK_INTERVAL);
  }

  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('Stopped session recovery monitoring');
  }

  private async checkAndRecoverSession(): Promise<void> {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        console.log('No session found, skipping recovery');
        return;
      }

      const session = sessionData.session;
      const now = Date.now();
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
      const timeUntilExpiry = expiresAt - now;

      // If session expires within 20 minutes, try to refresh
      if (timeUntilExpiry <= 20 * 60 * 1000) {
        console.log(`Session expires in ${Math.round(timeUntilExpiry / 60000)} minutes, attempting refresh`);
        
        try {
          const { data: refreshData, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.warn('Session refresh failed:', error.message);
            await this.handleRefreshFailure();
          } else if (refreshData.session) {
            console.log('Session refreshed successfully');
            await this.updateRecoveryData(true);
          }
        } catch (refreshError) {
          console.warn('Session refresh error:', refreshError);
          await this.handleRefreshFailure();
        }
      } else {
        console.log(`Session valid for ${Math.round(timeUntilExpiry / 60000)} more minutes`);
        await this.updateRecoveryData(true);
      }
    } catch (error) {
      console.warn('Session check error:', error);
      await this.handleRefreshFailure();
    }
  }

  private async handleRefreshFailure(): Promise<void> {
    const recoveryData = await this.getRecoveryData();
    const newRetryCount = (recoveryData?.retryCount || 0) + 1;
    
    await this.updateRecoveryData(false, newRetryCount);
    
    // If we've failed too many times, clear the session
    if (newRetryCount >= 3) {
      console.log('Too many refresh failures, clearing session');
      await supabase.auth.signOut();
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
      console.warn('Failed to save recovery data:', error);
    }
  }

  private async getRecoveryData(): Promise<SessionRecoveryData | null> {
    try {
      const data = await AsyncStorage.getItem(SESSION_RECOVERY_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to get recovery data:', error);
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
      console.warn('Failed to clear recovery data:', error);
    }
  }
}

export const sessionRecoveryService = SessionRecoveryService.getInstance();
