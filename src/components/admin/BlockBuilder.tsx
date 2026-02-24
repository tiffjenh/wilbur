/**
 * Block list: Add block dropdown + list of AdminBlockEditor.
 */
import React, { useState } from "react";
import type { CMSBlock } from "@/lib/lessonBlocks/types";
import { AdminBlockEditor } from "./AdminBlockEditor";

const BLOCK_TYPES: { type: CMSBlock["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "paragraph", label: "Paragraph" },
  { type: "bullets", label: "Bullets" },
  { type: "callout", label: "Callout" },
  { type: "divider", label: "Divider" },
  { type: "twoColumn", label: "Two column" },
  { type: "chartPlaceholder", label: "Chart placeholder" },
  { type: "imagePlaceholder", label: "Image placeholder" },
  { type: "comparisonCards", label: "Comparison cards" },
  { type: "chips", label: "Chips" },
];

function createBlock(type: CMSBlock["type"]): CMSBlock {
  switch (type) {
    case "heading": return { type: "heading", level: 2, text: "" };
    case "paragraph": return { type: "paragraph", text: "" };
    case "bullets": return { type: "bullets", items: [""] };
    case "callout": return { type: "callout", variant: "tip", text: "" };
    case "chips": return { type: "chips", items: [] };
    case "divider": return { type: "divider" };
    case "twoColumn": return { type: "twoColumn", left: [], right: [] };
    case "chartPlaceholder": return { type: "chartPlaceholder", chartType: "line", title: "", description: "" };
    case "imagePlaceholder": return { type: "imagePlaceholder", title: "", description: "" };
    case "comparisonCards": return { type: "comparisonCards", cards: [{ title: "", bullets: [] }, { title: "", bullets: [] }] };
    default: return { type: "paragraph", text: "" };
  }
}

export const BlockBuilder: React.FC<{
  title: string;
  blocks: CMSBlock[];
  onChange: (blocks: CMSBlock[]) => void;
  minBlocks?: number;
}> = ({ title, blocks, onChange, minBlocks = 0 }) => {
  const [addOpen, setAddOpen] = useState(false);

  const setBlock = (index: number, block: CMSBlock) => {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...blocks];
    const j = index + dir;
    if (j < 0 || j >= next.length) return;
    [next[index], next[j]] = [next[j], next[index]];
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const addBlock = (type: CMSBlock["type"]) => {
    onChange([...blocks, createBlock(type)]);
    setAddOpen(false);
  };

  return (
    <div style={{ marginBottom: "var(--space-6)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
        <h3 style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, margin: 0 }}>{title}</h3>
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setAddOpen((o) => !o)}
            style={{
              padding: "6px 12px",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface)",
              cursor: "pointer",
            }}
          >
            Add block
          </button>
          {addOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setAddOpen(false)} aria-hidden />
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: 4,
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border-light)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-dropdown)",
                  padding: "4px",
                  zIndex: 20,
                  minWidth: 180,
                }}
              >
                {BLOCK_TYPES.map(({ type, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addBlock(type)}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "8px 10px",
                      textAlign: "left",
                      fontSize: "var(--text-sm)",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {blocks.length < minBlocks && (
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)" }}>
          Add at least {minBlocks} block(s).
        </p>
      )}
      {blocks.map((block, i) => (
        <AdminBlockEditor
          key={i}
          block={block}
          index={i}
          total={blocks.length}
          onChange={(b) => setBlock(i, b)}
          onMoveUp={() => move(i, -1)}
          onMoveDown={() => move(i, 1)}
          onDelete={() => remove(i)}
        />
      ))}
    </div>
  );
};
