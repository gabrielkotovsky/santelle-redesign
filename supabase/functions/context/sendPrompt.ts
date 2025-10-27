import OpenAI from "https://esm.sh/openai@4.56.0";
import type { Biomarkers, PretestAnswer } from "./types.ts";

type Factor = {
  factor: string;
  evidence: string;
  mechanism: string;
  influence: "increase" | "decrease" | "mixed" | "unclear";
  confidence: number; // 0..1
  question_slug?: string;
  question_prompt?: string;
  selected_values?: string[];
};

type Analysis = {
  summary?: string;
  contextual_factors?: Factor[];
};

const influenceIcon: Record<Factor["influence"], string> = {
  increase: "↑",
  decrease: "↓",
  mixed: "↕",
  unclear: "·",
};

function formatAnalysisToText(a: Analysis, maxFactors = 4): string {
  if (!a) return "No analysis available.";

  const lines: string[] = [];

  const factors = (a.contextual_factors ?? [])
    .filter(f => f?.factor)
    .sort((x, y) => (y.confidence ?? 0) - (x.confidence ?? 0))
    .slice(0, maxFactors);

  if (factors.length) {
    lines.push("What may be influencing your results:");
    factors.forEach((f, i) => {
      lines.push(
        `${i + 1}. **${f.evidence}**\n   Factor: ${f.factor}\n   Why: ${f.mechanism}`
      );
    });
  } else {
    lines.push("No specific contextual factors identified from your pre-test answers.");
  }

  return lines.join("\n");
}

/**
 * Sends biomarker + pretest data to ChatGPT for contextual-factor analysis.
 * - Strict JSON output (easy to persist & test)
 * - Optional RAG knowledge (supportedKnowledge) for MECHANISM wording only
 * - Optional history-trained model priors (modelSignals) for ranking strength only
 */
export async function sendPromptToChatGPT(args: {
  test_session_id: string;
  biomarkers: Biomarkers;
  pretest_answers: PretestAnswer[];
  supportedKnowledge?: Array<{ id: string; title: string; body: string }>;
  modelSignals?: Record<string, unknown>;
}): Promise<string> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  // ===================== SYSTEM PROMPT (updated) =====================
  const systemPrompt = `
You are a women's health explainer. Analyze how contextual factors may influence at-home vaginal biomarker readings.

Critical constraint:
- You may ONLY consider contextual factors that are explicitly present in the supplied pretest answers.
- DO NOT invent new factors. DO NOT infer unmentioned behaviors from biomarkers or general knowledge.
- Biomarkers may be used ONLY to explain plausible mechanisms (how a reported factor could interact with or nudge the observed pattern), not to introduce additional factors.

Objectives:
- Identify and list contextual factors STRICTLY from pretest_answers.
- For each listed factor, explain a plausible MECHANISM relating that factor to the biomarker pattern.
- Calibrate CONFIDENCE using clarity/specificity of the pretest answer and coherence with the biomarker pattern.
- If uncertain, say so. Prefer reassurance language.
- Do NOT diagnose or recommend prescription treatments/antibiotics. Avoid medical advice.

Ground rules:
- If no relevant factors are present in pretest_answers, return an empty list and a brief reassuring summary.
- Supported knowledge (if provided) may help with mechanism phrasing ONLY; it cannot add new factors.
- Model signals (if provided) may help rank/weight factors ONLY among those already present in pretest_answers.
- Output STRICT JSON (no Markdown). Keys and value types must match the schema.

JSON schema to return:
{
  "summary": "string",
  "contextual_factors": [
    {
      "factor": "string",                          // short name of the factor, derived from a pretest answer
      "evidence": "string",                        // quote/paraphrase the specific pretest selection(s)
      "mechanism": "string",                       // how this reported factor could influence the biomarker pattern
      "influence": "increase|decrease|mixed|unclear",
      "confidence": 0.0,
      "question_slug": "string",
      "question_prompt": "string",
      "selected_values": ["string"],
      "biomarkers": ["pH"|"H2O2"|"LE"|"SNA"|"beta_G"|"NAG"],   // MUST contain ≥1 item
    }
  ]
}
`.trim();

  // ===================== USER PROMPT (updated) =====================
  const payload = {
    test_session_id: args.test_session_id,
    biomarkers: args.biomarkers,
    pretest_answers: args.pretest_answers,
  };

  const userPrompt = `
Use the JSON in DATA. 
Only extract contextual factors that are explicitly present in pretest_answers.
Do NOT add any factor that is not directly supported by a pretest answer.
You may reference biomarkers only to explain MECHANISMS for factors already found in pretest_answers.
If SUPPORTED_KNOWLEDGE is present, use it to phrase mechanisms (do not add factors).
If MODEL_SIGNALS is present, you may use it to rank/weight factors, but only among factors derived from pretest_answers.

Return only valid JSON matching the schema from the system message.

DATA:
${JSON.stringify(payload, null, 2)}

SUPPORTED_KNOWLEDGE:
${args.supportedKnowledge ? JSON.stringify(args.supportedKnowledge, null, 2) : "null"}

MODEL_SIGNALS:
${args.modelSignals ? JSON.stringify(args.modelSignals, null, 2) : "null"}
`.trim();

  // ===================== CALL OPENAI =====================
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

  // ===================== PARSE & FORMAT =====================
  try {
    const analysis: Analysis = JSON.parse(jsonResponse);
    return formatAnalysisToText(analysis);
  } catch (error) {
    console.error("Failed to parse JSON response:", error);
    return jsonResponse; // Fallback to raw JSON if parsing fails
  }
}