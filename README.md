# Conference Deadlines GitHub Page

This is a static AI-Deadlines-style conference tracker for GitHub Pages.

## What changed in this version

This version automatically handles passed deadlines.

If a conference deadline has passed:

1. If `next_deadline` is available, the card tracks the next edition.
2. If `next_deadline` is not available, the card displays the next edition as pending.
3. The card is not simply treated as obsolete.

## Files

- `index.html`: webpage structure
- `style.css`: visual styling
- `script.js`: sorting, filtering, countdown logic
- `conferences.json`: conference data

## How to update a conference when next year's deadline becomes available

Edit `conferences.json`.

Example:

```json
{
  "name": "AAAI",
  "edition": "2026",
  "deadline": "2025-08-08T23:59:00-12:00",
  "next_edition": "2027",
  "next_deadline": null
}
```

When the 2027 deadline is announced, change only `next_deadline`:

```json
{
  "name": "AAAI",
  "edition": "2026",
  "deadline": "2025-08-08T23:59:00-12:00",
  "next_edition": "2027",
  "next_deadline": "2026-08-02T23:59:00-12:00"
}
```

After the 2027 deadline passes, you can roll the entry forward manually:

```json
{
  "name": "AAAI",
  "edition": "2027",
  "deadline": "2026-08-02T23:59:00-12:00",
  "next_edition": "2028",
  "next_deadline": null
}
```

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
