import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const OUTPUT_FILE = path.join(__dirname, "seed-sentences.json");

interface CategoryConfig {
  theme: "daily" | "business";
  category: string;
  total: number;
}

const dailyCategories: CategoryConfig[] = [
  { theme: "daily", category: "인사/소개", total: 140 },
  { theme: "daily", category: "음식/카페", total: 160 },
  { theme: "daily", category: "쇼핑", total: 130 },
  { theme: "daily", category: "교통", total: 120 },
  { theme: "daily", category: "날씨", total: 110 },
  { theme: "daily", category: "건강", total: 130 },
  { theme: "daily", category: "취미", total: 150 },
  { theme: "daily", category: "여행", total: 160 },
  { theme: "daily", category: "가족/친구", total: 140 },
  { theme: "daily", category: "감정표현", total: 150 },
  { theme: "daily", category: "전화/문자", total: 110 },
  { theme: "daily", category: "약속잡기", total: 120 },
  { theme: "daily", category: "집/주거", total: 120 },
  { theme: "daily", category: "직장일상", total: 130 },
  { theme: "daily", category: "미디어/SNS", total: 130 },
];

const businessCategories: CategoryConfig[] = [
  { theme: "business", category: "이메일/서신", total: 200 },
  { theme: "business", category: "회의/프레젠테이션", total: 180 },
  { theme: "business", category: "보고/제안", total: 170 },
  { theme: "business", category: "협상/계약", total: 150 },
  { theme: "business", category: "HR/채용", total: 160 },
  { theme: "business", category: "마케팅/영업", total: 170 },
  { theme: "business", category: "재무/회계", total: 150 },
  { theme: "business", category: "IT/기술", total: 180 },
  { theme: "business", category: "주식/투자", total: 160 },
  { theme: "business", category: "기업동향/뉴스", total: 160 },
  { theme: "business", category: "출장", total: 150 },
  { theme: "business", category: "고객응대", total: 170 },
];

const allCategories = [...dailyCategories, ...businessCategories];

interface HintWord {
  english: string;
  korean: string;
}

interface SentenceData {
  koreanText: string;
  theme: string;
  difficulty: string;
  category: string;
  hintWords: HintWord[];
  tags: string[];
}

function buildPrompt(
  theme: string,
  difficulty: string,
  category: string,
  count: number
): string {
  const diffDesc =
    difficulty === "beginner"
      ? "초급 (짧고 쉬운 문장, 10~20자)"
      : "중급 (자연스럽고 약간 복잡한 문장, 20~40자)";

  return `다음 조건의 한글 문장 ${count}개를 JSON 배열로 생성해. 다른 텍스트 없이 순수 JSON만 출력해. 마크다운 코드블록도 사용하지 마.
- 테마: ${theme}
- 난이도: ${difficulty} (${diffDesc})
- 카테고리: ${category}
- 각 문장에 hintWords 3~4개 포함 (영어 작문에 필요한 핵심 단어/표현)
- 실제 일상에서 자주 쓰는 자연스러운 한국어 문장
- tags에 핵심 영단어 2~3개 포함
- 문장이 서로 중복되지 않도록 다양하게 생성

출력 형식:
[{"koreanText":"한글문장","theme":"${theme}","difficulty":"${difficulty}","category":"${category}","hintWords":[{"english":"word","korean":"뜻"}],"tags":["tag1","tag2"]}]`;
}

function generateBatch(
  theme: string,
  difficulty: string,
  category: string,
  count: number
): SentenceData[] {
  const prompt = buildPrompt(theme, difficulty, category, count);
  console.log(
    `  Generating ${count} ${difficulty} sentences for [${theme}] ${category}...`
  );

  try {
    const result = execSync(
      `claude -p --model haiku "${prompt.replace(/"/g, '\\"')}"`,
      {
        encoding: "utf-8",
        timeout: 120000,
        maxBuffer: 1024 * 1024 * 10,
      }
    );

    // Extract JSON from result - handle markdown code blocks
    let jsonStr = result.trim();
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "");
    jsonStr = jsonStr.trim();

    // Find the JSON array
    const startIdx = jsonStr.indexOf("[");
    const endIdx = jsonStr.lastIndexOf("]");
    if (startIdx === -1 || endIdx === -1) {
      console.error(`  ERROR: No JSON array found in response`);
      return [];
    }
    jsonStr = jsonStr.substring(startIdx, endIdx + 1);

    const parsed: SentenceData[] = JSON.parse(jsonStr);
    console.log(`  OK: got ${parsed.length} sentences`);
    return parsed;
  } catch (err: any) {
    console.error(`  ERROR generating batch: ${err.message}`);
    return [];
  }
}

async function main() {
  // Load existing data if any
  let allSentences: SentenceData[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf-8"));
    allSentences = existing;
    console.log(`Loaded ${allSentences.length} existing sentences`);
  }

  // Track what's already generated
  const existingCounts: Record<string, Record<string, number>> = {};
  for (const s of allSentences) {
    const key = `${s.theme}:${s.category}`;
    if (!existingCounts[key]) existingCounts[key] = {};
    existingCounts[key][s.difficulty] =
      (existingCounts[key][s.difficulty] || 0) + 1;
  }

  // Parse CLI args for mode
  const args = process.argv.slice(2);
  const mode = args[0] || "first-batch"; // "first-batch" | "full"

  console.log(`\nMode: ${mode}`);
  console.log(`Total categories: ${allCategories.length}`);

  for (const cat of allCategories) {
    const halfTotal = Math.floor(cat.total / 2);

    for (const difficulty of ["beginner", "intermediate"] as const) {
      const key = `${cat.theme}:${cat.category}`;
      const existing = existingCounts[key]?.[difficulty] || 0;
      const target = mode === "first-batch" ? Math.min(25, halfTotal) : halfTotal;
      const remaining = target - existing;

      if (remaining <= 0) {
        console.log(
          `SKIP [${cat.theme}] ${cat.category} ${difficulty}: already have ${existing}/${target}`
        );
        continue;
      }

      // Generate in batches of max 50
      let generated = 0;
      while (generated < remaining) {
        const batchSize = Math.min(50, remaining - generated);
        const batch = generateBatch(
          cat.theme,
          difficulty,
          cat.category,
          batchSize
        );
        allSentences.push(...batch);
        generated += batch.length;

        // Save after each batch
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allSentences, null, 2));
        console.log(`  Total sentences so far: ${allSentences.length}`);

        if (batch.length === 0) break; // Don't retry on failure
      }
    }
  }

  console.log(`\nDone! Total sentences: ${allSentences.length}`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

main().catch(console.error);
