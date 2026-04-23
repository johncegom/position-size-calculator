# 🗺️ Trade Journaling Implementation Plan

## Phase 1: Data Architecture
1.  **[ ]** Create `journalSlice.ts` in Redux store.
2.  **[ ]** Define initial state and types for `JournalEntry`.
3.  **[ ]** Implement basic reducers: `addEntry`, `updateEntry`, `deleteEntry`, `clearJournal`.
4.  **[ ]** Update `rootReducer` and persistence config to include the journal.

## Phase 2: Core UI Components
1.  **[ ]** Build `JournalEntryForm`:
    *   Responsive modal or side panel.
    *   Form validation matching the position size logic.
2.  **[ ]** Build `JournalList`:
    *   Glass-panel cards for each trade.
    *   Status badges (Open/Closed).
    *   Responsive vertical layout for mobile.
3.  **[ ]** Build `JournalFilters`:
    *   Status toggles and date sorting.

## Phase 3: Analytics & Logic
1.  **[ ]** Create `journalSelectors.ts`:
    *   `selectWinRate`
    *   `selectTotalPnL`
    *   `selectFilteredEntries`
2.  **[ ]** Build `AnalyticsHeader`:
    *   Premium "Fintech" style stats display at the top of the journal.

## Phase 4: Integration
1.  **[ ]** Add "Save to Journal" button in `ResultDisplay`.
2.  **[ ]** Create a dedicated `JournalPage` or tab in the main layout.
3.  **[ ]** Final responsive polish and animations (staggered list entry).
