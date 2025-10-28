import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

import { fetchBiomarkers } from "./fetchBiomarkers.ts";
import { fetchPretestAnswers } from "./fetchPretest.ts";
import { sendPromptToChatGPT } from "./sendPrompt.ts";
import { updateAnalysisFactors } from "./updateColumn.ts";

serve(async (req) => {
  try {
    if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405 });
    const body = await req.json().catch(() => ({}));
    const test_session_id: string | undefined = body?.test_session_id;
    if (!test_session_id) return new Response("Missing test_session_id", { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Manual auth check since service_role bypasses RLS
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: authUser } = await supabase.auth.getUser(token);
    if (!authUser?.user) return new Response("Unauthorized", { status: 401 });

    const { data: session, error: sErr } = await supabase
      .from("test_sessions")
      .select("id, user_id")
      .eq("id", test_session_id)
      .single();
    if (sErr) throw sErr;
    if (session.user_id !== authUser.user.id)
      return new Response("Forbidden", { status: 403 });

    // 1. Biomarkers
    const biomarkers = await fetchBiomarkers(supabase, test_session_id);

    // 2. Pretest
    const pretest_answers = await fetchPretestAnswers(supabase, test_session_id);

    // 3. Prompt -> ChatGPT
    const result = await sendPromptToChatGPT({
      test_session_id,
      biomarkers,
      pretest_answers,
    });

    // 4. Update only analysis_factors
    await updateAnalysisFactors(supabase, test_session_id, result);

    return new Response(
      JSON.stringify({ status: "ok", sent: { biomarkers, pretest_answers }, result }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error('Context function error:', err);
    console.error('Error details:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name
    });
    return new Response(JSON.stringify({ 
      error: String(err?.message ?? err),
      details: err?.stack 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
