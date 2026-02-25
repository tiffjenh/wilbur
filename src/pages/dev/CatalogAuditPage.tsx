import { useMemo } from "react";
import { auditCatalog } from "@/lib/catalog/auditCatalog";
import { CURRICULUM_LIBRARY_IDS } from "@/content/curriculum/v1";

export default function CatalogAuditPage() {
  const libraryIds = CURRICULUM_LIBRARY_IDS();
  const report = useMemo(() => auditCatalog(libraryIds), [libraryIds]);

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h2>Catalog Audit (Dev Only)</h2>
      <p style={{ color: "var(--color-text-muted)", marginBottom: 24 }}>
        Library vs LESSON_REGISTRY and content. Missing IDs are intentionally hidden from the Library; direct URLs to those (or empty registry lessons) show a friendly “Coming Soon” page with CTAs and recommended lessons.
      </p>

      <div style={{ marginBottom: 24, padding: 12, border: "1px solid var(--color-border-light)", borderRadius: 8, backgroundColor: "var(--color-surface)" }}>
        <div><strong>Library lesson count:</strong> {report.libraryCount}</div>
        <div><strong>Registry lesson count:</strong> {report.registryCount}</div>
      </div>

      <Section
        title="Lesson IDs missing (not in registry)"
        description="Referenced by Library but not in LESSON_REGISTRY. These are hidden from the Library; direct URL shows the Coming Soon page."
        count={report.missingInRegistry.length}
        items={report.missingInRegistry}
      />
      <Section
        title="Exist but render empty"
        description="In registry but no local content (no blocks, not snapshot-only). Hidden from Library; direct URL shows the Coming Soon page."
        count={report.missingContent.length}
        items={report.missingContent}
      />
      <Section
        title="In registry but not shown in Library"
        description="In LESSON_REGISTRY but not in the curriculum/Library list (orphans)."
        count={report.orphanRegistryLessons.length}
        items={report.orphanRegistryLessons}
      />
      {report.orphanSnapshots.length > 0 && (
        <Section
          title="Orphan snapshots (not in registry)"
          description="Local snapshot files with no registry entry."
          count={report.orphanSnapshots.length}
          items={report.orphanSnapshots}
        />
      )}
    </div>
  );
}

function Section({
  title,
  description,
  count,
  items,
}: {
  title: string;
  description: string;
  count: number;
  items: string[];
}) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ marginBottom: 4, fontSize: "1.1rem" }}>{title}</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginBottom: 8 }}>
        {description}
      </p>
      <p style={{ fontSize: "var(--text-sm)", fontWeight: 600, marginBottom: 6 }}>
        Count: {count}
      </p>
      {items.length === 0 ? (
        <div style={{ opacity: 0.7 }}>None ✅</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {items.map((id) => (
            <li key={id} style={{ fontFamily: "monospace", fontSize: "var(--text-sm)" }}>
              {id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
