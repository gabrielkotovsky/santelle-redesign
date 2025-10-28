// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import OpenAI from "https://esm.sh/openai@4.56.0";

type TestLog = {
  id: string;
  ph: number | null;
  h2o2: string | null;
  le: string | null;
  sna: string | null;
  beta_g: string | null;
  nag: string | null;
  analysis: string | null;
  user_id?: string | null;
  test_session_id?: string | null;
  created_at: string;
};

type Question = {
  id: string;
  slug: string;
  prompt: string;
  type: string;
  symptom_or_context: string;
};

type CycleAnswer = {
  question_slug: string;
  question_prompt: string;
  question_type: string;
  selected_values: string[];
  free_value: string | null;
};

type CycleEffect = {
  cycle_phase: string;
  effect_description: string;
  mechanism: string;
  biomarkers_affected: string[];
  influence: "increase" | "decrease" | "mixed" | "unclear";
  confidence: number; // 0..1
};

type CycleAnalysis = {
  summary?: string;
  cycle_effects?: CycleEffect[];
};

type CycleContextResponse = {
  question: Question | null;
  current_test: TestLog | null;
  biomarker_results: {
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
  };
  cycle_answer: CycleAnswer | null;
  cycle_analysis: string | null;
  analysis: string | null;
  formatted_response: string;
  message: string;
  disclaimer: string;
};

const SUPABASE_URL = Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")!;
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;

function formatCycleAnalysisToText(analysis: CycleAnalysis, maxEffects = 3): string {
  if (!analysis) return "No cycle analysis available.";

  const lines: string[] = [];

  const effects = (analysis.cycle_effects ?? [])
    .filter(e => e?.cycle_phase)
    .sort((x, y) => (y.confidence ?? 0) - (x.confidence ?? 0))
    .slice(0, maxEffects);

  if (effects.length) {
    lines.push("How your cycle may be affecting your results:");
    effects.forEach((effect) => {
      lines.push(
        `**${effect.cycle_phase}**\nEffect: ${effect.effect_description}\nMechanism: ${effect.mechanism}`
      );
    });
  } else {
    lines.push("No specific cycle effects identified from your current cycle status.");
  }

  return lines.join("\n");
}

