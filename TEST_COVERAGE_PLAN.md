# Test Coverage Improvement Plan

Based on the recent coverage report, our current test coverage is **7.62%**. While the core engine (`calculations.ts`) is well-tested (**96.82%**), most utility functions and nearly all UI components lack test coverage.

## Phase 1: Closing Utility Gaps (High Priority)

The objective is to ensure the "brain" of the app is 100% reliable before focusing on the UI.

- [x] **`calculations.ts` (Target: 100%)**
  - Add test cases for lines 182-185 (Edge case: Validating if the calculated TP price is in the correct direction relative to entry).
- [x] **`formatters.ts` (Target: >90%)**
  - Add tests for `formatToTwoDecimals`, `formatToEightDecimals`, and `convertToDecimal`.
  - Cover edge cases: null/undefined inputs, very small numbers, and zero.
- [x] **`utils.ts` (Target: >80%)**
  - Test `saveToLocalStorage` and `getFromLocalStorage` (mocking `window.localStorage`).
  - Test `processFormValues` logic.

## Phase 2: State Management & Logic

Testing the Redux logic and custom hooks to bridge the gap between utils and components.

- [x] **`calculatorSlice.ts`**
  - Test initial state.
  - Test `updateTradeParameter` and `calculatePosition` reducers.
  - Verify state updates correctly after complex calculation triggers.
  - **Task 19 sync**: [x] Test two-way synchronization between `expectedRR` and `takeProfitPrice`.
- [x] **`useCalculator.ts`**
  - Add unit tests for the custom hook using `@testing-library/react-hooks`.

## Phase 3: Component Testing (Stateless & Small)

Start with components that have less external dependency.

- [x] **`ResultDisplay.tsx`**
  - Verify that values from Redux state are displayed correctly.
  - Test "Empty State" (no results message).
- [x] **`LanguageSwitch.tsx`**
  - Test language change triggers.
  - Verify active state styling.
- [x] **`RiskRewardVisual.tsx`**
  - Test bar width calculations based on input values.
  - Verify color coding for different RR ratios.
  - **Task 19 highlight**: [x] Verify that the user's expected R/R and TP price are visually called out.
- [x] **`RiskRewardSimulator.tsx`**
  - Test scenario generation for 1:1, 1:2, 1:3. [x]
  - **Task 19 simulation**: [x] Verify that the user's custom R/R is added and highlighted in the list.

## Phase 4: Interactive Component Testing (Complex)

Testing components with heavy user interaction and side effects.

- [ ] **`Header.tsx`**
  - Test theme toggle (Dark/Light mode switch).
  - Test Settings Modal visibility and close behavior.
  - Verify that settings form fields pre-fill from LocalStorage/Redux.
- [ ] **`CalculatorForm.tsx`**
  - Test input validation (numeric only, no negatives).
  - Test "Risk Mode" toggle (Percentage vs. Value).
  - Verify that "Calculate" button dispatches the correct Redux action.
  - **Task 19 input**: Test the `expectedRR` field and its automated impact on the `takeProfitPrice` field.

## Phase 5: Integration & Quality Assurance

- [ ] **I18n Testing**
  - Verify that translating the app doesn't break layout or numeric formatting.
- [ ] **Theme Persistence**
  - Add a test to verify that the theme (`dark` class on `html`) persists after a page reload.

---

### Tools to Use:

- **Vitest:** Current test runner.
- **React Testing Library:** For component and hook testing.
- **Mock Service Worker (MSW) / Mocks:** For any API or complex browser behavior mocking.
