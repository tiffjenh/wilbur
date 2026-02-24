/**
 * Set scheduled_publish_at for a CMS lesson (cron can run publish later).
 * Run: npx tsx scripts/schedulePublish.ts --slug=stocks-101 --at=2026-03-01T09:00:00Z
 * Requires SUPABASE_SERVICE_ROLE_KEY.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const slug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
const at = process.argv.find((a) => a.startsWith("--at="))?.split("=")[1];

if (!url || !serviceKey || !slug || !at) {
  console.error("Usage: npx tsx scripts/schedulePublish.ts --slug=stocks-101 --at=2026-03-01T09:00:00Z");
  process.exit(1);
}

const atDate = new Date(at);
if (Number.isNaN(atDate.getTime())) {
  console.error("Invalid --at date (use ISO 8601).");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const { error } = await supabase
    .from("cms_lessons")
    .update({ scheduled_publish_at: atDate.toISOString() })
    .eq("slug", slug);

  if (error) {
    console.error("Update failed:", error.message);
    process.exit(1);
  }
  console.log(`Scheduled ${slug} for ${at}. (Implement cron to run publishLesson at that time.)`);
}

main();
