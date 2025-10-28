import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "openai";
import { createClient } from "supabase";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
const SUPABASE_URL = Deno.env.get("EXPO_PUBLIC_SUPABASE_URL");
const SERVICE_ROLE = Deno.env.get("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");

type HealthyAlt = {
  source: "biomarker" | "pretest";
  key: string;
  user_value: string;
  reason_non_healthy: string;
  healthy_baseline: string;
  practical_tips: string;
  citations?: { id: string; title: string }[];
};

type StructuredOut = {
  healthy_alternatives?: HealthyAlt[];
  reassurance?: string;
  data_quality?: { issues?: string[]; missing_fields?: string[] };
};

function formatChatMessage(
  parsed: StructuredOut,
  opts?: { displayName?: string | null; maxItems?: number }
): string {
  const name = opts?.displayName?.trim();
  const maxItems = opts?.maxItems ?? 5;

  const parts: string[] = [];

  const items = (parsed.healthy_alternatives ?? []).slice(0, maxItems);
  if (items.length) {
    parts.push("", "Here's what **\"healthy\"** usually looks like:");
    items.forEach((it, i) => {
      const tag = it.source === "biomarker" ? "marker" : "pretest";
      parts.push(
        `\n**${i + 1}. ${it.key}** (${tag})`,
        `• **Healthy baseline:** ${it.healthy_baseline}`
      );
    });
  }

  if (parsed.reassurance) {
    parts.push("", `*${parsed.reassurance.trim()}*`);
  }

  if (parsed.data_quality?.issues?.length) {
    parts.push("", `Heads up: ${parsed.data_quality.issues.join("; ")}`);
  }

  parts.push("", "*This is general information, not medical advice.*");
  return parts.join("\n");
}

const SYSTEM_PROMPT = `
You are a women's health explainer. Given biomarker results and pretest answers,
enumerate each NON-HEALTHY finding and describe what a HEALTHY alternative looks like,
grounded in the provided manufacturer text and general non-biomarker symptom knowledge.

Safety:
- Do NOT diagnose or recommend prescription treatments/antibiotics.
- Use plain, supportive language. Be factual and concise.

What counts as NON-HEALTHY:
- Biomarkers outside healthy ranges or positive markers suggesting imbalance.
- Pretest answers indicating symptoms associated with imbalance (e.g., burning, itching, unusual discharge, pain, odor).

IMPORTANT: For pretest symptoms, only include them in healthy_alternatives if they represent actual symptoms the user is experiencing. If a user reports "No symptoms" or "None", do NOT include that as a non-healthy finding.

For EACH non-healthy finding, return:
- the original finding (source + key + user_value)
- why it's considered non-healthy (short evidence)
- the healthy baseline description
- practical, non-medical tips that move toward the healthy baseline
- minimal citations derived only from the provided manufacturer text

If nothing is non-healthy, produce an empty list and a reassuring summary.

Output STRICT JSON (no Markdown) with this schema:
{
  "healthy_alternatives": [
    {
      "source": "biomarker" | "pretest",
      "key": "string",                // e.g., "pH", "symptom_burning", "product_wash"
      "user_value": "string",         // e.g., "pH 4.8", "reported itching"
      "reason_non_healthy": "string", // short, evidence-based
      "healthy_baseline": "string",   // what 'healthy' looks like
      "practical_tips": "string",     // non-medical, lifestyle/technique context
      "citations": [ { "id": "string", "title": "string" } ]
    }
  ],
  "reassurance": "string"
}
`.trim();

