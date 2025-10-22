import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "openai";
import { createClient } from "supabase";

type HealthData = {
  id: string;
  user_id: string;
  test_results?: any;
  symptoms?: string[];
  lifestyle_factors?: string[];
  created_at: string;
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")!;

function buildHealthInsightsPrompt(data: HealthData) {
  return `You are a women's health and wellness coach. Your role is to provide personalized health insights and recommendations based on user data.

<context>
User ID: ${data.user_id}
Data collected: ${data.created_at}
</context>

<user_data>
Test Results: ${JSON.stringify(data.test_results || "No test data available")}
Reported Symptoms: ${data.symptoms?.join(", ") || "No symptoms reported"}
Lifestyle Factors: ${data.lifestyle_factors?.join(", ") || "No lifestyle data available"}
</user_data>

<instructions>
1. Analyze the provided data holistically
2. Identify patterns and connections between different health markers
3. Provide personalized wellness recommendations
4. Suggest lifestyle adjustments that could improve vaginal health
5. Recommend when to retest or seek professional care
6. Keep recommendations practical and actionable
7. Use an encouraging, supportive tone
8. Include relevant emojis to make the content more engaging
</instructions>

<output_format>
Provide your response in the following structure:
- **Health Overview**: Brief summary of current status
- **Key Insights**: 2-3 main observations about their health patterns
- **Wellness Recommendations**: 3-5 specific, actionable suggestions
- **Next Steps**: When to retest or seek professional advice
- **Encouragement**: A supportive closing message

Remember: This is educational content only, not medical advice. Always encourage users to consult healthcare professionals for medical concerns.`;
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { user_id, model = "gpt-4o-mini" } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ error: "user_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // server-side supabase (service role) to bypass RLS for this write
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // 1) Load user's health data (recent test logs, symptoms, lifestyle data)
    const { data: testLogs, error: testErr } = await admin
      .from("test_logs")
      .select("id, ph, h2o2, le, sna, beta_g, nag, analysis, created_at")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (testErr) throw testErr;

    // 2) Load user profile and preferences
    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("symptoms, lifestyle_factors, health_goals")
      .eq("id", user_id)
      .single();

    if (profileErr && profileErr.code !== "PGRST116") throw profileErr;

    // 3) Prepare health data for analysis
    const healthData: HealthData = {
      id: user_id,
      user_id,
      test_results: testLogs,
      symptoms: profile?.symptoms || [],
      lifestyle_factors: profile?.lifestyle_factors || [],
      created_at: new Date().toISOString(),
    };

    // 4) Build prompt and call OpenAI
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const prompt = buildHealthInsightsPrompt(healthData);

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable women's health and wellness coach. You provide personalized insights and recommendations based on health data. Always maintain a supportive, encouraging tone while being factual and educational. Never provide medical diagnoses or treatment recommendations - always encourage users to consult healthcare professionals for medical concerns.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const insights = completion.choices?.[0]?.message?.content?.trim() || "No insights generated.";

    // 5) Save insights to database (optional - you might want to store these)
    const { data: savedInsights, error: saveErr } = await admin
      .from("health_insights")
      .insert({
        user_id,
        insights,
        data_snapshot: healthData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveErr) {
      console.warn("Failed to save insights:", saveErr);
      // Continue without saving - insights are still returned
    }

    return new Response(JSON.stringify({ 
      ok: true, 
      insights,
      data_analyzed: healthData,
      saved: !!savedInsights
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("health-insights error:", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/health-insights' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"user_id":"user-uuid-here"}'

*/
