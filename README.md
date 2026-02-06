
# NBIS Book Club ![Deploy to GitHub Pages](https://github.com/NBISweden/book-club/actions/workflows/deploy.yml/badge.svg)

A VitePress site to display the NBIS Book Club collection.

## Setup

1.  **Node Version**: Ensure you are using the `nodejs-24` conda environment or a compatible Node.js version (v18+).

```bash
conda activate nodejs-24
```

2.  **Install Dependencies**:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run docs:dev
```

This will start the server at `http://localhost:5173`.

## Data Fetching

The text used to populate the site is fetched from a Google Sheet.
**Note**: The Google Sheet must be openly accessible via link. currently the script uses a mock fallback if the fetch fails (returns 401).

To update the data:
```bash
npm run fetch-data
```

The script `scripts/fetch-books.js` handles fetching the CSV export and converting it to `docs/public/books.json`.

## Deployment

To build the static site:

```bash
npm run docs:build
```

The output will be in `docs/.vitepress/dist`.
This directory can be deployed to GitHub Pages.

## Project Structure

- `docs/`: Markdown content and VitePress config.
- `docs/.vitepress/theme/BookGallery.vue`: The main component displaying the book grid.
- `docs/.vitepress/config.mjs`: Site configuration.
- `scripts/fetch-books.js`: Data fetching script.
