import OpenAI from "https://esm.sh/openai@4.56.0";
import type { TestData, Analysis, Biomarkers, ContextQuestion } from "./types.ts";

const client = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });

function schema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      insights: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              description: "The contextual category (e.g., Menstrual Cycle, Sexual Activity, etc.)",
            },
            relevance: {
              type: "string",
              description: "How this context relates to the biomarker results",
            },
            interpretation: {
              type: "string",
              description: "What this context suggests about the results",
            },
            confidence: {
              type: "number",
              minimum: 0,
              maximum: 1,
              description: "Confidence level for this insight",
            },
          },
          required: ["category", "relevance", "interpretation", "confidence"],
        },
      },
    },
    required: ["insights"],
  } as const;
}

function buildUserContent(payload: TestData) {
  const stringify = (x: unknown) => JSON.stringify(x, null, 2);
  const biomarkers: Biomarkers = payload.biomarkers ?? {};
  const context: ContextQuestion[] = payload.context ?? [];
  const manufacturer = payload.manufacturer_text || "";

  return [
    "ROLE: You are a clinical analyst specializing in contextual interpretation of vaginal health biomarkers.",
    "TASK: Analyze the provided biomarker results IN CONTEXT of the user's lifestyle, cycle, and other contextual factors.",
    " • For each significant contextual factor, explain:",
    "   - category: what aspect of context this relates to (e.g., Menstrual Cycle, Sexual Activity, Medication, etc.)",
    "   - relevance: how this specific context relates to the observed biomarker values",
    "   - interpretation: what this contextual factor suggests about the results",
    "   - confidence: confidence level (0 to 1) for this contextual interpretation",
    "STYLE: Clear, clinical, empowering, non-alarmist, no markdown. Emojis allowed. No medical diagnosis claims.",
    "Avoid using 'you', 'your', or directly addressing the individual. Use neutral phrasing like 'this result', 'the observed value', 'these factors', etc.",
    "Focus on education and empowerment rather than alarm.",
    "",
    "DATA::BIOMARKERS_JSON",
    stringify(biomarkers),
    "",
    "DATA::CONTEXT_JSON",
    stringify(context),
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
          "Return only JSON that matches the schema. Be concise, careful, and provide contextually-aware insights that are layperson-friendly and empowering.",
      },
      { role: "user", content: buildUserContent(payload) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "ContextualAnalysis", schema: schema(), strict: true },
    },
  });

  const raw = resp.choices?.[0]?.message?.content ?? "{}";
  try {
    return JSON.parse(raw) as Analysis;
  } catch {
    return {
      insights: [],
    };
  }
}