function buildUserPrompt(payload: {
  test_session_id: string;
  biomarkers: any;
  pretest_answers: any[];
  manufacturer: { id: string; title: string; body: string };
}) {
  return `
Use the JSON in DATA. Consider manufacturer guidance as PROVIDED_KNOWLEDGE for healthy baselines and ranges.
Return only valid JSON matching the schema from the system message.

DATA:
${JSON.stringify({
  test_session_id: payload.test_session_id,
  biomarkers: payload.biomarkers,
  pretest_answers: payload.pretest_answers,
}, null, 2)}

PROVIDED_KNOWLEDGE:
${JSON.stringify([payload.manufacturer], null, 2)}
`.trim();
}
Deno.serve(async (req)=>{
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({
        error: "Method not allowed"
      }), {
        status: 405,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const { test_log_id, model = "gpt-4o-mini" } = await req.json();
    if (!test_log_id) {
      return new Response(JSON.stringify({
        error: "test_log_id is required"
      }), {
        status: 100,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    // server-side supabase (service role) to bypass RLS for this write
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: {
        headers: {
          Authorization: req.headers.get("Authorization") ?? ""
        }
      }
    });
    // 1) Load the test log
    const { data: log, error: selErr } = await admin.from("test_logs").select("id, ph, h2o2, le, sna, beta_g, nag, analysis, user_id, test_session_id").eq("id", test_log_id).maybeSingle();
    if (selErr) throw selErr;
    if (!log) {
      return new Response(JSON.stringify({
        error: "Test log not found"
      }), {
        status: 404,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }

    // 2) Get user's display name
    let displayName = null;
    if (log.user_id) {
      const { data: onboardingData, error: onboardingErr } = await admin.from("onboarding_responses").select("display_name").eq("user_id", log.user_id).single();
      if (!onboardingErr && onboardingData?.display_name) {
        displayName = onboardingData.display_name;
      }
    }

    // 3) Get pretest answers if test_session_id exists
    let pretest_answers = [];
    if (log.test_session_id) {
      const { data: pretestRows, error: pretestErr } = await admin
        .from("app_pretest_responses")
        .select(`
          app_pretest_questions!inner ( slug, prompt, type, symptom_or_context ),
          app_pretest_response_choices (
            choice_id
          )
        `)
        .eq("test_session_id", log.test_session_id)
        .eq("app_pretest_questions.symptom_or_context", "symptoms");

      if (!pretestErr && pretestRows) {
        
        // Get all choice IDs
        const choiceIds = pretestRows.flatMap((r: any) => 
          (r.app_pretest_response_choices ?? []).map((c: any) => c.choice_id)
        );
        
        // Fetch choice labels separately
        const { data: choices, error: choicesErr } = await admin
          .from("app_pretest_choices")
          .select("id, label")
          .in("id", choiceIds);
          
        if (!choicesErr && choices) {
          console.log(`Found ${pretestRows.length} symptom questions for healthy-environment analysis`);
          
          pretest_answers = pretestRows.map((r: any) => {
            const selectedValues = (r.app_pretest_response_choices ?? []).map((c: any) => {
              const choice = choices.find(ch => ch.id === c.choice_id);
              return choice ? choice.label : c.choice_id;
            });
            
            console.log(`Symptom question: ${r.app_pretest_questions.slug}`, {
              prompt: r.app_pretest_questions.prompt,
              selected_values: selectedValues,
              symptom_or_context: r.app_pretest_questions.symptom_or_context
            });
            
            return {
              question_slug: r.app_pretest_questions.slug,
              question_prompt: r.app_pretest_questions.prompt,
              question_type: r.app_pretest_questions.type,
              selected_values: selectedValues,
              free_value: null,
            };
          });
        }
      }
    }

    // 3) Prepare manufacturer knowledge
    const manufacturer = {
      id: "vaginal-health-test-kit",
      title: "Vaginal Health-Test Kit Guidelines",
      body: `Vaginal Health-Test Kit
Intended use
This 6-parameter at-home vaginal health test gives you a simple way to track vaginal wellness markers like vaginal pH, healthy bacteria balance, signs of inflammation, and infections including yeast infections, BV, Aerobic Vaginitis (AV), and Trichomoniasis (Trich). Understanding your results helps you take action toward better health without frequent doctor visits! With easy-to-use instructions and a color chart, this test helps conveniently monitor your vaginal wellness.

Sample Requirements
Avoid sex, douching, vaginal creams, or suppositories for 24 hours before testing. Do not test if you are on your period, are using estrogen therapy, recently took antibiotics, or have misused hormones.

Testing steps
Please follow the steps on the back of the included color card.

Interpretation of results
Vaginal Health-Test Kit
  pH 3.8–4.4: Perfect
  Your vagina's healthy "sour zone" (like mild vinegar). It's nature's way to block bad germs and protect good bacteria.
  pH 4.6:(Mildly High)
  Common causes: Sex fluids, period ending, normal body changes, or douching. Your body can often fix this!
  Slight risk: Germs grow easier. Watch for: Odor, unusual discharge, itch.
  pH 4.8:(Moderately High)
  Frequent cause: Bacterial Vaginosis (BV). Other: STIs (like Trich), douching, hormone changes.
  pH 5.4:(Much Higher)
  Typically indicates: Active BV or Trich. (Less common: Low hormones after menopause).

  Hydrogen peroxide (H₂O₂)=Levels of good bacteria
  Negative ("–") Result:
  This is a GOOD result. It means you have plenty of good bacteria (lactobacilli) working to protect your vagina. These good bacteria naturally make hydrogen peroxide (H₂O₂), which acts like a cleaning agent that keeps your vagina acidic to prevent infections.
  Positive ("+") Result:
  This means your vagina has fewer good bacteria that usually produce hydrogen peroxide (H₂O₂), but not enough for full protection. This means your vagina might need extra care to keep germs away.
  Positive ("++") Result:
  This means your vagina lacks enough good bacteria that naturally fight germs without needing extra helpers/protectors. Without these protectors, the vagina is less protected. This may result in frequent infections like BV (bacterial vaginosis). Having less of these good bacteria also makes it easier for bad germs to thrive.
  
  β-glucuronidase (β-G)=Aerobic Vaginitis (AV)
  Negative ("–") result: YOU ARE GOOD!
  A "±" (possible AV) result means that the test detected borderline elevated levels of chemical signs produced by aerobic bacteria (AV)—above normal but not clearly positive. This outcome may occur during early infection, recovery, or due to sample collection issues, recent antibiotic use, or timing related to your period.
  A positive ("+") result means Aerobic Vaginitis (AV), an infection caused by harmful bacteria. While AV and Bacterial Vaginosis (BV) both cause thickened discharge, when occurring together, AV usually shows yellow discharge with vaginal redness/swelling, whereas BV features thin gray-white discharge with fishy odor but no redness/swelling. Importantly, some women—especially during pregnancy—have no AV symptoms; early testing is vital since untreated AV may cause early birth.
  What to do next for your possible AV result?
  Tracking symptoms daily—note discharge (yellow) color, irritation, or swelling.
  Timing retests carefully: After your period ends or finishing antibiotics.
  Temporarily avoiding irritants like douches or plastic-feeling underwear.
  
  N-acetylucosaminidase (NAG)=Yeast or Trich
  Negative ("–") result: YOU ARE GOOD!
  A "possible trich or yeast" ("±") result means your test shows borderline infection signs—not weak enough to be negative but not strong enough for a clear positive—with your vagina's sourness (acidity) in the middle zone. This could mean a very mild infection starting or healing. Sometimes body fluids, sex fluids, or recent douching affect the test; normal events like your period, recent sex, or using sprays/lubes can also change sourness(acidity) temporarily—watch for changes but don't worry yet.
  (NAG) is a marker both trich and yeast share, so it can't tell them apart alone—but combined with your vaginal pH, it helps figure out whether you have trich or a yeast infection.
  positive ("+") and pH is high (4.8 or above): it's more likely to be trich. (Trich makes your pH higher.)
  positive ("+") and pH is low (4.6 or below): it's more likely to be a yeast infection.
  What to do next for your "possible trich or yeast" result?
  Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.
  
  Leukocyte (LE)=Inflammation (White blood cells)
  ("–"and"±") result: YOU ARE GOOD!
  Positive ("+","++","+++") result means your vagina shows signs of inflammation — like a "warning light" telling you something might be wrong, but not what exactly. If you also test positive for specific infections like BV, trichomoniasis ("Trich"), or yeast, this strongly confirms you need treatment.
  If all other tests are negative but LE is positive, this could mean: a very early infection where germ levels are too low for other tests to detect yet (LE reacts first), non-infection irritation (soaps, douching products, lubricants, condoms), hormonal changes like menopause or breastfeeding, or friction (sex or tampons), or other untreated issues like STIs (chlamydia/gonorrhea, not covered here) or general bacterial overgrowth (not BV/AV).
  What to do next for your possible result?
  Track symptoms like unusual discharge, itching/burning, or pain/odor, avoid irritants like smelly soaps or douches, and consider regular at-home checks to see how your inflammation changes over time.
  
  Sialidase (SNA)=BV
  Negative ("–") result: YOU ARE GOOD!
  A "possible BV" ("±") result means your test was borderline—not clearly normal but not definitely BV. This can happen because: 1) You might be in the early or healing stages of BV, during which bacterial levels are changing; 2) Your vaginal bacteria are in a mixed state (some good, some bad); 3) Recent activities like sex, douching, or your menstrual cycle temporarily affected the result.
  A positive ("+") result strongly means you have BV (bacterial vaginosis), as the test detects specific chemicals produced by BV-causing bacteria like Gardnerella and Prevotella.
  What to do next for your possible BV result?
  
  Track symptoms:
  Watch for fishy odor or thin gray discharge — these suggest BV
  Note new discomfort during/after sex or periods
  Optimize retesting time:
  Avoid douching — it harms vagina's natural protection
  Wait a week after antibiotics or your period ends
  Retest at least 3 days after your period
  Avoid sex and lubricants for 2 days before retesting`
    };

    // 4) Build prompt and call OpenAI
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });

    const biomarkers = {
      ph: log.ph,
      h2o2: log.h2o2,
      le: log.le,
      sna: log.sna,
      beta_g: log.beta_g,
      nag: log.nag,
    };

    console.log('Data being sent to AI:', {
      biomarkers,
      pretest_answers_count: pretest_answers.length,
      pretest_answers: pretest_answers
    });

    const userPrompt = buildUserPrompt({
      test_session_id: log.test_session_id || log.id,
      biomarkers,
      pretest_answers,
      manufacturer,
    });

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });
    const healthyEnvironmentResponse = completion.choices?.[0]?.message?.content?.trim() || "{}";
    
    // Parse JSON and format as readable text
    try {
      const parsed: StructuredOut = JSON.parse(healthyEnvironmentResponse);
      const formattedResponse = formatChatMessage(parsed, { displayName, maxItems: 5 });
      
      // 5) Save back to DB
      const { data: updated, error: upErr } = await admin.from("test_logs").update({
        analysis_healthy: formattedResponse
      }).eq("id", test_log_id).select("id, ph, h2o2, le, sna, beta_g, nag, analysis_healthy").single();
      if (upErr) throw upErr;
      
      return new Response(JSON.stringify({
        ok: true,
        log: updated
      }), {
        headers: {
          "Content-Type": "application/json"
        }
      });
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback to raw JSON if parsing fails
    const { data: updated, error: upErr } = await admin.from("test_logs").update({
      analysis_healthy: healthyEnvironmentResponse
    }).eq("id", test_log_id).select("id, ph, h2o2, le, sna, beta_g, nag, analysis_healthy").single();
    if (upErr) throw upErr;
      
    return new Response(JSON.stringify({
      ok: true,
      log: updated
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
    }
  } catch (e) {
    console.error("healthy-environment error:", e);
    return new Response(JSON.stringify({
      error: String(e?.message ?? e)
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}); /* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-results' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/ 
