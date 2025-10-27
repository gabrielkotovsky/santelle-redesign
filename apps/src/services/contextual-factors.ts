import { supabase } from '@/src/services/supabase';

export async function getContextualFactorsAnalysis(testLogId: string) {
  try {
    // First, get the test session ID from the test log
    const { data: testLog, error: logError } = await supabase
      .from('test_logs')
      .select('test_session_id')
      .eq('id', testLogId)
      .single();

    if (logError) throw logError;
    if (!testLog?.test_session_id) {
      throw new Error('No test session found for this test log');
    }

    // Call the context Supabase function
    const { data, error } = await supabase.functions.invoke('context', {
      body: {
        test_session_id: testLog.test_session_id
      }
    });

    if (error) throw error;

    return {
      analysis: data?.result || 'No contextual analysis available.',
      success: true
    };
  } catch (error) {
    console.error('Error getting contextual factors analysis:', error);
    throw error;
  }
}
