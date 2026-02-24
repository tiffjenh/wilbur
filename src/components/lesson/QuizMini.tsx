/**
 * 3-question MCQ quiz. Local state; shows correct/incorrect + explanation.
 */
import React, { useState } from "react";
import type { QuizSpec } from "@/lib/lessonBlocks/types";

const BLOCK_RADIUS = 12;
const BLOCK_PADDING = "20px 24px";

export const QuizMini: React.FC<{ quiz: QuizSpec }> = ({ quiz }) => {
  const [selectedByQuestion, setSelectedByQuestion] = useState<Record<number, number>>({});

  const questions = quiz.questions;

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        borderRadius: BLOCK_RADIUS,
        padding: BLOCK_PADDING,
      }}
    >
      <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text)", margin: "0 0 var(--space-4)" }}>
        {quiz.title}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        {questions.map((q, qIdx) => {
          const chosen = selectedByQuestion[qIdx] ?? null;
          const isAnswered = chosen !== null;
          const showResult = isAnswered;

          return (
            <div key={qIdx} style={{ paddingBottom: "var(--space-4)", borderBottom: qIdx < questions.length - 1 ? "1px solid var(--color-border-light)" : "none" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text)", margin: "0 0 var(--space-3)" }}>
                {q.prompt}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.choices.map((choice, cIdx) => {
                  const isChosen = chosen === cIdx;
                  const isCorrectChoice = cIdx === q.correctIndex;
                  const showCorrect = showResult && isCorrectChoice;
                  const showWrong = showResult && isChosen && !isCorrectChoice;
                  return (
                    <button
                      key={cIdx}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setSelectedByQuestion((prev) => ({ ...prev, [qIdx]: cIdx }));
                      }}
                      style={{
                        display: "block",
                        textAlign: "left",
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        border: `1.5px solid ${showCorrect ? "var(--color-success)" : showWrong ? "rgba(217,83,79,0.5)" : "var(--color-border)"}`,
                        backgroundColor: showCorrect ? "var(--color-success-bg)" : showWrong ? "rgba(217,83,79,0.06)" : "transparent",
                        fontFamily: "var(--font-sans)",
                        fontSize: "var(--text-sm)",
                        color: "var(--color-text)",
                        cursor: isAnswered ? "default" : "pointer",
                      }}
                    >
                      {choice}
                      {showCorrect && <span style={{ marginLeft: 8, color: "var(--color-success)", fontWeight: 600 }}>✓ Correct</span>}
                      {showWrong && <span style={{ marginLeft: 8, color: "#c0392b", fontWeight: 600 }}>✗</span>}
                    </button>
                  );
                })}
              </div>
              {showResult && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginTop: 12, lineHeight: 1.6 }}>
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
