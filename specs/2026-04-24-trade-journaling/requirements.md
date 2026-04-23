# 📊 Trade Journaling Requirements

## Scope
Implementation of a robust, local-first trade journaling system that allows users to record, track, and analyze their trading performance directly within the application.

## User Stories
- **As a trader**, I want to save my calculated position as a journal entry so I can track my plan vs. execution.
- **As a trader**, I want to review my past trades in a clean, filtered list to identify patterns.
- **As a trader**, I want to see basic performance metrics (Win Rate, Total PnL) to track my progress.

## Data Model (Journal Entry)
```typescript
interface JournalEntry {
  id: string;
  date: string; // ISO format
  pair: string; // e.g., "BTC/USDT"
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number; // Optional if open
  stopLoss: number;
  takeProfit?: number;
  positionSize: number;
  pnl?: number; // Calculated: (Exit - Entry) * Size for longs
  pnlPercentage?: number;
  strategy: string; // Tags or free text
  sentiment: 'positive' | 'neutral' | 'negative';
  status: 'open' | 'closed';
  notes: string;
}
```

## Functional Requirements
1.  **CRUD Operations**:
    *   Create: Add a new entry (manual or from calculator).
    *   Read: List all entries with pagination/infinite scroll.
    *   Update: Mark as closed (add exit price), edit notes.
    *   Delete: Remove entry with confirmation.
2.  **Filtering & Sorting**:
    *   Filter by Status (Open/Closed).
    *   Filter by Date Range.
    *   Sort by Date (Newest/Oldest) or PnL.
3.  **Analytics Dashboard**:
    *   Total Net PnL (Currency & %).
    *   Win Rate percentage.
    *   Average R:R realized.

## Design Constraints
- **Glassmorphism**: Use the `.glass-panel` style for all journal containers.
- **Responsive**: Mobile-first vertical stacking for the trade list.
- **Performance**: Use memoized selectors for analytics to ensure zero lag during filtering.
