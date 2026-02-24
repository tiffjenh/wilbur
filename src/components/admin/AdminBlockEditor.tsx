/**
 * Per-block editor: type-specific form fields + move up/down/delete.
 */
import React from "react";
import type { CMSBlock } from "@/lib/lessonBlocks/types";

const blockLabel = (b: CMSBlock): string => {
  switch (b.type) {
    case "heading": return `Heading (h${b.level})`;
    case "paragraph": return "Paragraph";
    case "bullets": return "Bullets";
    case "callout": return `Callout (${b.variant})`;
    case "chips": return "Chips";
    case "divider": return "Divider";
    case "twoColumn": return "Two column";
    case "chartPlaceholder": return "Chart placeholder";
    case "imagePlaceholder": return "Image placeholder";
    case "comparisonCards": return "Comparison cards";
    default: return (b as { type: string }).type;
  }
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-sm)",
  border: "1px solid var(--color-border-light)",
  borderRadius: "var(--radius-md)",
};

export const AdminBlockEditor: React.FC<{
  block: CMSBlock;
  index: number;
  total: number;
  onChange: (block: CMSBlock) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}> = ({ block, index, total, onChange, onMoveUp, onMoveDown, onDelete }) => {
  const wrapStyle: React.CSSProperties = {
    padding: "var(--space-3)",
    border: "1px solid var(--color-border-light)",
    borderRadius: "var(--radius-md)",
    marginBottom: "var(--space-2)",
    backgroundColor: "var(--color-surface)",
  };

  const renderFields = () => {
    switch (block.type) {
      case "heading":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Level</label>
            <select
              value={block.level}
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 })}
              style={inputStyle}
            >
              <option value={2}>H2</option>
              <option value={3}>H3</option>
            </select>
            <label style={{ display: "block", marginTop: 8, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Text</label>
            <input
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              style={inputStyle}
              maxLength={120}
            />
          </>
        );
      case "paragraph":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Text</label>
            <textarea
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              style={{ ...inputStyle, minHeight: 80 }}
              maxLength={500}
            />
          </>
        );
      case "bullets":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Items (one per line)</label>
            <textarea
              value={block.items.join("\n")}
              onChange={(e) => onChange({ ...block, items: e.target.value.split("\n").filter(Boolean) })}
              style={{ ...inputStyle, minHeight: 80 }}
              placeholder="Item 1&#10;Item 2"
            />
          </>
        );
      case "callout":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Variant</label>
            <select
              value={block.variant}
              onChange={(e) => onChange({ ...block, variant: e.target.value as "tip" | "note" | "warning" })}
              style={inputStyle}
            >
              <option value="tip">Tip</option>
              <option value="note">Note</option>
              <option value="warning">Warning</option>
            </select>
            <label style={{ display: "block", marginTop: 8, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Title (optional)</label>
            <input value={block.title ?? ""} onChange={(e) => onChange({ ...block, title: e.target.value || undefined })} style={inputStyle} />
            <label style={{ display: "block", marginTop: 8, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Text</label>
            <textarea value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} style={{ ...inputStyle, minHeight: 60 }} maxLength={500} />
          </>
        );
      case "chips":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Items (comma or newline)</label>
            <textarea
              value={Array.isArray(block.items) ? block.items.join(", ") : ""}
              onChange={(e) => onChange({ ...block, items: e.target.value.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) })}
              style={{ ...inputStyle, minHeight: 60 }}
            />
          </>
        );
      case "divider":
        return <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>No fields</span>;
      case "chartPlaceholder":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Chart type</label>
            <select
              value={block.chartType}
              onChange={(e) => onChange({ ...block, chartType: e.target.value as "line" | "bar" | "pie" })}
              style={inputStyle}
            >
              <option value="line">Line</option>
              <option value="bar">Bar</option>
              <option value="pie">Pie</option>
            </select>
            <label style={{ display: "block", marginTop: 8, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Title</label>
            <input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} style={inputStyle} />
            <label style={{ display: "block", marginTop: 8, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Description</label>
            <input value={block.description} onChange={(e) => onChange({ ...block, description: e.target.value })} style={inputStyle} />
          </>
        );
      case "imagePlaceholder":
        return (
          <>
            <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Title</label>
            <input value={block.title} onChange={(e) => onChange({ ...block, title: e.target.value })} style={inputStyle} />
            <label style={{ display: "block", marginTop: 8, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Description</label>
            <input value={block.description} onChange={(e) => onChange({ ...block, description: e.target.value })} style={inputStyle} />
          </>
        );
      case "twoColumn":
        return (
          <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            Two-column: edit left/right block arrays in JSON or add a simpler UI later. Left: {block.left?.length ?? 0} blocks, Right: {block.right?.length ?? 0} blocks.
          </div>
        );
      case "comparisonCards":
        return (
          <>
            {([0, 1] as const).map((i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Card {i + 1} title</label>
                <input
                  value={block.cards[i]?.title ?? ""}
                  onChange={(e) => {
                    const cards = [...block.cards];
                    cards[i] = { ...cards[i], title: e.target.value, bullets: cards[i]?.bullets ?? [] };
                    onChange({ ...block, cards: cards as [typeof block.cards[0], typeof block.cards[1]] });
                  }}
                  style={inputStyle}
                />
                <label style={{ display: "block", marginTop: 6, marginBottom: 4, fontSize: "var(--text-xs)", fontWeight: 600 }}>Bullets (one per line)</label>
                <textarea
                  value={block.cards[i]?.bullets?.join("\n") ?? ""}
                  onChange={(e) => {
                    const cards = [...block.cards];
                    cards[i] = { ...cards[i], bullets: e.target.value.split("\n").filter(Boolean), title: cards[i]?.title ?? "" };
                    onChange({ ...block, cards: cards as [typeof block.cards[0], typeof block.cards[1]] });
                  }}
                  style={{ ...inputStyle, minHeight: 60 }}
                />
              </div>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={wrapStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-2)" }}>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600 }}>{blockLabel(block)}</span>
        <div style={{ display: "flex", gap: 4 }}>
          <button type="button" onClick={onMoveUp} disabled={index === 0} style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}>
            Up
          </button>
          <button type="button" onClick={onMoveDown} disabled={index >= total - 1} style={{ padding: "4px 8px", fontSize: "var(--text-xs)" }}>
            Down
          </button>
          <button type="button" onClick={onDelete} style={{ padding: "4px 8px", fontSize: "var(--text-xs)", color: "var(--color-error, #c0392b)" }}>
            Delete
          </button>
        </div>
      </div>
      {renderFields()}
    </div>
  );
};
