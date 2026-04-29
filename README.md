# Conference Deadlines GitHub Page

This is a static AI-Deadlines-style conference tracker for GitHub Pages.

## Files

- `index.html`: webpage structure
- `style.css`: visual styling
- `script.js`: sorting, filtering, countdown logic
- `conferences.json`: conference data

## How to use with GitHub Pages

1. Create a new public GitHub repository, for example `conference-deadlines`.
2. Upload all files from this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.

Your site should appear at:

`https://YOUR-USERNAME.github.io/conference-deadlines/`

## Updating conferences

Edit `conferences.json`.

Example entry:

```json
{
  "name": "NeurIPS",
  "area": "ML",
  "deadline": "2026-05-15T23:59:00",
  "timezone": "AoE",
  "location": "TBD",
  "link": "https://neurips.cc",
  "tags": ["ML", "AI"]
}
```

To add a new conference, copy one entry, paste it, and change the values.

For deadlines that are not yet announced, use:

```json
{
  "name": "RLDM",
  "area": "RL",
  "deadline": null,
  "status": "not_announced",
  "timezone": "",
  "location": "TBD",
  "link": "https://rldm.org",
  "tags": ["RL"]
}
```
