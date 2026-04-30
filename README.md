# Conference Deadlines GitHub Page

This is a static AI-Deadlines-style conference tracker for GitHub Pages.

## Focus

This version tracks **main-track conference paper submission deadlines**, not conference dates.

It also includes a `core_rank` field and a CORE filter:

- `A*`
- `A`
- `B`
- `unknown`

## Important correction

ICML 2026 is set to the official **main-track full paper submission deadline**:

`2026-01-28T23:59:00-12:00`

Since this has passed, the site will show ICML as tracking the 2027 edition with the deadline pending, unless you later enter a confirmed `next_deadline`.

## How passed deadlines work

If a deadline has passed:

1. If `next_deadline` is filled in, the card tracks the next edition.
2. If `next_deadline` is `null`, the card shows the next edition as pending.
3. The card remains visible under "Actionable" because it is still useful for monitoring the next cycle.

## Deploy on GitHub Pages

1. Upload all files to the root of your GitHub repository.
2. Go to **Settings → Pages**.
3. Choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ root`
4. Save.

Your site should be available at:

`https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`
