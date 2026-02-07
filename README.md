
# NBIS Book Club ![](docs/.vitepress/public/favicon-96x96.png)

![GitHub Pages](https://github.com/NBISweden/book-club/actions/workflows/deploy.yml/badge.svg) ![Docker Build](https://github.com/NBISweden/book-club/actions/workflows/docker-build-push.yml/badge.svg)

A VitePress site to display the NBIS Book Club collection.

## Setup

1.  **Node Version**: Ensure you are in an environment with Node.js version (v18+).
2.  **Install Dependencies**:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run docs:dev
```

This will fetch the data and start the server at `http://localhost:5173`.

## Data Fetching

To only fetch the data:

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
