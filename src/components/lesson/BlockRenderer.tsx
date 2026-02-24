/**
 * Renders CMS block array (from Supabase cms_lessons).
 * Uses existing Wilbur design tokens; no redesign.
 */
import type {
  CMSBlock,
  HeadingBlock,
  ParagraphBlock,
  BulletsBlock,
  CalloutBlock,
  ChipsBlock,
  TwoColumnBlock,
  ChartPlaceholderBlock,
  ImagePlaceholderBlock,
  ComparisonCardsBlock,
} from "@/lib/lessonBlocks/types";

const BLOCK_RADIUS = 12;
const BLOCK_PADDING = "20px 24px";
const BLOCK_MB = 16;

const CALLOUT_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  tip: { bg: "rgba(14,92,76,0.08)", border: "rgba(14,92,76,0.25)", label: "Tip" },
  note: { bg: "rgba(14,92,76,0.06)", border: "rgba(14,92,76,0.2)", label: "Note" },
  warning: { bg: "rgba(217,83,79,0.06)", border: "rgba(217,83,79,0.2)", label: "Heads up" },
};

function Heading({ level, text }: HeadingBlock) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <Tag
      style={{
        fontFamily: "var(--font-serif)",
        fontSize: level === 2 ? "var(--text-xl)" : "var(--text-lg)",
        fontWeight: 600,
        color: "var(--color-text)",
        margin: "0 0 var(--space-3)",
        lineHeight: 1.3,
      }}
    >
      {text}
    </Tag>
  );
}

function Paragraph({ text }: ParagraphBlock) {
  return (
    <p
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "var(--text-base)",
        color: "var(--color-text-secondary)",
        lineHeight: 1.65,
        margin: "0 0 var(--space-4)",
      }}
    >
      {text}
    </p>
  );
}

function Bullets({ items }: BulletsBlock) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        borderRadius: BLOCK_RADIUS,
        padding: BLOCK_PADDING,
        marginBottom: BLOCK_MB,
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, i) => (
          <li
            key={i}
            style={{
              display: "flex",
              gap: 12,
              fontSize: "var(--text-sm)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              fontFamily: "var(--font-sans)",
            }}
          >
            <span style={{ color: "var(--color-primary)", fontWeight: 700, flexShrink: 0 }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Callout({ variant, title, text }: CalloutBlock) {
  const style = CALLOUT_STYLES[variant] ?? CALLOUT_STYLES.note;
  return (
    <div
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: BLOCK_RADIUS,
        padding: BLOCK_PADDING,
        marginBottom: BLOCK_MB,
      }}
    >
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-primary)", marginBottom: 6 }}>
        {title ?? style.label}
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", margin: 0, lineHeight: 1.65 }}>
        {text}
      </p>
    </div>
  );
}

function Chips({ items }: ChipsBlock) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: BLOCK_MB }}>
      {items.map((item, i) => (
        <span
          key={i}
          style={{
            padding: "6px 12px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-accent-light)",
            border: "1px solid var(--color-accent-border)",
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-secondary)",
          }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: "1px solid var(--color-border-light)", margin: "var(--space-6) 0" }} />;
}

function TwoColumn({ left, right }: TwoColumnBlock) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)", marginBottom: BLOCK_MB }}>
      <div>
        {left.map((b, i) => (
          <CMSBlockRenderer key={i} block={b} />
        ))}
      </div>
      <div>
        {right.map((b, i) => (
          <CMSBlockRenderer key={i} block={b} />
        ))}
      </div>
    </div>
  );
}

function ChartPlaceholder({ chartType, title, description }: ChartPlaceholderBlock) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        borderRadius: BLOCK_RADIUS,
        padding: BLOCK_PADDING,
        marginBottom: BLOCK_MB,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 8 }}>[{chartType} chart]</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{title}</div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

function ImagePlaceholder({ title, description }: ImagePlaceholderBlock) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        borderRadius: BLOCK_RADIUS,
        padding: BLOCK_PADDING,
        marginBottom: BLOCK_MB,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginBottom: 8 }}>[image]</div>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{title}</div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", margin: 0, lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

function ComparisonCards({ cards }: ComparisonCardsBlock) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: BLOCK_MB }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            backgroundColor: i === 0 ? "rgba(14,92,76,0.04)" : "var(--color-surface)",
            border: `1px solid ${i === 0 ? "rgba(14,92,76,0.2)" : "var(--color-border-light)"}`,
            borderRadius: BLOCK_RADIUS,
            padding: "16px 18px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", fontWeight: 700, color: "var(--color-text)" }}>{card.title}</span>
            {card.badge && (
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  backgroundColor: "var(--color-accent-light)",
                  color: "var(--color-primary)",
                }}
              >
                {card.badge}
              </span>
            )}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {card.bullets.map((pt, j) => (
              <li key={j} style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", lineHeight: 1.5, fontFamily: "var(--font-sans)", display: "flex", gap: 8 }}>
                <span style={{ color: "var(--color-primary)", flexShrink: 0 }}>·</span>
                {pt}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CMSBlockRenderer({ block }: { block: CMSBlock }) {
  switch (block.type) {
    case "heading":
      return <Heading {...block} />;
    case "paragraph":
      return <Paragraph {...block} />;
    case "bullets":
      return <Bullets {...block} />;
    case "callout":
      return <Callout {...block} />;
    case "chips":
      return <Chips {...block} />;
    case "divider":
      return <Divider />;
    case "twoColumn":
      return <TwoColumn {...block} />;
    case "chartPlaceholder":
      return <ChartPlaceholder {...block} />;
    case "imagePlaceholder":
      return <ImagePlaceholder {...block} />;
    case "comparisonCards":
      return <ComparisonCards {...block} />;
    default:
      return null;
  }
}

export function BlockRenderer({ blocks }: { blocks: CMSBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => (
        <CMSBlockRenderer key={i} block={block} />
      ))}
    </>
  );
}
