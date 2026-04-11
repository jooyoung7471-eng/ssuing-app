import { exec } from "child_process";
import { promisify } from "util";
import { LLMCorrectionResult } from "../types";
import { AppError } from "../middleware/errorHandler";

const execAsync = promisify(exec);

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

function buildPrompt(koreanText: string, userWriting: string, difficulty: string): string {
  return `${SYSTEM_PROMPT}

난이도: ${difficulty}
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
  const prompt = buildPrompt(koreanText, userWriting, difficulty);

  const escapedPrompt = prompt.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");

  try {
    const { stdout } = await execAsync(
      `claude -p "${escapedPrompt}" --model haiku --max-turns 1`,
      { timeout: 20000, maxBuffer: 1024 * 1024 }
    );

    return parseResponse(stdout);
  } catch (error) {
    const err = error as Error;
    throw new AppError(
      502,
      "LLM_ERROR",
      `교정 실패: ${err.message || "Unknown error"}`
    );
  }
}