async function analyzeCycleEffects(
  cycleAnswer: CycleAnswer | null,
  biomarkers: {
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
  }
): Promise<string> {
  if (!cycleAnswer || !cycleAnswer.selected_values.length) {
    return "No cycle information available to analyze effects on your results.";
  }

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const systemPrompt = `
You are a women's health explainer. Analyze how menstrual cycle phases may influence at-home vaginal biomarker readings.

Critical constraint:
- You may ONLY consider cycle effects that are directly related to the user's reported cycle status.
- DO NOT invent cycle phases or effects not mentioned in the user's answer.
- Biomarkers may be used ONLY to explain plausible mechanisms for how the reported cycle phase could affect the observed pattern.

Objectives:
- Identify how the user's reported cycle phase could influence their biomarker readings.
- For each identified effect, explain a plausible MECHANISM relating the cycle phase to biomarker patterns.
- Calibrate CONFIDENCE based on scientific evidence and coherence with the biomarker pattern.
- If uncertain, say so. Prefer reassurance language.
- Do NOT diagnose or recommend prescription treatments. Avoid medical advice.

Ground rules:
- If no relevant cycle information is provided, return an empty list and a brief reassuring summary.
- Focus on established scientific knowledge about hormonal changes during menstrual cycles.
- Output STRICT JSON (no Markdown). Keys and value types must match the schema.

JSON schema to return:
{
  "summary": "string",
  "cycle_effects": [
    {
      "cycle_phase": "string",                    // the cycle phase from user's answer
      "effect_description": "string",             // how this phase affects biomarkers
      "mechanism": "string",                      // scientific explanation of the mechanism
      "biomarkers_affected": ["pH"|"H2O2"|"LE"|"SNA"|"beta_G"|"NAG"],
      "influence": "increase|decrease|mixed|unclear",
      "confidence": 0.0
    }
  ]
}
`.trim();

  const payload = {
    cycle_answer: cycleAnswer,
    biomarkers: biomarkers,
  };

  const userPrompt = `
Use the JSON in DATA to analyze how the user's reported cycle phase may affect their biomarker results.
Only consider effects directly related to the reported cycle phase.
Use biomarkers to explain mechanisms, not to introduce additional factors.

Return only valid JSON matching the schema from the system message.

DATA:
${JSON.stringify(payload, null, 2)}
`.trim();

  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages,
  });

  const jsonResponse = chat.choices[0]?.message?.content ?? "{}";

  try {
    const analysis: CycleAnalysis = JSON.parse(jsonResponse);
    return formatCycleAnalysisToText(analysis);
  } catch (error) {
    console.error("Failed to parse cycle analysis JSON response:", error);
    return jsonResponse; // Fallback to raw JSON if parsing fails
  }
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { question_slug, test_log_id } = await req.json();
    
    if (!question_slug) {
      return new Response(JSON.stringify({ 
        error: "question_slug is required",
        disclaimer: "⚠️ **Important Medical Disclaimer**: This information is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns or before making decisions about your health."
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Supabase admin client (service role)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // 1) Find the specific question by slug
    const { data: question, error: questionErr } = await admin
      .from("app_pretest_questions")
      .select("id, slug, prompt, type, symptom_or_context")
      .eq("slug", question_slug)
      .maybeSingle();

    if (questionErr) throw questionErr;
    if (!question) {
      return new Response(JSON.stringify({ 
        error: `Question with slug "${question_slug}" not found`,
        disclaimer: "⚠️ **Important Medical Disclaimer**: This information is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns or before making decisions about your health."
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2) Get the current test log (either specified or latest)
    let testLog: TestLog | null = null;
    
    if (test_log_id) {
      // Get specific test log
      const { data: log, error: logErr } = await admin
        .from("test_logs")
        .select("id, ph, h2o2, le, sna, beta_g, nag, analysis, user_id, test_session_id, created_at")
        .eq("id", test_log_id)
        .maybeSingle();
      
      if (logErr) throw logErr;
      testLog = log;
    } else {
      // Get the most recent test log
      const { data: log, error: logErr } = await admin
        .from("test_logs")
        .select("id, ph, h2o2, le, sna, beta_g, nag, analysis, user_id, test_session_id, created_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (logErr) throw logErr;
      testLog = log;
    }

    if (!testLog) {
      return new Response(JSON.stringify({ 
        error: "No test logs found",
        disclaimer: "⚠️ **Important Medical Disclaimer**: This information is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns or before making decisions about your health."
      }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3) Get cycle question answer if test_session_id exists
    let cycleAnswer: CycleAnswer | null = null;
    if (testLog.test_session_id) {
      const { data: pretestRows, error: pretestErr } = await admin
        .from("app_pretest_responses")
        .select(`
          app_pretest_questions!inner ( slug, prompt, type, symptom_or_context ),
          app_pretest_response_choices (
            choice_id
          )
        `)
        .eq("test_session_id", testLog.test_session_id)
        .eq("app_pretest_questions.slug", question_slug);

      if (!pretestErr && pretestRows && pretestRows.length > 0) {
        const pretestRow = pretestRows[0]; // Should only be one cycle question
        
        // Get all choice IDs
        const choiceIds = (pretestRow.app_pretest_response_choices ?? []).map((c: any) => c.choice_id);
        
        // Fetch choice labels separately
        const { data: choices, error: choicesErr } = await admin
          .from("app_pretest_choices")
          .select("id, label")
          .in("id", choiceIds);
          
        if (!choicesErr && choices) {
          const selectedValues = (pretestRow.app_pretest_response_choices ?? []).map((c: any) => {
            const choice = choices.find(ch => ch.id === c.choice_id);
            return choice ? choice.label : c.choice_id;
          });
          
          cycleAnswer = {
            question_slug: pretestRow.app_pretest_questions.slug,
            question_prompt: pretestRow.app_pretest_questions.prompt,
            question_type: pretestRow.app_pretest_questions.type,
            selected_values: selectedValues,
            free_value: null,
          };
        }
      }
    }

    // 4) Generate cycle analysis
    const biomarkerResults = {
      ph: testLog.ph,
      h2o2: testLog.h2o2,
      le: testLog.le,
      sna: testLog.sna,
      beta_g: testLog.beta_g,
      nag: testLog.nag,
    };

    let cycleAnalysis: string | null = null;
    try {
      cycleAnalysis = await analyzeCycleEffects(cycleAnswer, biomarkerResults);
    } catch (error) {
      console.error('Error generating cycle analysis:', error);
      cycleAnalysis = "Unable to analyze cycle effects at this time.";
    }

    // 5) Format the complete response text
    const formattedResponse =`${cycleAnalysis}`;

    // 6) Save cycle analysis to database
    try {
      const { error: updateErr } = await admin
        .from("test_logs")
        .update({ analysis_cycle: cycleAnalysis })
        .eq("id", testLog.id);
      
      if (updateErr) {
        console.error('Error saving cycle analysis to database:', updateErr);
      }
    } catch (error) {
      console.error('Error updating test_logs with cycle analysis:', error);
    }

    const response: CycleContextResponse = {
      question: question as Question,
      current_test: testLog as TestLog,
      biomarker_results: biomarkerResults,
      cycle_answer: cycleAnswer,
      cycle_analysis: cycleAnalysis,
      analysis: testLog.analysis,
      formatted_response: formattedResponse,
      message: `Found question "${question.prompt}"${cycleAnswer ? ` with answer: "${cycleAnswer.selected_values.join(', ')}"` : ''} and current test results from ${new Date(testLog.created_at).toLocaleDateString()}`,
      disclaimer: "⚠️ **Important Medical Disclaimer**: This information is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns or before making decisions about your health. The biomarker results and analysis provided should not replace professional medical consultation."
    };

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    console.error("cycle-context error:", e);
    return new Response(JSON.stringify({ 
      error: String(e?.message ?? e),
      disclaimer: "⚠️ **Important Medical Disclaimer**: This information is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns or before making decisions about your health."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cycle-context' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"question_slug":"cycle"}'

  Optional: specify a specific test_log_id:
  --data '{"question_slug":"cycle","test_log_id":"<test-log-uuid>"}'

*/
