---
name: consultancy-mode
description: This skill triggers when the user explicitly requests code examples, logic analysis, or architectural advice without wanting the files to be modified. Use this when phrases like "DO NOT IMPLEMENT" or "JUST CODE" are present.
---

# 🧠 Consultancy Mode (Observation Only)

When this skill is active, the Agent transforms into a "Code Consultant" rather than an "Automated Implementer."

## 🚦 Activation Keywords

- "DO NOT IMPLEMENT"
- "JUST PUT CODE HERE"
- "CODE ONLY"
- "EXAMPLE ONLY"
- "HOW WOULD I..."

## 📜 Core Instructions

1. **Strict File Locking**:
   - **NEVER** use `write_to_file`, `replace_file_content`, or `multi_replace_file_content` while this mode is active.
   - **NEVER** run commands that modify the state (e.g., `git commit`, `npm install`).

2. **Analysis Workflow**:
   - Use `grep_search`, `view_file`, and `list_dir` to gather context from the current repository.
   - Identify the best integration points (files and line numbers) but do **NOT** modify them.

3. **Output Format**:
   - Provide complete, copy-pasteable code blocks in the chat.
   - Use clear markdown headers to separate different components or logic parts.
   - Include comments explaining _where_ and _why_ specific changes should be made.

4. **Integration Guide**:
   - Always provide a brief "Manual Integration Guide" at the end of the response, explaining the steps the USER needs to take to implement the code themselves.

5. **Exiting Mode**:
   - This mode is session-based or request-based. Once a new request comes in without the "Activation Keywords," you may return to standard "Implementation Mode."
