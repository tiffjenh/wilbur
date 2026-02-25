/**
 * Dev-only: preview a lesson snapshot from local files (no Supabase).
 * Route: /dev/lesson-preview
 */
import { useMemo, useState } from "react";
import { mapSnapshotToLesson } from "@/lib/lessons/getPublishedLesson";
import { LessonRenderer } from "@/components/lesson/LessonRenderer";

import adultMoneyGamePlanSnapshot from "@/content/lessons/snapshots/adult-money-game-plan";
import paycheckBasicsSnapshot from "@/content/lessons/snapshots/paycheck-basics";
import budgetingIn10MinutesSnapshot from "@/content/lessons/snapshots/budgeting-in-10-minutes";
import emergencyFundBasicsSnapshot from "@/content/lessons/snapshots/emergency-fund-basics";
import creditCardsStatementBalanceSnapshot from "@/content/lessons/snapshots/credit-cards-statement-balance";
import workBenefits101Snapshot from "@/content/lessons/snapshots/work-benefits-101";
import investingBasicsNoStockPickingSnapshot from "@/content/lessons/snapshots/investing-basics-no-stock-picking";
import studentLoansBasicsSnapshot from "@/content/lessons/snapshots/student-loans-basics";
import w2Vs1099Snapshot from "@/content/lessons/snapshots/w2-vs-1099";
import taxesHowToFileSnapshot from "@/content/lessons/snapshots/taxes-how-to-file";
import writeOffsExplainedSnapshot from "@/content/lessons/snapshots/write-offs-explained";

const SNAPSHOT_MAP = {
  "adult-money-game-plan": adultMoneyGamePlanSnapshot,
  "paycheck-basics": paycheckBasicsSnapshot,
  "budgeting-in-10-minutes": budgetingIn10MinutesSnapshot,
  "emergency-fund-basics": emergencyFundBasicsSnapshot,
  "credit-cards-statement-balance": creditCardsStatementBalanceSnapshot,
  "work-benefits-101": workBenefits101Snapshot,
  "investing-basics-no-stock-picking": investingBasicsNoStockPickingSnapshot,
  "student-loans-basics": studentLoansBasicsSnapshot,
  "w2-vs-1099": w2Vs1099Snapshot,
  "taxes-how-to-file": taxesHowToFileSnapshot,
  "write-offs-explained": writeOffsExplainedSnapshot,
};

type LessonKey = keyof typeof SNAPSHOT_MAP;

export default function LessonPreview() {
  const [selected, setSelected] = useState<LessonKey>("adult-money-game-plan");

  const lesson = useMemo(() => {
    try {
      const snapshot = SNAPSHOT_MAP[selected];
      return mapSnapshotToLesson(
        snapshot as unknown as Record<string, unknown>,
        selected,
        new Date().toISOString(),
        new Date().toISOString()
      );
    } catch (err) {
      console.error("Mapping failed:", err);
      return null;
    }
  }, [selected]);

  if (!lesson) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Lesson Preview (Dev Only)</h2>
        <p>Lesson failed to load. Check the console.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Sticky bar so dropdown is always visible when scrolling */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 16px",
          marginBottom: 24,
          backgroundColor: "#f5f3ee",
          border: "1px solid #e2dcd2",
          borderRadius: 8,
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>Lesson Preview (Dev Only)</h2>
        <label htmlFor="dev-lesson-select" style={{ marginLeft: 8 }}>
          Switch snapshot:
        </label>
        <select
          id="dev-lesson-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value as LessonKey)}
          style={{ padding: "6px 10px", minWidth: 280 }}
        >
          {(Object.keys(SNAPSHOT_MAP) as LessonKey[]).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <LessonRenderer lesson={lesson} />
    </div>
  );
}
