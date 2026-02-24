/**
 * Validate CMS lesson content (all or by slug).
 * Exit code 0 if all valid, non-zero if any invalid.
 * Run: npx tsx scripts/validateLessons.ts [slug]
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { validateLessonContent } from "../src/lib/lessonBlocks/schema";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const anon = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const slugArg = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];

if (!url || !anon) {
  console.error("Missing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or SUPABASE_*).");
  process.exit(1);
}

const supabase = createClient(url, anon);

async function main() {
  let rows: { slug: string; title: string; content_blocks: unknown; example_blocks: unknown; video_blocks: unknown; quiz: unknown; hero_takeaways: unknown; source_citations: unknown }[];

  if (slugArg) {
    const { data, error } = await supabase
      .from("cms_lessons")
      .select("slug, title, hero_takeaways, content_blocks, example_blocks, video_blocks, quiz, source_citations")
      .eq("slug", slugArg)
      .maybeSingle();
    if (error) {
      console.error("Fetch error:", error.message);
      process.exit(1);
    }
    rows = data ? [data as (typeof rows)[0]] : [];
  } else {
    const { data, error } = await supabase
      .from("cms_lessons")
      .select("slug, title, hero_takeaways, content_blocks, example_blocks, video_blocks, quiz, source_citations");
    if (error) {
      console.error("Fetch error:", error.message);
      process.exit(1);
    }
    rows = (data ?? []) as typeof rows;
  }

  let failed = 0;
  for (const row of rows) {
    const lesson = {
      hero_takeaways: row.hero_takeaways ?? [],
      content_blocks: row.content_blocks ?? [],
      example_blocks: row.example_blocks ?? [],
      video_blocks: row.video_blocks ?? [],
      quiz: row.quiz ?? null,
      source_citations: row.source_citations ?? [],
    };
    const result = validateLessonContent(lesson);
    if (result.success) {
      console.log(`✅ ${row.slug} (${row.title})`);
    } else {
      console.log(`❌ ${row.slug} (${row.title})`);
      result.errors.forEach((e) => console.log(`   - ${e}`));
      failed++;
    }
  }

  if (failed > 0) {
    console.log(`\n${failed} lesson(s) invalid.`);
    process.exit(1);
  }
  console.log("\nAll lessons valid.");
}

main();
