
# :books: NBIS Book Club

![Docker](https://github.com/NBISweden/book-club/workflows/docker/badge.svg) ![Vitepress](https://github.com/NBISweden/book-club/workflows/vitepress/badge.svg)

A VitePress site to display the NBIS Book Club collection.

## User guide

See the [About page](https://nbisweden.github.io/book-club/about.html) for information on how to use the Book Club.

## Developer Guide

### How everything works

The site is built using VitePress, which serves the static content and fetches book data from a JSON file generated from a Google Sheet. The data fetching is handled by a Node.js script that runs as part of the build process. A Dockerfile is used to create a Docker container built by GitHub Actions and pushed to GitHub Container Registry. This container is then used by GitHub Actions to build and deploy the static site to GitHub Pages.

The website is rebuilt and redeployed every 24 hours to ensure the content is up to date with respect to the Google Sheet, but you can also trigger a manual rebuild from the GitHub Actions tab.

### Setup

1.  **Node Version**: Ensure you are in an environment with Node.js version (v18+).
2.  **Install Dependencies**:

```bash
npm install
```

3. Define the `GOOGLE_SHEET_ID` variable as an environment variable or in a `.env` file for local development. This should be the ID of the Google Sheet containing the book data. The Google sheet must have open access for anyone with the link to read the data.

The Google Sheet has the following fields:

- Title
- Author
- ISBN
- Language
- Notes
- Owner
- Location
- Borrowed

4. Start the development server:

```bash
npm run docs:dev
```

This will fetch the data and start the server at `http://localhost:5173`.

To only fetch the data:

```bash
npm run fetch-data
```

The script `scripts/fetch-books.js` handles fetching the CSV export and converting it to `docs/public/books.json`.

To build the static site:

```bash
npm run docs:build
```

The output will be in `docs/.vitepress/dist`.

### Project Structure

- `docs/`: Markdown content and VitePress config.
- `docs/.vitepress/theme/BookGallery.vue`: The main component displaying the book grid.
- `docs/.vitepress/config.mjs`: Site configuration.
- `scripts/fetch-books.js`: Data fetching script.

---

2026 • NBIS