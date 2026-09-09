# CSV search (GitHub Pages)

1. Drop your `.csv` files into `data/` (subfolders are fine).
2. Push to `main`.
3. In the repo: Settings → Pages → Source: **GitHub Actions**.

Every push rebuilds `index.json` from whatever is in `data/` and redeploys, so new files are picked up automatically.

Local preview: `node build-index.js && npx serve .`
