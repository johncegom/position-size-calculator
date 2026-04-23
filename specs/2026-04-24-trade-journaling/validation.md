# ✅ Validation Plan - Trade Journaling

## Automated Tests
- **[ ]** `journalSlice.test.ts`: Verify CRUD logic (add, update status, delete).
- **[ ]** `journalSelectors.test.ts`: Verify math for Win Rate and PnL calculations.
- **[ ]** Component snapshot/unit tests for `JournalEntryForm`.

## Manual Verification
1.  **Entry Flow**: Open Calculator -> Calculate -> Click "Save to Journal" -> Check if it appears in the list.
2.  **Persistence**: Add 3 trades -> Refresh Page -> Verify trades are still there.
3.  **Closing Trade**: Edit an "Open" trade -> Add Exit Price -> Verify it moves to "Closed" and PnL is updated.
4.  **Filtering**: Filter for "Closed" only -> Ensure "Open" trades are hidden.
5.  **Mobile UX**: Verify the trade list stacks correctly on mobile and buttons are easy to tap (min 44px).

## Success Criteria
- [ ] No Redux state hydration errors on refresh.
- [ ] PnL math matches manual calculation 100%.
- [ ] All UI elements adhere to the `.glass-panel` and Tailwind v4 token standards.
