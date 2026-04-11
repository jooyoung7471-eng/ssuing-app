import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface SentenceInput {
  koreanText: string;
  theme: string;
  difficulty: string;
  category: string;
  hintWords: { english: string; korean: string }[];
  tags: string[];
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.reviewAnswer.deleteMany();
  await prisma.reviewSession.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.correction.deleteMany();
  await prisma.dailySentence.deleteMany();
  await prisma.sentence.deleteMany();

  // Load sentences from JSON file
  const jsonPath = path.join(__dirname, "seed-sentences.json");
  if (!fs.existsSync(jsonPath)) {
    console.error("seed-sentences.json not found! Run generate-sentences.ts first.");
    process.exit(1);
  }

  const sentences: SentenceInput[] = JSON.parse(
    fs.readFileSync(jsonPath, "utf-8")
  );

  console.log(`Loading ${sentences.length} sentences from seed-sentences.json...`);

  // Batch insert for performance
  const BATCH_SIZE = 100;
  let created = 0;

  for (let i = 0; i < sentences.length; i += BATCH_SIZE) {
    const batch = sentences.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(
      batch.map((s) =>
        prisma.sentence.create({
          data: {
            korean_text: s.koreanText,
            theme: s.theme,
            category: s.category,
            difficulty: s.difficulty,
            hint_words: JSON.stringify(s.hintWords),
            tags: JSON.stringify(s.tags || []),
          },
        })
      )
    );
    created += batch.length;
    if (created % 500 === 0 || i + BATCH_SIZE >= sentences.length) {
      console.log(`  Progress: ${created}/${sentences.length}`);
    }
  }

  // Summary
  const byTheme: Record<string, number> = {};
  const byCat: Record<string, number> = {};
  sentences.forEach((s) => {
    byTheme[s.theme] = (byTheme[s.theme] || 0) + 1;
    byCat[`${s.theme}/${s.category}`] = (byCat[`${s.theme}/${s.category}`] || 0) + 1;
  });

  console.log(`\nSeeded ${created} sentences total`);
  console.log("By theme:", byTheme);
  console.log(`Categories: ${Object.keys(byCat).length}`);
  Object.entries(byCat).forEach(([k, v]) => console.log(`  ${k}: ${v}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
