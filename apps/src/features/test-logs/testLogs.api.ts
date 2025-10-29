import { supabase } from "@/src/services/supabase";

export type TestLog = {
  id: string;
  user_id: string;
  test_session_id: string;
  ph: number | null;
  h2o2: string | null;
  le: string | null;
  sna: string | null;
  beta_g: string | null;
  nag: string | null;
  analysis: string | null;
  analysis_healthy: string | null;
  analysis_cycle: string | null;
  gpt_5_analysis: any | null;
  status: string | null;
  created_at: string;
};

export async function ensureLog(sessionId: string): Promise<TestLog> {
  const { data: existing, error: selErr } = await supabase
    .from("test_logs")
    .select("*")
    .eq("test_session_id", sessionId)
    .maybeSingle();
  if (selErr) throw selErr;
  if (existing) return existing as TestLog;

  const { data, error } = await supabase
    .from("test_logs")
    .insert({ test_session_id: sessionId })
    .select("*")
    .single();
  if (error) throw error;
  return data as TestLog;
}

export async function getLogBySession(sessionId: string) {
  const { data, error } = await supabase
    .from("test_logs")
    .select("id, test_session_id, ph, h2o2, le, sna, beta_g, nag, status, analysis, analysis_healthy, analysis_cycle, gpt_5_analysis")
    .eq("test_session_id", sessionId)
    .maybeSingle();

  if (error) throw error;

  return data as Pick<
    TestLog,
    "id" | "test_session_id" | "ph" | "h2o2" | "le" | "sna" | "beta_g" | "nag" | "status" | "analysis" | "analysis_healthy" | "analysis_cycle" | "gpt_5_analysis"
  > | null;
}

export async function upsertLogResultsFlat(
  sessionId: string,
  patch: Partial<Pick<TestLog, "ph" | "h2o2" | "le" | "sna" | "beta_g" | "nag" | "analysis" | "status">>
): Promise<TestLog> {
  const { data, error } = await supabase
    .from("test_logs")
    .upsert({ test_session_id: sessionId, ...patch }, { onConflict: "test_session_id" })
    .select("*")
    .single();

  if (error) throw error;
  return data as TestLog;
}

export type FinalResultsPatch = {
  "H₂O₂"?: string;
  "LE"?: string;
  "SNA"?: string;
  "β-G"?: string;
  "NAG"?: string;
};

const mapUiToDb = (patch: FinalResultsPatch) => ({
  ...(patch["H₂O₂"] !== undefined ? { h2o2: patch["H₂O₂"] } : {}),
  ...(patch["LE"]   !== undefined ? { le: patch["LE"] } : {}),
  ...(patch["SNA"]  !== undefined ? { sna: patch["SNA"] } : {}),
  ...(patch["β-G"]  !== undefined ? { beta_g: patch["β-G"] } : {}),
  ...(patch["NAG"]  !== undefined ? { nag: patch["NAG"] } : {}),
});

export async function upsertFinalResultsFromUI(
  sessionId: string,
  uiPatch: FinalResultsPatch
): Promise<TestLog> {
  const dbPatch = mapUiToDb(uiPatch);

  const { data, error } = await supabase
    .from("test_logs")
    .upsert(
      { test_session_id: sessionId, ...dbPatch },
      { onConflict: "test_session_id" } // requires UNIQUE(test_session_id)
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as TestLog;
}

export async function fetchLatestTestLog(): Promise<TestLog | null> {
  const { data, error } = await supabase
    .from("test_logs")
    .select("id, test_session_id, ph, h2o2, le, sna, beta_g, nag, status, analysis, analysis_healthy, analysis_cycle, gpt_5_analysis, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as TestLog | null;
}

export async function analyzeLog(logId: string) {
  const { data, error } = await supabase.functions.invoke('analyze-results', {
    body: { test_log_id: logId },
  });
  if (error) throw error;
  return data; // your function may return { analysis, logId } or nothing—either is fine
}

export async function fetchLogById(id: string): Promise<TestLog | null> {
  const { data, error } = await supabase
    .from('test_logs')
    .select('id, test_session_id, ph, h2o2, le, sna, beta_g, nag, status, analysis, analysis_healthy, analysis_cycle, gpt_5_analysis, created_at, user_id')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as TestLog | null;
}