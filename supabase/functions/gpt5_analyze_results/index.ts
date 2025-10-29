// index.ts
// Enable Supabase Edge Runtime types (autocomplete, types, etc.)
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import type { AnalyzeResponse } from "./types.ts";
import { fetchData } from "./fetchData.ts";
import { sendPromptForAnalysis } from "./sendPrompt.ts";
import { updateColumn } from "./updateColumn.ts";

type RequestBody = {
  test_session_id?: string;
  update?: {
    table: string;
    id_column: string;
    id_value: string | number;
    target_column: string;
  };
  dryRun?: boolean;
};

console.log("gpt5_analyze_results: booting edge function");

Deno.serve(async (req) => {
  console.log("[Edge Function] Request received");
  try {
    if (req.method !== "POST") {
      console.log("[Edge Function] Method not allowed:", req.method);
      return new Response("Method Not Allowed", { status: 405 });
    }

    console.log("[Edge Function] Parsing request body...");
    const body = (await req.json().catch(() => ({}))) as RequestBody;
    console.log("[Edge Function] Request body:", JSON.stringify(body, null, 2));
    
    const test_session_id = body?.test_session_id;
    if (!test_session_id) {
      console.error("[Edge Function] Missing test_session_id");
      return Response.json({ error: "Missing 'test_session_id'." }, { status: 400 });
    }
    console.log("[Edge Function] test_session_id:", test_session_id);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    console.log("[Edge Function] Environment check:", {
      supabaseUrl: supabaseUrl ? "present" : "missing",
      serviceKey: serviceKey ? "present" : "missing",
      openaiKey: openaiKey ? "present" : "missing",
    });
    
    if (!supabaseUrl || !serviceKey) {
      console.error("[Edge Function] Missing Supabase env vars");
      return Response.json(
        { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars." },
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
      global: { headers: { "X-Client-Info": "gpt5_analyze_results/1.0.0" } },
    });
    console.log("[Edge Function] Supabase client created");

    // 0) Check if analysis already exists in database
    console.log("[Edge Function] Checking for existing analysis...");
    const { data: existingLog, error: checkError } = await supabase
      .from("test_logs")
      .select("gpt_5_analysis")
      .eq("test_session_id", test_session_id)
      .maybeSingle();
    
    if (checkError) {
      console.error("[Edge Function] Error checking for existing analysis:", checkError);
      throw checkError;
    }

    // If analysis exists and is valid, return it immediately
    if (existingLog?.gpt_5_analysis) {
      let cachedAnalysis = existingLog.gpt_5_analysis;
      
      // Parse if it's a string
      if (typeof cachedAnalysis === 'string') {
        try {
          cachedAnalysis = JSON.parse(cachedAnalysis);
        } catch (e) {
          console.warn("[Edge Function] Failed to parse cached analysis, will regenerate");
          cachedAnalysis = null;
        }
      }
      
      // Validate the cached analysis
      if (cachedAnalysis && 
          typeof cachedAnalysis === 'object' && 
          cachedAnalysis.biomarkers && 
          Array.isArray(cachedAnalysis.biomarkers) &&
          cachedAnalysis.biomarkers.length > 0) {
        console.log("[Edge Function] ✅ Valid cached analysis found, returning it");
        console.log("[Edge Function] Cached biomarker count:", cachedAnalysis.biomarkers?.length);
        
        // Return cached analysis without calling GPT or fetching full data
        const res: AnalyzeResponse = {
          test_session_id,
          // data_used is optional for cached responses - saves DB queries and GPT calls
          analysis: cachedAnalysis,
          // No update needed since it's already in the database
        };
        
        return Response.json(res, { status: 200 });
      }
      
      console.log("[Edge Function] Cached analysis invalid or incomplete, will regenerate");
    } else {
      console.log("[Edge Function] No cached analysis found, will generate new one");
    }

    // 1) Gather inputs from your DB
    console.log("[Edge Function] Fetching data...");
    const dataUsed = await fetchData(supabase, test_session_id);
    console.log("[Edge Function] Data fetched:", {
      biomarkers: dataUsed.biomarkers,
      symptomCount: dataUsed.symptoms.length,
      manufacturerTextLength: dataUsed.manufacturer_text.length
    });

    // 2) Call GPT-5 with strict JSON schema for per-biomarker explanations
    console.log("[Edge Function] Calling GPT for analysis...");
    const analysis = await sendPromptForAnalysis(dataUsed);
    console.log("[Edge Function] Analysis received:", {
      biomarkerCount: analysis.biomarkers?.length
    });

    // 3) Optional persistence (skipped on dryRun)
    if (body.update && !body.dryRun) {
      console.log("[Edge Function] Updating database column...");
      await updateColumn(supabase, {
        table: body.update.table,
        id_column: body.update.id_column,
        id_value: body.update.id_value,
        target_column: body.update.target_column,
        value: analysis,
      });
      console.log("[Edge Function] Database updated successfully");
    } else {
      console.log("[Edge Function] Skipping database update (dryRun or no update config)");
    }

    const res: AnalyzeResponse = {
      test_session_id,
      data_used: dataUsed,
      analysis,
      updated: body.update
        ? {
            table: body.update.table,
            column: body.update.target_column,
            id_column: body.update.id_column,
            id_value: body.update.id_value,
          }
        : undefined,
    };

    console.log("[Edge Function] Returning success response");
    return Response.json(res, { status: 200 });
  } catch (err) {
    console.error("[Edge Function] Error caught:", err);
    console.error("[Edge Function] Error details:", {
      message: err?.message,
      stack: err?.stack,
      name: err?.name
    });
    return Response.json(
      { error: "Internal error", details: String(err?.message ?? err) },
      { status: 500 },
    );
  }
});

/* To invoke locally:

  1) supabase start
  2) curl:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/gpt5_analyze_results' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{
      "test_session_id": "YOUR-SESSION-UUID",
      "dryRun": true,
      "update": {
        "table": "test_logs",
        "id_column": "test_session_id",
        "id_value": "YOUR-SESSION-UUID",
        "target_column": "gpt_5_analysis"
      }
    }'
*/