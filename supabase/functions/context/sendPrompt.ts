import OpenAI from "https://esm.sh/openai@4.56.0";
import type { Biomarkers, PretestAnswer } from "./types.ts";

/**
 * Sends biomarker + pretest data to ChatGPT for analysis.
 * Prompts are embedded directly in this file for easy editing.
 */
export async function sendPromptToChatGPT(payload: {
  test_session_id: string;
  biomarkers: Biomarkers;
  pretest_answers: PretestAnswer[];
}): Promise<string> {
  const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY")! });

  // ✏️ 1. Define your system prompt here
  const systemPrompt = `
You are a women's health assistant helping analyze contextual factors that can influence test results. Your job is to provide educational insights about how various factors can affect vaginal health test readings.

Follow these rules:
- Be factual and educational, but warm and reassuring.
- Never give medical advice or diagnose.
- Focus on explaining how different factors can influence test results.
- Use plain English suitable for a general audience.
- Provide practical insights about lifestyle, hygiene, and health factors.
- Be encouraging and supportive in your tone.

Return structured, plain-text explanations that help users understand what factors might influence their test results.
`;

  // ✏️ 2. Define your user prompt template here
  const userPrompt = `
For testing purposes, please display the raw data exactly as provided:

BIOMARKERS:
${JSON.stringify(payload.biomarkers, null, 2)}

PRETEST QUESTIONS AND ANSWERS:
${JSON.stringify(payload.pretest_answers, null, 2)}

TEST SESSION ID: ${payload.test_session_id}

Please format this data in a clear, readable way showing:
1. The biomarker values
2. Each question with its prompt and type
3. The selected answers for each question

This is for testing the data flow, so please present the information exactly as received.
`;

  // 3. Compose messages and send
  const messages = [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];

  const chat = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages,
  });

  // 4. Return raw text (to be stored in test_logs.analysis_factors)
  return chat.choices[0]?.message?.content ?? "";
}
