/**
 * Seed CMS lessons into Supabase (cms_lessons table).
 * Run: npx tsx scripts/seedLessons.ts
 * Requires: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (or env)
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;

if (!url || !anon) {
  console.error("Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_URL / SUPABASE_ANON_KEY).");
  process.exit(1);
}

const supabase = createClient(url, anon);

type LessonRow = {
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  track: string | null;
  level: "beginner" | "intermediate" | "advanced";
  estimated_minutes: number;
  hero_takeaways: string[];
  content_blocks: unknown[];
  example_blocks: unknown[];
  video_blocks: unknown[];
  quiz: unknown;
  source_citations: unknown[];
  status: "draft" | "published";
};

async function main() {
  const stocksPath = join(root, "content", "lessons", "stocks-101.json");
  const stocksRaw = readFileSync(stocksPath, "utf-8");
  const stocks = JSON.parse(stocksRaw) as LessonRow;
  stocks.status = "published";

  const { error: e1 } = await supabase.from("cms_lessons").upsert(
    {
      slug: stocks.slug,
      title: stocks.title,
      subtitle: stocks.subtitle,
      category: stocks.category,
      track: stocks.track,
      level: stocks.level,
      estimated_minutes: stocks.estimated_minutes,
      hero_takeaways: stocks.hero_takeaways,
      content_blocks: stocks.content_blocks,
      example_blocks: stocks.example_blocks,
      video_blocks: stocks.video_blocks,
      quiz: stocks.quiz,
      source_citations: stocks.source_citations,
      status: stocks.status,
      published_at: new Date().toISOString(),
      revision: 1,
    },
    { onConflict: "slug" }
  );
  if (e1) {
    console.error("stocks-101 upsert error:", e1);
    process.exit(1);
  }
  console.log("Upserted: stocks-101 (published)");

  const placeholders: LessonRow[] = [
    {
      slug: "bonds-101",
      title: "Bonds 101",
      subtitle: null,
      category: "Investing",
      track: "Bonds",
      level: "beginner",
      estimated_minutes: 8,
      hero_takeaways: [],
      content_blocks: [{ type: "paragraph", text: "Content coming soon." }],
      example_blocks: [],
      video_blocks: [],
      quiz: null,
      source_citations: [],
      status: "draft",
    },
    {
      slug: "crypto-101",
      title: "Crypto 101",
      subtitle: null,
      category: "Investing",
      track: "Crypto",
      level: "advanced",
      estimated_minutes: 10,
      hero_takeaways: [],
      content_blocks: [{ type: "paragraph", text: "Content coming soon." }],
      example_blocks: [],
      video_blocks: [],
      quiz: null,
      source_citations: [],
      status: "draft",
    },
  ];

  for (const row of placeholders) {
    const { error } = await supabase.from("cms_lessons").upsert(
      {
        slug: row.slug,
        title: row.title,
        subtitle: row.subtitle,
        category: row.category,
        track: row.track,
        level: row.level,
        estimated_minutes: row.estimated_minutes,
        hero_takeaways: row.hero_takeaways,
        content_blocks: row.content_blocks,
        example_blocks: row.example_blocks,
        video_blocks: row.video_blocks,
        quiz: row.quiz,
        source_citations: row.source_citations,
        status: row.status,
      },
      { onConflict: "slug" }
    );
    if (error) {
      console.error(`${row.slug} upsert error:`, error);
    } else {
      console.log(`Upserted: ${row.slug} (draft)`);
    }
  }

  console.log("Seed done.");
}

main();
