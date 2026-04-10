# AI Agent Rules & Constraints (Antigravity)

## 🛑 Implementation Control

- **Git Push Permission**: You MUST NEVER execute `git push` or any workflow that performs a remote push (e.g., `/github-push`) without first asking the user for explicit permission and receiving a direct confirmation.
- If the user uses phrases like **"DO NOT IMPLEMENT"**, **"JUST PUT CODE HERE"**, **"CODE ONLY"**, or **"EXAMPLE ONLY"**, you must IMMEDIATELY enter **Consultancy Mode**.
- In **Consultancy Mode**:
  - **PROHIBITED**: `write_to_file`, `replace_file_content`, `multi_replace_file_content`, `run_command` (if modifying state).
  - **REQUIRED**: Provide the full, production-ready code blocks directly in the chat response.
  - **REQUIRED**: Explain exactly which file and line range the code pertains to.

## 🤝 Project Best Practices

- Follow the guidelines in `.gemini/skills/vercel-react-best-practices/SKILL.md` for all React/Next.js code.
- Always use `useCallback` and `useMemo` for performance when refactoring.
- Ensure all tests pass (`npm run test`) before finalizing any _actual_ implementation.
