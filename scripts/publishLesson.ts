/**
 * Publish a CMS lesson: validate, snapshot to lesson_versions, update lesson.
 * Requires SUPABASE_SERVICE_ROLE_KEY for write.
 * Run: npx tsx scripts/publishLesson.ts --slug=stocks-101 --by=calvin
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { validateLessonContent } from "../src/lib/lessonBlocks/schema";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const slug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
const by = process.argv.find((a) => a.startsWith("--by="))?.split("=")[1] ?? "cli";

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY (and URL). Use anon key only for read; publish needs service role.");
  process.exit(1);
}
if (!slug) {
  console.error("Usage: npx tsx scripts/publishLesson.ts --slug=stocks-101 --by=calvin");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const { data: lesson, error: fetchError } = await supabase
    .from("cms_lessons")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (fetchError || !lesson) {
    console.error("Lesson not found or fetch error:", fetchError?.message ?? "not found");
    process.exit(1);
  }

  const payload = {
    hero_takeaways: lesson.hero_takeaways ?? [],
    content_blocks: lesson.content_blocks ?? [],
    example_blocks: lesson.example_blocks ?? [],
    video_blocks: lesson.video_blocks ?? [],
    quiz: lesson.quiz ?? null,
    source_citations: lesson.source_citations ?? [],
  };
  const validation = validateLessonContent(payload);
  if (!validation.success) {
    console.error("Validation failed:");
    validation.errors.forEach((e) => console.error(" -", e));
    process.exit(1);
  }

  const revision = (Number(lesson.revision) || 0) + 1;
  const snapshot = {
    slug: lesson.slug,
    title: lesson.title,
    subtitle: lesson.subtitle,
    category: lesson.category,
    track: lesson.track,
    level: lesson.level,
    estimated_minutes: lesson.estimated_minutes,
    hero_takeaways: lesson.hero_takeaways,
    content_blocks: lesson.content_blocks,
    example_blocks: lesson.example_blocks,
    video_blocks: lesson.video_blocks,
    quiz: lesson.quiz,
    source_citations: lesson.source_citations,
    revision,
  };

  const { error: insertVersionError } = await supabase.from("cms_lesson_versions").insert({
    lesson_id: lesson.id,
    revision,
    status: "published",
    snapshot,
    created_by: by,
  });
  if (insertVersionError) {
    console.error("Failed to insert snapshot:", insertVersionError.message);
    process.exit(1);
  }

  const { error: updateError } = await supabase
    .from("cms_lessons")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      revision,
      updated_by: by,
    })
    .eq("id", lesson.id);

  if (updateError) {
    console.error("Failed to update lesson:", updateError.message);
    process.exit(1);
  }

  console.log(`Published ${slug} at revision ${revision} (by ${by}).`);
}

main();
