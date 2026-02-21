# Design reference for Cursor

Use this folder so Cursor can match the Figma Make output. **Reference files here in chat with `@design/` when asking for implementation.**

---

## What to put here

| Item | Where | Notes |
|------|--------|--------|
| **PRD** | `design/PRD.md` (or paste into this README below) | Product requirements, user stories, acceptance criteria |
| **Figma / website link** | Paste link below | For your reference; Cursor cannot open URLs. Use screenshots in `mocks/` for implementation. |
| **Screen mocks** | `design/mocks/*.png` | Export key screens from Figma (desktop + mobile). Name clearly: `home.png`, `nav-dropdown-open.png`, etc. |
| **Interactions & animations** | `design/interactions.md` | Nav dropdowns, animations, transitions—see template there. |

---

## Option: Import live site into Figma (editable reference)

If you want **editable frames inside Figma** that Cursor can align to (structure + layout, not just flat images):

1. **Plugin:** [html.to.design](https://www.figma.com/community/plugin/1159123024924461424) – imports a snapshot of the rendered site as layers in Figma (vectorized), not a single flat image.
2. **Steps:**
   - Install **html.to.design** in Figma.
   - Open your published Figma Make preview in a browser.
   - In Figma, run the plugin → paste the URL.
   - It creates a vectorized design frame in Figma with structure and layout.
3. **Why:** Gives Cursor (and you) editable reference frames for layout/structure; you can then export key frames to `design/mocks/` or keep them in Figma for spec.

---

## Links (paste here)

- **Figma Make / prototype:**  https://wager-viral-64361920.figma.site/
- **Live website (if any):**  

---

## PRD

*(Paste your full PRD below, or keep it in `design/PRD.md` and add a one-line note here: "See design/PRD.md".)*
See design/PRD.md
