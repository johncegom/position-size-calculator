---
description: Stage, commit, and push changes to GitHub
---

Follow these steps to safely push your current work to GitHub:

1. **Check Status**: Run `git status` to review which files have been modified.
2. **Stage Changes**:
   - To stage everything: `git add .`
   - To stage specific files: `git add <file_path>`
3. **Commit**:
   - Propose a clear, concise commit message following Conventional Commits (e.g., `feat: ...`, `fix: ...`, `chore: ...`).
   - Run `git commit -m "<your_message>"`
     // turbo
4. **Push**: Run `git push` to upload your commit to the remote repository.
5. **Verify**: Run `git status` again to ensure your branch is up to date with 'origin/main'.
