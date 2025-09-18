import { supabase } from '@/src/services/supabase';

export type TestSession = {
    id: string;
    user_id: string;
    status: "in_progress" | "completed" | "aborted";
    current_step: number;
    started_at: string;
    results_ready_at: string | null;
    ph_result_ready_at: string | null;
    completed_at: string | null;
    meta: Record<string, unknown>;
};
export type TestResults = {
    id: string;
    session_id: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    betag: string | null;
    nag: string | null;
    notes: string | null;
    created_at: string;
}

export async function fetchOpenSession(): Promise<TestSession | null> {
    const { data, error } = await supabase
      .from("test_sessions")
      .select("*")
      .eq("status", "in_progress")
      .order("started_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    console.log('📡 [API] Fetched open session:', data);
    return data;
}
export async function createSession(): Promise<TestSession> {
    const { data, error } = await supabase
      .from("test_sessions")
      .insert({ user_id: 'c0ac0096-11db-48ee-b1ae-4cfdfae91c7c' }) 
      .select("*")
      .single();
    if (error) throw error;
    return data;
} 
export async function setStep(sessionId: string, step: number): Promise<TestSession> {
    const { data, error } = await supabase
      .from("test_sessions")
      .update({ current_step: step })
      .eq("id", sessionId)
      .select("*")
      .single();
    if (error) throw error;
    return data;
}
export async function setPhResultsReadyAt(sessionId: string, iso: string): Promise<TestSession> {
  const { data, error } = await supabase
    .from("test_sessions")
    .update({ ph_result_ready_at: iso })
    .eq("id", sessionId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
export async function setResultsReadyAt(sessionId: string, iso: string): Promise<TestSession> {
    const { data, error } = await supabase
      .from("test_sessions")
      .update({ results_ready_at: iso })
      .eq("id", sessionId)
      .select("*")
      .single();
    if (error) throw error;
    return data;
}  
export async function completeSession(sessionId: string): Promise<TestSession> {
    const { data, error } = await supabase
      .from("test_sessions")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", sessionId)
      .select("*")
      .single();
    if (error) throw error;
    return data;
}
export async function abortSession(sessionId: string, reason?: string): Promise<void> {
    const { error } = await supabase
      .from("test_sessions")
      .update({ status: "aborted"})
      .eq("id", sessionId);
    if (error) throw error;
}
export async function upsertResults(sessionId: string, patch: Partial<Omit<TestResults, "id" | "session_id" | "created_at">>) {
    const { data: existing, error: selErr } = await supabase
      .from("test_results")
      .select("*")
      .eq("session_id", sessionId)
      .maybeSingle();
    if (selErr) throw selErr;
  
    if (existing) {
      const { data, error } = await supabase
        .from("test_results")
        .update(patch)
        .eq("session_id", sessionId)
        .select("*")
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("test_results")
        .insert({ session_id: sessionId, ...patch })
        .select("*")
        .single();
      if (error) throw error;
      return data;
    }
}