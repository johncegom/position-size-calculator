---
description: Lifecycle hooks for quality assurance and verification
---

# 🤖 Agent Quality Assurance Hooks

To maintain high code standards and system stability, follow these lifecycle hooks after every significant task completion.

### 🕒 Trigger Condition

- Any modification to functional code in `src/`.
- Changes to configuration files (`vite.config.ts`, `tailwind.config.js`, etc.).
- Updates to dependencies in `package.json`.
- _Note: Simple documentation or locale updates (JSON/MD) may skip this at your discretion unless they are complex._

### 🛠️ Post-Completion Protocol

1. **System Health Check (Interactive):**
   Before providing the final response to the user, you **MUST** ask:

   > "I have completed the changes. Should I run the test suite and check for lint errors to verify everything is working as expected?"

2. **Execution (Upon Approval):**
   If the user approves (`yes`/`y`/etc.), execute the following:
   - **Testing:** `npm test -- --run` (verify logic hasn't regressed).
   - **Coverage (Optional):** If the changes were to core utilities, suggest `npm run coverage`.

3. **Reporting & Remediation:**
   - **Success:** Report a summary of passed tests and clean lint status using a concise markdown table or code block.
   - **Failure:**
     - DO NOT just report the error.
     - Analyze the failure immediately.
     - Proactively ask: "The tests failed at [X]. Would you like me to analyze and fix the root cause now?"

### 📝 Guidelines for the Agent

- **Be Proactive but Respectful**: Always ask before running heavy commands.
- **Context Matters**: If you've only fixed a typo in a string, a full test suite might be overkill. Mention why you think a test might OR might not be necessary.
- **No Infinite Loops**: If a fix for a test fail causes another failure, stop and consult the user after the second attempt.
