import type { LearningPlan, LearningChunk, ProfileTraits } from "./traits";
import { LESSON_META } from "./lessonMeta";
import { getPersonaBaseline } from "./personaBaseline";
import { LESSON_REGISTRY } from "@/lib/stubData";

function exists(id: string) {
  return Boolean((LESSON_REGISTRY as any)?.[id]);
}

function addReason(
  reasons: Record<string, string[]>,
  id: string,
  reason: string
) {
  if (!reasons[id]) reasons[id] = [];
  reasons[id].push(reason);
}

function isSuppressed(id: string, traits: ProfileTraits) {
  const meta = LESSON_META[id];
  if (!meta?.suppressedBy?.length) return false;
  return meta.suppressedBy.some((fn) => fn(traits));
}

function ensureIncluded(list: string[], id: string) {
  if (!list.includes(id)) list.push(id);
}

export function buildLearningPlan(traits: ProfileTraits): LearningPlan {
  const lessonReasons: Record<string, string[]> = {};

  // 1) Persona baseline = sequence bias (not a cage)
  const baseline = getPersonaBaseline(traits.persona).filter(exists);
  baseline.forEach((id) =>
    addReason(lessonReasons, id, `Included in your base plan for ${traits.persona}.`)
  );

  // 2) Trait overrides (include/suppress/boost)
  const ids = [...baseline];

  if (traits.hasCreditCardDebt) {
    ensureIncluded(ids, "credit-cards-statement-balance");
    addReason(lessonReasons, "credit-cards-statement-balance", "You said you have credit card debt.");
  }

  if (traits.hasStudentLoans) {
    ensureIncluded(ids, "student-loans-basics");
    addReason(lessonReasons, "student-loans-basics", "You said you have student loans.");
  }

  // emergency fund unknown + low confidence => include
  if (traits.hasEmergencyFund === null && traits.confidenceLevel <= 2) {
    ensureIncluded(ids, "emergency-fund-basics");
    addReason(lessonReasons, "emergency-fund-basics", "You said you feel less confident, so we start with stability.");
  }

  // W-2 => include paycheck + benefits + taxes filing
  if (traits.incomeTypes.includes("w2")) {
    ensureIncluded(ids, "paycheck-basics");
    ensureIncluded(ids, "work-benefits-101");
    ensureIncluded(ids, "taxes-how-to-file");
    addReason(lessonReasons, "paycheck-basics", "You said you have a W-2 job.");
    addReason(lessonReasons, "work-benefits-101", "You said you have a W-2 job, so benefits may apply.");
    addReason(lessonReasons, "taxes-how-to-file", "You have W-2 income, so filing taxes applies.");
  }

  // 1099 / freelance / business => include W-2 vs 1099, taxes how-to-file, write-offs
  if (
    traits.incomeTypes.includes("freelance_1099") ||
    traits.incomeTypes.includes("business_owner")
  ) {
    ensureIncluded(ids, "w2-vs-1099");
    ensureIncluded(ids, "taxes-how-to-file");
    ensureIncluded(ids, "write-offs-explained");
    addReason(lessonReasons, "w2-vs-1099", "You said you have 1099 or business income.");
    addReason(lessonReasons, "taxes-how-to-file", "You have 1099 or business income, so filing and estimated taxes apply.");
    addReason(lessonReasons, "write-offs-explained", "You have 1099 or business income; write-offs may apply.");
  }

  // filter: existing + not suppressed
  const filtered = ids.filter(exists).filter((id) => !isSuppressed(id, traits));

  // 3) Weight boosts (ordering within chunk)
  const weightBoost: Record<string, number> = {};

  const investingInterest =
    traits.interests.has("Investing basics") ||
    traits.interests.has("Stocks & ETFs") ||
    traits.interests.has("Advanced investing (options, trading)");

  if (investingInterest) {
    weightBoost["investing-basics-no-stock-picking"] = 15;
    addReason(lessonReasons, "investing-basics-no-stock-picking", "You said you're interested in investing.");
  }

  if (traits.interests.has("I don't know what any of these are")) {
    weightBoost["adult-money-game-plan"] = 20;
    weightBoost["budgeting-in-10-minutes"] = 15;
    weightBoost["emergency-fund-basics"] = 10;
    addReason(lessonReasons, "adult-money-game-plan", "You said you're not sure where to start, so we begin with a simple plan.");
  }

  // 4) Chunk grouping
  const chunkTitles: Record<"stability" | "income" | "growth", { title: string; description: string }> = {
    stability: {
      title: "Chunk 1: Stability First",
      description: "Get calm and in control — budget, build a buffer, and avoid expensive debt.",
    },
    income: {
      title: "Chunk 2: Income & Work Benefits",
      description: "Understand your paycheck and benefits so you stop leaving money on the table.",
    },
    growth: {
      title: "Chunk 3: Growth (Investing Basics)",
      description: "Build long-term investing confidence without hype or stock-picking.",
    },
  };

  // baseline index = stable ordering tie-breaker
  const baselineIndex = new Map<string, number>();
  baseline.forEach((id, i) => baselineIndex.set(id, i));

  const byChunk: Record<"stability" | "income" | "growth", string[]> = {
    stability: [],
    income: [],
    growth: [],
  };

  for (const id of filtered) {
    const chunk = (LESSON_META[id]?.chunk ?? "stability") as "stability" | "income" | "growth";
    byChunk[chunk].push(id);
  }

  const sortChunk = (arr: string[]) =>
    arr.sort((a, b) => {
      const aBase = baselineIndex.get(a) ?? 999;
      const bBase = baselineIndex.get(b) ?? 999;
      if (aBase !== bBase) return aBase - bBase;

      const aW = (LESSON_META[a]?.baseWeight ?? 0) + (weightBoost[a] ?? 0);
      const bW = (LESSON_META[b]?.baseWeight ?? 0) + (weightBoost[b] ?? 0);
      if (aW !== bW) return bW - aW;

      return a.localeCompare(b);
    });

  sortChunk(byChunk.stability);
  sortChunk(byChunk.income);
  sortChunk(byChunk.growth);

  const chunks: LearningChunk[] = (["stability", "income", "growth"] as const).map((id) => ({
    id,
    title: chunkTitles[id].title,
    description: chunkTitles[id].description,
    lessonIds: byChunk[id],
  }));

  const recommendedLessonIds = chunks.flatMap((c) => c.lessonIds);

  return {
    persona: traits.persona,
    chunks,
    recommendedLessonIds,
    lessonReasons,
  };
}
