# Responsive Design Principles

## Core Philosophy: "Fluid Verticality"

**On mobile, vertical space is infinite; horizontal space is expensive.**

When designing for this project, prioritize scrolling over squeezing. Elements that sit side-by-side on desktop must stack vertically on mobile to maintain readability and touch-friendliness.

---

## The 5 Design Pillars

### 1. The "Deferred Desktop" Rule (Breakpoint Discipline)

**Problem:** The standard `md` (768px) breakpoint is often too tight for complex dashboards, especially when sidebars are present.
**Rule:**

- **Mobile (< 768px):** Strictly vertical stack.
- **Tablet (768px - 1024px):** Continued vertical stack or "Wide Mobile" layout. Do **not** force 3/4-column grids here.
- **Desktop (> 1024px / `lg`):** Only switch to full horizontal/side-by-side layouts here.
- **Pattern:** Use `grid-cols-1 lg:grid-cols-3` instead of `grid-cols-1 md:grid-cols-3`.

### 2. Containment First

**Problem:** Elements relying on external whitespace for grouping often "float" away or overlap on small screens.
**Rule:**

- Visual units (steps, features, settings groups) must be **self-contained**.
- Place labels, icons, and headers **inside** the card container.
- Never place a label _outside_ a card that it belongs to (e.g., "Step 1" should be inside the Step 1 card).

### 3. Flex-Flow Over Grid Rigidity

**Problem:** Fixed grids (`grid-cols-2`) cause buttons/tags to squash or overflow text on narrow screens.
**Rule:**

- Use **`flex-wrap`** for lists of items with variable widths (tags, filters, preset buttons).
- Allow items to flow naturally to the next line.
- Set `min-width` on flex items (e.g., `min-w-[140px]`) to ensure they never become unclickable slivers.

### 4. Touch-First Targets

**Problem:** Desktop-sized clicks are too small for thumbs.
**Rule:**

- **Buttons:** Expand to `w-full` on mobile. Small "Save" buttons are hard to hit.
- **Inputs:** Use larger text size (`text-lg` or `text-2xl`) to prevent squinting.
- **Height:** Ensure interactive elements have sufficient height/padding (min 44px).

### 5. Adaptive Spacing & Separators

**Problem:** Stacked content can bleed together, making it hard to distinguish sections.
**Rule:**

- Use explicit **visual dividers** (lines, background colors) on mobile where whitespace alone isn't enough.
- Increase vertical gaps (`gap-6` -> `gap-8`) on mobile to compensate for the lack of horizontal separation.
- **Footer Strategy:** Remove side padding (`px-4`) to maximize width, but increase vertical spacing.

---

## Checklist for New Features

Before merging a UI change:

- [ ] Does it stack vertically on Mobile?
- [ ] Does it remain stacked/comfortable on Tablet (`md`)?
- [ ] Are buttons full-width or flex-wrapped?
- [ ] Is there enough padding (`p-4`+) around edges?
- [ ] Is it readable at 320px width (iPhone SE)?
