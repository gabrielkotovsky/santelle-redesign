import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import OpenAI from "openai";
import { createClient } from "supabase";

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
};

type BiomarkerResult = {
  name: "pH" | "H₂O₂" | "LE" | "SNA" | "β-G" | "NAG";
  user_value: string;
  significance: string;
  interpretation: "positive" | "negative" | "borderline" | "neutral" | "unknown";
  evidence: string;
};

type AnalysisResult = {
  summary?: string;
  biomarkers?: BiomarkerResult[];
  reassurance?: string;
};

function formatAnalysisToText(analysis: AnalysisResult): string {
  if (!analysis) return "No analysis available.";

  const lines: string[] = [];

  // Process each biomarker
  if (analysis.biomarkers && analysis.biomarkers.length > 0) {
    analysis.biomarkers.forEach((biomarker) => {
      // Biomarker name, value and interpretation on the same line (entire line bold and underlined)
      lines.push(`**__${biomarker.name}: ${biomarker.user_value} (${biomarker.interpretation})__**`);
      
      // Significance (bold label)
      lines.push(`**Significance:** ${biomarker.significance}`);
      
      // Evidence (bold label)
      lines.push(`**Evidence:** ${biomarker.evidence}`);
      
      // Add spacing between biomarkers
      lines.push("");
    });
  }

  // Add reassurance at the end
  if (analysis.reassurance) {
    lines.push(`*${analysis.reassurance.trim()}*`);
  }

  return lines.join("\n");
}

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL   = Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!;
const SERVICE_ROLE   = Deno.env.get("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")!;

/** ---- Manufacturer text provided as grounding knowledge (RAG-like) ---- */
const MANUFACTURER_TEXT = String.raw`
<manufacturer_text>
Vaginal Health-Test Kit
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
  Avoid sex and lubricants for 2 days before retesting
</manufacturer_text>
`;

/** ---- System prompt: strict JSON schema per biomarker ---- */
const SYSTEM_PROMPT = `
You are a women's health explainer.

Given at-home vaginal biomarker results (pH, H₂O₂, LE, SNA, β-G, NAG) and the provided manufacturer text,
produce a structured, educational summary. For EACH biomarker present, include:
- significance: explain what this biomarker generally represents in vaginal ecology.
- interpretation: normalize the provided value into one of: "positive" | "negative" | "borderline" | "neutral" | "unknown".
  (Map raw values like "–" → negative, "±" → borderline, "+" or "++" → positive; for pH, map by ranges vs. the healthy band.)
- evidence: summarize the manufacturer’s description and typical context for that label, without referring to the user.

Tone & attribution rules:
- Never refer to or imply the user's personal state, body, or test results.
- Never say "you," "your results," or "this means you have..."
- Always generalize, using phrasing such as:
    • "Women who have this result often notice..."
    • "This result is typically associated with..."
    • "This pattern can sometimes appear when..."
    • "In general, this label corresponds to..."
- Do NOT diagnose, suggest treatment, or imply certainty about any medical condition.
- Keep language calm and supportive.

Output STRICT JSON ONLY (no Markdown, no prose outside JSON) with this schema:
{
  "summary": "string",
  "biomarkers": [
    {
      "name": "pH" | "H₂O₂" | "LE" | "SNA" | "β-G" | "NAG",
      "user_value": "string",
      "significance": "string",
      "interpretation": "positive" | "negative" | "borderline" | "neutral" | "unknown"
      "evidence": "string"
    }
  ],
  "reassurance": "string"
}
`.trim();

/** ---- Build the user message that includes DATA + PROVIDED_KNOWLEDGE ---- */
function buildUserMessage(t: TestLog) {
  // Normalize raw test values as strings for the model
  const payload = {
    biomarkers_raw: {
      ph: t.ph,                   // number or null
      h2o2: t.h2o2,               // "–" | "±" | "+" | "++" | null
      le: t.le,
      sna: t.sna,
      beta_g: t.beta_g,
      nag: t.nag,
    },
    mapping_notes: {
      // pH: healthy band 3.8–4.4; 4.6 mildly high; 4.8 moderately; 5.4 much higher (per manufacturer)
      // map "–"->negative, "±"->borderline, "+" or "++"->positive for non-pH markers
    }
  };

  const providedKnowledge = [
    { id: "mfg-1", title: "Manufacturer guidance", body: MANUFACTURER_TEXT }
  ];

  return `
Use DATA and PROVIDED_KNOWLEDGE. Return only valid JSON matching the schema from the system message.

DATA:
${JSON.stringify(payload, null, 2)}

PROVIDED_KNOWLEDGE:
${JSON.stringify(providedKnowledge, null, 2)}
`.trim();
}

Deno.serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { test_log_id, model = "gpt-4o-mini" } = await req.json();
    if (!test_log_id) {
      return new Response(JSON.stringify({ error: "test_log_id is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Supabase admin client (service role)
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // 1) Load the test log
    const { data: log, error: selErr } = await admin
      .from("test_logs")
      .select("id, ph, h2o2, le, sna, beta_g, nag, analysis, user_id")
      .eq("id", test_log_id)
      .maybeSingle();
    if (selErr) throw selErr;
    if (!log) {
      return new Response(JSON.stringify({ error: "Test log not found" }), {
        status: 404, headers: { "Content-Type": "application/json" },
      });
    }

    // 2) Build messages for OpenAI (strict JSON response)
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      { role: "user"   as const, content: buildUserMessage(log as TestLog) },
    ];

    const completion = await openai.chat.completions.create({
      model,
      temperature: 1,
      response_format: { type: "json_object" },
      messages,
      max_completion_tokens: 10000,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || "{}";

    // Parse JSON and format as readable text
    let updated;
    try {
      const parsed = JSON.parse(raw);
      const formattedResponse = formatAnalysisToText(parsed);
      
      // Save formatted text back to DB
      const { data: updatedData, error: upErr } = await admin
        .from("test_logs")
        .update({ analysis: formattedResponse })
        .eq("id", test_log_id)
        .select("id, ph, h2o2, le, sna, beta_g, nag, analysis")
        .single();
      if (upErr) throw upErr;
      updated = updatedData;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback to raw JSON if parsing fails
      const { data: updatedData, error: upErr } = await admin
        .from("test_logs")
        .update({ analysis: raw })
        .eq("id", test_log_id)
        .select("id, ph, h2o2, le, sna, beta_g, nag, analysis")
        .single();
      if (upErr) throw upErr;
      updated = updatedData;
    }

    return new Response(JSON.stringify({ ok: true, log: updated }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-results error:", e);
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/* To invoke locally:

  1) supabase start
  2) curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-results' \
       --header 'Authorization: Bearer <anon or user jwt>' \
       --header 'Content-Type: application/json' \
       --data '{"test_log_id":"<uuid>"}'
*/