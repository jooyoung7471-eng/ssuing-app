import Anthropic from "@anthropic-ai/sdk";
import { LLMCorrectionResult } from "../types";
import { AppError } from "../middleware/errorHandler";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";

const SYSTEM_PROMPT = `You are an English writing tutor for Korean learners.
Rules:
1. NEVER produce translationese. Rewrite into what a native speaker would actually say.
2. Adjust to difficulty level:
   - beginner: simple words, short sentences
   - intermediate: phrasal verbs, idioms, varied structures
3. Provide 1-2 alternative native expressions.
4. Pick ONE key expression the learner should memorize.
5. Respond ONLY with JSON. No markdown.

JSON:
{"correctedSentence":"...","nativeExpressions":["alt1","alt2"],"explanation":"한국어 설명","keyExpression":{"english":"표현","korean":"뜻","example":"예문"},"score":7,"highlights":[{"original":"...","corrected":"...","reason":"한국어 이유"}]}`;

function buildUserMessage(koreanText: string, userWriting: string, difficulty: string): string {
  return `난이도: ${difficulty}
한글: ${koreanText}
학습자: ${userWriting}`;
}

function parseResponse(text: string): LLMCorrectionResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("JSON 파싱 실패");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    correctedSentence: parsed.correctedSentence || "",
    nativeExpressions: Array.isArray(parsed.nativeExpressions) ? parsed.nativeExpressions : [],
    explanation: parsed.explanation || "",
    keyExpression: parsed.keyExpression || { english: "", korean: "", example: "" },
    score: Math.max(1, Math.min(10, Math.round(parsed.score || 5))),
    highlights: Array.isArray(parsed.highlights)
      ? parsed.highlights.map((h: Record<string, string>) => ({
          original: h.original || "",
          corrected: h.corrected || "",
          reason: h.reason || "",
        }))
      : [],
  };
}

export async function correctWriting(
  koreanText: string,
  userWriting: string,
  difficulty: string = "beginner"
): Promise<LLMCorrectionResult> {
  if (!ANTHROPIC_API_KEY) {
    throw new AppError(
      503,
      "LLM_NOT_CONFIGURED",
      "ANTHROPIC_API_KEY 환경변수가 설정되지 않았습니다"
    );
  }

  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-20250414",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserMessage(koreanText, userWriting, difficulty),
        },
      ],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("LLM 응답에 텍스트가 없습니다");
    }

    return parseResponse(textBlock.text);
  } catch (error) {
    if (error instanceof AppError) throw error;
    const err = error as Error;
    throw new AppError(
      502,
      "LLM_ERROR",
      `교정 실패: ${err.message || "Unknown error"}`
    );
  }
}
