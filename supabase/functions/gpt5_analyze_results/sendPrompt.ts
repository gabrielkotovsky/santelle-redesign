import OpenAI from "https://esm.sh/openai@4.56.0";
import type { TestData, Analysis, Biomarkers, Symptom } from "./types.ts";

const client = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

function schema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      biomarkers: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            biomarker: {
              type: "string",
              enum: ["ph", "h2o2", "le", "sna", "beta_g", "nag"],
            },
            value: { anyOf: [{ type: "number" }, { type: "string" }, { type: "null" }] },
            classification: {
              type: "string",
              enum: ["low", "normal", "borderline", "high", "unknown"],
            },
            significance: { type: "string" },
            interpretation: { type: "string" },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
          required: [
            "biomarker",
            "value",
            "classification",
            "significance",
            "interpretation",
            "confidence",
          ],
        },
      },
    },
    required: ["biomarkers"],
  } as const;
}

function buildUserContent(payload: TestData) {
  const stringify = (x: unknown) => JSON.stringify(x, null, 2);
  const biomarkers: Biomarkers = payload.biomarkers ?? {};
  const symptoms: Symptom[] = payload.symptoms ?? [];
  const manufacturer = payload.manufacturer_text || "";

  return [
    "ROLE: You are a careful clinical explainer for at-home vaginal health biomarkers.",
    "TASK: For EACH biomarker, explain:",
    " • significance: what this biomarker measures and why it matters;",
    " • classification: low/normal/borderline/high/unknown using reference ranges when present;",
    " • interpretation: what the observed value suggests IN CONTEXT of the symptoms. Describe what this result indicates in clear, non-alarmist language without directly addressing the individual.",
    " • confidence: confidence level (0 to 1) for this interpretation.",
    "STYLE: Clear, clinical, non-alarmist, no markdown, emojis allowed, no medical diagnosis claims. Avoid using 'you', 'your', or directly addressing the individual. Use neutral phrasing like 'this result', 'the observed value', 'this level', etc.",
    "Never invent numeric cutoffs—derive from reference documentation if explicitly stated; otherwise use qualitative language.",
    "",
    "DATA::BIOMARKERS_JSON",
    stringify(biomarkers),
    "",
    "DATA::SYMPTOMS_JSON",
    stringify(symptoms),
    "",
    "REFERENCE_DOCUMENTATION (source of clinical ranges and interpretive guidance; do not copy verbatim)",
    manufacturer.slice(0, 16000),
  ].join("\n");
}

export async function sendPromptForAnalysis(payload: TestData): Promise<Analysis> {
  const resp = await client.chat.completions.create({
    model: "gpt-5",
    messages: [
      {
        role: "system",
        content:
          "Return only JSON that matches the schema. Be concise, careful, and layperson-friendly.",
      },
      { role: "user", content: buildUserContent(payload) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "PerBiomarkerAnalysis", schema: schema(), strict: true },
    },
  });

  const raw = resp.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(raw) as Analysis;
  } catch {
    return {
      biomarkers: [],
    };
  }
}

