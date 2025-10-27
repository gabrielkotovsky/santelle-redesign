import OpenAI from "https://esm.sh/openai@4.56.0";
import type { Biomarkers, PretestAnswer } from "./types.ts";

type Factor = {
  factor: string;
  evidence: string;
  mechanism: string;
  influence: "increase" | "decrease" | "mixed" | "unclear";
  confidence: number; // 0..1
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
    lines.push("No specific contextual factors identified from your test results.");
  }

  return lines.join("\n");
}

/**
 * Sends biomarker + pretest data to ChatGPT for contextual-factor analysis.
 * - Strict JSON output (easy to persist & test)
 * - Optional RAG knowledge (supportedKnowledge)
 * - Optional history-trained model priors (modelSignals)
 */
export async function sendPromptToChatGPT(args: {
  test_session_id: string;
  biomarkers: Biomarkers;
  pretest_answers: PretestAnswer[];
  supportedKnowledge?: Array<{ id: string; title: string; body: string }>; // optional RAG passages
  modelSignals?: Record<string, unknown>;                                   // optional priors from your models
}): Promise<string> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  // 1) System prompt: tightly scoped to contextual-factor analysis with safety rails
  const systemPrompt = `
You are a women's health explainer. Analyze the effect of contextual factors at-home vaginal biomarker readings.

Objectives:
- Identify the likely CONTEXTUAL FACTORS that could influence the biomarker readings.
- Explain plausible MECHANISMS linking factors to the observed biomarker pattern.
- If uncertain, say so and prefer reassurance language.
- Do NOT diagnose or recommend prescription treatments/antibiotics. Avoid medical advice.

Ground rules:
- If nothing unusual is indicated, emphasize normal variability and reassurance.
- Output STRICT JSON (no Markdown). Keys and value types must match the schema below.

JSON schema to return:
{
  "summary": "string",
  "contextual_factors": [
    {
      "factor": "string",
      "evidence": "string",
      "mechanism": "string",
      "influence": "increase|decrease|mixed|unclear",
      "confidence": 0.0
    }
  ]
}
`.trim();

  // 2) User prompt: minimal instruction + stable DATA block
  const payload = {
    test_session_id: args.test_session_id,
    biomarkers: args.biomarkers,
    pretest_answers: args.pretest_answers,
  };

  const userPrompt = `
Use the JSON in DATA. If PROVIDED_KNOWLEDGE exists, use it to ground mechanisms and terminology and list minimal "citations". If MODEL_SIGNALS exists, you may use it to rank factors but do not contradict evidence from DATA.

Return only valid JSON matching the schema from the system message.

DATA:
${JSON.stringify(payload, null, 2)}

PROVIDED_KNOWLEDGE:
${args.supportedKnowledge ? JSON.stringify(args.supportedKnowledge, null, 2) : "null"}

MODEL_SIGNALS:
${args.modelSignals ? JSON.stringify(args.modelSignals, null, 2) : "null"}
`.trim();

  // 3) Compose messages and call OpenAI with JSON response enforcement
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,                     // tighter adherence, less drift
    response_format: { type: "json_object" },
    messages,
  });

  // 4) Parse JSON and format as readable text
  const jsonResponse = chat.choices[0]?.message?.content ?? "{}";
  
  try {
    const analysis: Analysis = JSON.parse(jsonResponse);
    return formatAnalysisToText(analysis);
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    return jsonResponse; // Fallback to raw JSON if parsing fails
  }
}
