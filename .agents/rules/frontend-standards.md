---
trigger: always_on
---

# Frontend & Logic Standards

These rules ensure the Position Size Calculator maintains its premium fintech quality, high performance, and financial accuracy.

## 🎨 Design System & Aesthetics

### 1. Theme Tokens

- **NEVER** use hardcoded hex values for colors.
- **ALWAYS** use the Tailwind v4 custom theme tokens:
  - Colors: `brand-primary`, `brand-secondary`, `accent`, `success`, `danger`, `warning`.
  - Backgrounds: `bg-app-light/dark`, `bg-card-light/dark`, `bg-subtle-light/dark`.
  - Typography: `text-primary-light/dark`, `text-secondary-light/dark`.
- **Fonts**:
  - Use `font-display` (Outfit) for headings and titles.
  - Use `font-body` (Plus Jakarta Sans) for body text and labels.

### 2. Glassmorphism & Containment
- All primary containers must use the `.glass-panel` class.
- **Containment Rule**: Every visual unit (step, feature, settings group) must be **self-contained**. Place labels, icons, and headers **inside** the card container.
- Standard panel structure:
  ```tsx
  <div className="p-1 rounded-3xl bg-linear-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent">
    <div className="p-6 rounded-2xl glass-panel shadow-xl">{/* Content */}</div>
  </div>
  ```

### 3. Responsive Layouts & Mobile UX
- **Fluid Verticality**: Prioritize vertical stacking on mobile. Use `grid-cols-1 lg:grid-cols-N` to defer horizontal layouts to desktop (1024px+).
- **Flex-Flow**: Use `flex-wrap` for variable-width items (tags, presets). Avoid rigid `grid-cols-2` on small screens; use `min-width` (e.g., `min-w-[140px]`) instead.
- **Touch Targets**:
  - Buttons must be `w-full` on mobile.
  - Interactive elements must have a minimum height of `44px`.
  - Use `text-lg` or `text-xl` for inputs on mobile to ensure readability.
- **Adaptive Spacing**: Use explicit visual dividers or increased gaps (`gap-8`) on mobile to separate stacked content.

### 4. Motion & Transitions
- Use `animate-fade-in` for new elements entering the viewport.
- Use staggered delays (`animate-delay-100`, `200`, etc.) for list items or grid sections.
- Ensure all hover states have smooth transitions (`transition-all duration-300`).

## ⚡ React & Performance

### 1. Optimization

- **Memoization**: Wrap all complex calculation logic in `useMemo`. Wrap event handlers passed to children in `useCallback`.
- **Suspense**: Always use `lazy` and `Suspense` for heavy simulator components (e.g., charts, complex tables).

### 2. Internationalization (i18n)

- **Hardcoding text is PROHIBITED**.
- Every string must be retrieved via the `useTranslation` hook: `t("namespace.key")`.
- Numbers must be formatted using the `formatCurrency` or `formatNumber` utilities to ensure localized decimal/thousands separators.

## 📊 Financial Logic

### 1. Calculation Integrity

- Always calculate the **Notional Position Size** based on the formula:
  `Risk Amount (Capital * Risk %) / Stop Loss % (|Entry - SL| / Entry)`.
- Use the central `calculatePositionSize` utility to avoid logic duplication.
- Ensure all calculations handle floating-point precision issues appropriately.

### 2. Validation

- Form inputs must have strict validation (e.g., SL cannot be the same as Entry, Risk % must be > 0).
- Provide immediate visual feedback for invalid states using the `danger` color token.
