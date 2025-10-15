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
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY")!;
const SUPABASE_URL = Deno.env.get("EXPO_PUBLIC_SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY")!;

function buildPrompt(pH: number | null, t: TestLog) {
  return `You are a women’s health and wellness companion. 
You MUST:
- Only display the official text provided by the manufacturer below.
- Do NOT diagnose, predict, or recommend treatment.
- If the user asks for more than what is in the manufacturer’s text, answer: 
  "This isn’t medical advice — please speak to a healthcare professional."

Here is the manufacturer’s official text for this test:

=============================
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
  Your vagina’s healthy “sour zone” (like mild vinegar). It’s nature’s way to block bad germs and protect good bacteria.
  pH 4.6:(Mildly High)
  Common causes: Sex fluids, period ending, normal body changes, or douching. Your body can often fix this!
  Slight risk: Germs grow easier. Watch for: Odor, unusual discharge, itch.
  pH 4.8:(Moderately High)
  Frequent cause: Bacterial Vaginosis (BV). Other: STIs (like Trich), douching, hormone changes.
  pH 5.4:(Much Higher)
  Typically indicates: Active BV or Trich. (Less common: Low hormones after menopause).

  Hydrogen peroxide (H₂O₂)=Levels of good bacteria
  Negative (“–”) Result:
  This is a GOOD result. It means you have plenty of good bacteria (lactobacilli) working to protect your vagina. These good bacteria naturally make hydrogen peroxide (H₂O₂), which acts like a cleaning agent that keeps your vagina acidic to prevent infections.
  Positive (“+”) Result:
  This means your vagina has fewer good bacteria that usually produce hydrogen peroxide (H₂O₂), but not enough for full protection. This means your vagina might need extra care to keep germs away.
  Positive (“++”) Result:
  This means your vagina lacks enough good bacteria that naturally fight germs without needing extra helpers/protectors. Without these protectors, the vagina is less protected. This may result in frequent infections like BV (bacterial vaginosis). Having less of these good bacteria also makes it easier for bad germs to thrive.
  
  β-glucuronidase (β-G)=Aerobic Vaginitis (AV)
  Negative (“–”) result: YOU ARE GOOD!
  A “±” (possible AV) result means that the test detected borderline elevated levels of chemical signs produced by aerobic bacteria (AV)—above normal but not clearly positive. This outcome may occur during early infection, recovery, or due to sample collection issues, recent antibiotic use, or timing related to your period.
  A positive (“+”) result means Aerobic Vaginitis (AV), an infection caused by harmful bacteria. While AV and Bacterial Vaginosis (BV) both cause thickened discharge, when occurring together, AV usually shows yellow discharge with vaginal redness/swelling, whereas BV features thin gray-white discharge with fishy odor but no redness/swelling. Importantly, some women—especially during pregnancy—have no AV symptoms; early testing is vital since untreated AV may cause early birth.
  What to do next for your possible AV result?
  Tracking symptoms daily—note discharge (yellow) color, irritation, or swelling.
  Timing retests carefully: After your period ends or finishing antibiotics.
  Temporarily avoiding irritants like douches or plastic-feeling underwear.
  
  N-acetylucosaminidase (NAG)=Yeast or Trich
  Negative (“–”) result: YOU ARE GOOD!
  A “possible trich or yeast” (“±”) result means your test shows borderline infection signs—not weak enough to be negative but not strong enough for a clear positive—with your vagina’s sourness (acidity) in the middle zone. This could mean a very mild infection starting or healing. Sometimes body fluids, sex fluids, or recent douching affect the test; normal events like your period, recent sex, or using sprays/lubes can also change sourness(acidity) temporarily—watch for changes but don’t worry yet.
  (NAG) is a marker both trich and yeast share, so it can’t tell them apart alone—but combined with your vaginal pH, it helps figure out whether you have trich or a yeast infection.
  positive (“+”) and pH is high (4.8 or above): it’s more likely to be trich. (Trich makes your pH higher.)
  positive (“+”) and pH is low (4.6 or below): it’s more likely to be a yeast infection.
  What to do next for your “possible trich or yeast” result?
  Retest in 5–7 days—avoid sex, douches, or vaginal creams for 24 hours beforehand, and wait until at least 3 days after your period ends.
  
  Leukocyte (LE)=Inflammation (White blood cells)
  (“–”and“±”) result: YOU ARE GOOD!
  Positive (“+”,“++”,“+++”) result means your vagina shows signs of inflammation — like a “warning light” telling you something might be wrong, but not what exactly. If you also test positive for specific infections like BV, trichomoniasis (“Trich”), or yeast, this strongly confirms you need treatment.
  If all other tests are negative but LE is positive, this could mean: a very early infection where germ levels are too low for other tests to detect yet (LE reacts first), non-infection irritation (soaps, douching products, lubricants, condoms), hormonal changes like menopause or breastfeeding, or friction (sex or tampons), or other untreated issues like STIs (chlamydia/gonorrhea, not covered here) or general bacterial overgrowth (not BV/AV).
  What to do next for your possible result?
  Track symptoms like unusual discharge, itching/burning, or pain/odor, avoid irritants like smelly soaps or douches, and consider regular at-home checks to see how your inflammation changes over time.
  
  Sialidase (SNA)=BV
  Negative (“–”) result: YOU ARE GOOD!
  A “possible BV” (“±”) result means your test was borderline—not clearly normal but not definitely BV. This can happen because: 1) You might be in the early or healing stages of BV, during which bacterial levels are changing; 2) Your vaginal bacteria are in a mixed state (some good, some bad); 3) Recent activities like sex, douching, or your menstrual cycle temporarily affected the result.
  A positive (“+”) result strongly means you have BV (bacterial vaginosis), as the test detects specific chemicals produced by BV-causing bacteria like Gardnerella and Prevotella.
  What to do next for your possible BV result?
  
  Track symptoms:
  Watch for fishy odor or thin gray discharge — these suggest BV
  Note new discomfort during/after sex or periods
  Optimize retesting time:
  Avoid douching — it harms vagina’s natural protection
  Wait a week after antibiotics or your period ends
  Retest at least 3 days after your period
  Avoid sex and lubricants for 2 days before retesting
=============================

Test Results (user input):
- pH: ${pH ?? "N/A"}
- H₂O₂: ${t.h2o2 ?? "N/A"}
- LE: ${t.le ?? "N/A"}
- SNA: ${t.sna ?? "N/A"}
- β-G: ${t.beta_g ?? "N/A"}
- NAG: ${t.nag ?? "N/A"}

Your task:
1. Match each result to the corresponding section in the manufacturer’s interpretation text.
2. Re-present the official wording exactly, but you may:
   - Use friendlier tone (emojis, bullet points, headings).
   - Shorten long sentences for readability.
   - Highlight reassuring language first (e.g., "YOU ARE GOOD!").
3. After that, add exactly one summary sentence (≤15 words) starting with "Summary: Your …" with no formatting or markdown.`;
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

    // server-side supabase (service role) to bypass RLS for this write
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    });

    // 1) Load the test log
    const { data: log, error: selErr } = await admin
      .from("test_logs")
      .select("id, ph, h2o2, le, sna, beta_g, nag, analysis")
      .eq("id", test_log_id)
      .maybeSingle();

    if (selErr) throw selErr;
    if (!log) {
      return new Response(JSON.stringify({ error: "Test log not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2) Build prompt and call OpenAI
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const prompt = buildPrompt(log.ph, log as TestLog);

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a wellness companion app. Only use the provided manufacturer text. Never add diagnosis or treatment.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1200,
    });

    const analysis =
      completion.choices?.[0]?.message?.content?.trim() || "No analysis produced.";

    // 3) Save back to DB
    const { data: updated, error: upErr } = await admin
      .from("test_logs")
      .update({ analysis })
      .eq("id", test_log_id)
      .select("id, ph, h2o2, le, sna, beta_g, nag, analysis")
      .single();

    if (upErr) throw upErr;

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

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/analyze-results' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
