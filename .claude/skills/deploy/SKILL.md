---
name: deploy
description: Deploy Golden Tier Peptide to production. Runs TypeScript check, builds, commits changes, merges to main, and pushes to trigger GitHub Actions deployment to golden-tier.online.
disable-model-invocation: true
argument-hint: "[optional commit message]"
allowed-tools: Bash
---

# Deploy to Production — Golden Tier Peptide

Deploy the current branch to production at `https://golden-tier.online`.

## Deployment Info
- **Worktree:** `C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision\.claude\worktrees\hardcore-murdock`
- **Main repo:** `C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision`
- **Branch:** `claude/hardcore-murdock` → merge to `main`
- **CI/CD:** GitHub Actions auto-deploys on push to `main` via rsync to VPS

## Steps

### 1. TypeScript check (in worktree)
```bash
cd "C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision\.claude\worktrees\hardcore-murdock"
npx tsc --noEmit
```
Stop and report errors if TypeScript check fails.

### 2. Production build (in worktree)
```bash
npm run build
```
Stop and report errors if build fails.

### 3. Stage and commit (in worktree)
```bash
git add -A
git status
```
Show the user what files changed, then commit with the message provided in $ARGUMENTS (or generate a descriptive one from the changes if no argument given).

```bash
git commit -m "$(cat <<'EOF'
$ARGUMENTS

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

If no $ARGUMENTS provided, summarize the staged changes and write an appropriate commit message.

### 4. Push feature branch
```bash
git push origin claude/hardcore-murdock
```

### 5. Merge to main (must run from main repo, NOT the worktree)
```bash
cd "C:\Users\USER\.gemini\antigravity\scratch\Golden-tier-peptide revision"
git fetch origin
git checkout main
git pull origin main
git merge claude/hardcore-murdock --no-ff -m "Merge branch 'claude/hardcore-murdock'"
git push origin main
```

### 6. Confirm deployment triggered
```bash
echo "✅ Pushed to main. GitHub Actions will now build and deploy to golden-tier.online"
echo "Monitor at: https://github.com/Sekaiyorush/Golden-tier-peptide-beta/actions"
```

## Notes
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Build takes ~30s, total deploy ~1min
- If merge fails due to conflicts, resolve them and try again
- After deploy, verify prices/features at https://golden-tier.online
