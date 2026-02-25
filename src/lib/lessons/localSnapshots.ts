/**
 * Local lesson snapshots (no Supabase). Used when getPublishedLesson and CMS return null
 * so the Lesson page can still render snapshot content.
 */
import adultMoneyGamePlanSnapshot from "@/content/lessons/snapshots/adult-money-game-plan";
import budgetingIn10MinutesSnapshot from "@/content/lessons/snapshots/budgeting-in-10-minutes";
import creditCardsStatementBalanceSnapshot from "@/content/lessons/snapshots/credit-cards-statement-balance";
import emergencyFundBasicsSnapshot from "@/content/lessons/snapshots/emergency-fund-basics";
import investingBasicsNoStockPickingSnapshot from "@/content/lessons/snapshots/investing-basics-no-stock-picking";
import paycheckBasicsSnapshot from "@/content/lessons/snapshots/paycheck-basics";
import studentLoansBasicsSnapshot from "@/content/lessons/snapshots/student-loans-basics";
import taxesHowToFileSnapshot from "@/content/lessons/snapshots/taxes-how-to-file";
import w2Vs1099Snapshot from "@/content/lessons/snapshots/w2-vs-1099";
import workBenefits101Snapshot from "@/content/lessons/snapshots/work-benefits-101";
import writeOffsExplainedSnapshot from "@/content/lessons/snapshots/write-offs-explained";

const LOCAL_SNAPSHOTS: Record<string, Record<string, unknown>> = {
  "adult-money-game-plan": adultMoneyGamePlanSnapshot as unknown as Record<string, unknown>,
  "budgeting-in-10-minutes": budgetingIn10MinutesSnapshot as unknown as Record<string, unknown>,
  "credit-cards-statement-balance": creditCardsStatementBalanceSnapshot as unknown as Record<string, unknown>,
  "emergency-fund-basics": emergencyFundBasicsSnapshot as unknown as Record<string, unknown>,
  "investing-basics-no-stock-picking": investingBasicsNoStockPickingSnapshot as unknown as Record<string, unknown>,
  "paycheck-basics": paycheckBasicsSnapshot as unknown as Record<string, unknown>,
  "student-loans-basics": studentLoansBasicsSnapshot as unknown as Record<string, unknown>,
  "taxes-how-to-file": taxesHowToFileSnapshot as unknown as Record<string, unknown>,
  "w2-vs-1099": w2Vs1099Snapshot as unknown as Record<string, unknown>,
  "work-benefits-101": workBenefits101Snapshot as unknown as Record<string, unknown>,
  "write-offs-explained": writeOffsExplainedSnapshot as unknown as Record<string, unknown>,
};

/** Returns local snapshot for lesson slug, or null if not available. */
export function getLocalSnapshot(lessonId: string): Record<string, unknown> | null {
  return LOCAL_SNAPSHOTS[lessonId] ?? null;
}
