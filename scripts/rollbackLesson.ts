/**
 * Rollback a CMS lesson to a prior revision (restore from lesson_versions snapshot).
 * Requires SUPABASE_SERVICE_ROLE_KEY.
 * Run: npx tsx scripts/rollbackLesson.ts --slug=stocks-101 --toRevision=2 --by=calvin
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const slug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
const toRevision = process.argv.find((a) => a.startsWith("--toRevision="))?.split("=")[1];
const by = process.argv.find((a) => a.startsWith("--by="))?.split("=")[1] ?? "cli";

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
if (!slug || !toRevision) {
  console.error("Usage: npx tsx scripts/rollbackLesson.ts --slug=stocks-101 --toRevision=2 --by=calvin");
  process.exit(1);
}

const rev = parseInt(toRevision, 10);
if (Number.isNaN(rev) || rev < 1) {
  console.error("toRevision must be a positive integer.");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const { data: lesson, error: lessonError } = await supabase.from("cms_lessons").select("id").eq("slug", slug).maybeSingle();
  if (lessonError || !lesson) {
    console.error("Lesson not found:", lessonError?.message ?? slug);
    process.exit(1);
  }

  const { data: version, error: versionError } = await supabase
    .from("cms_lesson_versions")
    .select("snapshot, revision")
    .eq("lesson_id", lesson.id)
    .eq("revision", rev)
    .maybeSingle();

  if (versionError || !version) {
    console.error("Snapshot not found for revision", rev);
    process.exit(1);
  }

  const s = version.snapshot as Record<string, unknown>;
  const { error: updateError } = await supabase
    .from("cms_lessons")
    .update({
      title: s.title,
      subtitle: s.subtitle ?? null,
      category: s.category,
      track: s.track ?? null,
      level: s.level,
      estimated_minutes: s.estimated_minutes,
      hero_takeaways: s.hero_takeaways ?? [],
      content_blocks: s.content_blocks ?? [],
      example_blocks: s.example_blocks ?? [],
      video_blocks: s.video_blocks ?? [],
      quiz: s.quiz ?? null,
      source_citations: s.source_citations ?? [],
      revision: rev,
      updated_by: by,
      status: "published",
    })
    .eq("id", lesson.id);

  if (updateError) {
    console.error("Rollback update failed:", updateError.message);
    process.exit(1);
  }

  console.log(`Rolled back ${slug} to revision ${rev} (by ${by}).`);
}

main();
