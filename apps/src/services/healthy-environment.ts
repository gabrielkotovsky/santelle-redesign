import { supabase } from './supabase';

export async function getHealthyEnvironmentAnalysis(testLogId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('healthy-environment', {
      body: { test_log_id: testLogId }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
