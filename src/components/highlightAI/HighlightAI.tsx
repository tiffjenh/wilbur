/**
 * Highlight-to-explain: selection inside lesson content triggers AI Helper.
 * - Only on mouseup (not selectionchange) to avoid multiple triggers.
 * - Only inside container; selected text 3–120 chars (over 120: show "Select a shorter phrase").
 * - Duplicate selection (same text) is ignored. Calls onAsk(text) to open panel and request explanation.
 */
import React, { useState, useEffect, useRef, useCallback } from "react";

const MAX_SELECTION_LENGTH = 120;
const isDev = Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV);

interface FloatingTooltipProps {
  text: string;
  position: { x: number; y: number };
  tooLong: boolean;
  onAsk: (text: string) => void;
  onDismiss: () => void;
}

function FloatingTooltip({ text, position, tooLong, onAsk, onDismiss }: FloatingTooltipProps) {
  return (
    <div
      style={{
        position: "fixed",
        left: position.x,
        top: position.y - 40,
        transform: "translateX(-50%)",
        zIndex: 9999,
        backgroundColor: tooLong ? "#7a7a6e" : "#0E5C4C",
        color: "#fff",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 12,
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        cursor: tooLong ? "default" : "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: 6,
        userSelect: "none",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {tooLong ? (
        <span>Select a shorter phrase</span>
      ) : (
        <span onClick={() => onAsk(text)}>Ask Wilbur</span>
      )}
      <button
        onClick={onDismiss}
        style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: "0 0 0 4px", fontSize: 14, lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}

interface HighlightAIProps {
  containerRef: React.RefObject<HTMLElement | null>;
  onAsk?: (text: string) => void;
}

export function HighlightAI({ containerRef, onAsk }: HighlightAIProps) {
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number; tooLong: boolean } | null>(null);
  const lastSentRef = useRef<string>("");

  const handleHighlight = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim() ?? "";
    const container = containerRef.current;
    if (!container) return;

    if (isDev) {
      console.log("[HighlightAI] mouseup", { textLen: text.length, hasRange: !!(sel && sel.rangeCount > 0) });
    }

    if (!text || text.length < 3) {
      setTooltip(null);
      lastSentRef.current = "";
      return;
    }

    const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
    const inside = range ? container.contains(range.commonAncestorContainer) : false;
    if (!inside) {
      if (isDev) console.log("[HighlightAI] selection outside container, ignoring");
      setTooltip(null);
      lastSentRef.current = "";
      return;
    }

    const rect = range?.getBoundingClientRect();
    if (!rect) {
      setTooltip(null);
      return;
    }

    const tooLong = text.length > MAX_SELECTION_LENGTH;
    setTooltip({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top,
      tooLong,
    });
    // Ignore duplicate selection; only call onAsk when text changed
    if (!tooLong && onAsk && text !== lastSentRef.current) {
      lastSentRef.current = text;
      onAsk(text);
    }
  }, [containerRef, onAsk]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mouseup", handleHighlight);
    el.addEventListener("touchend", handleHighlight, { passive: true });
    const clickOutside = () => {
      if (!window.getSelection()?.toString()) {
        setTooltip(null);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => {
      el.removeEventListener("mouseup", handleHighlight);
      el.removeEventListener("touchend", handleHighlight);
      document.removeEventListener("mousedown", clickOutside);
    };
  }, [containerRef, handleHighlight]);

  const handleAsk = useCallback(
    (text: string) => {
      setTooltip(null);
      window.getSelection()?.removeAllRanges();
      if (text.length <= MAX_SELECTION_LENGTH && onAsk) onAsk(text);
    },
    [onAsk]
  );

  const handleDismiss = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <>
      {tooltip && (
        <FloatingTooltip
          text={tooltip.text}
          position={{ x: tooltip.x, y: tooltip.y }}
          tooLong={tooltip.tooLong}
          onAsk={handleAsk}
          onDismiss={handleDismiss}
        />
      )}
    </>
  );
}
