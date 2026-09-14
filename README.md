# SnippetHub Docs & Support Portal (Docs-as-Code)

This folder contains the official documentation and support portal for **SnippetHub**, powered by **Astro + Starlight** and **Sveltia CMS**, deployed to **GitHub Pages**.

## Key Features

- 📖 **Docs-as-Code**: All articles are standard Markdown files stored in `src/content/docs/`.
- ⚡ **Astro + Starlight**: Lightning-fast static site generation with built-in dark/light mode and mobile-responsive layout.
- 🔍 **Instant Search**: Client-side full-text search powered by Pagefind (zero server or API key required).
- ✍️ **Sveltia CMS Admin**: Built-in Git-backed headless CMS interface located at `/admin/` for visual editing and media uploads.
- 🚀 **GitHub Pages Deployment**: Automated continuous deployment via GitHub Actions on push to `main`.

---

## Local Development

### 1. Install Dependencies
```bash
cd snippethub-docs
npm install
```
*(Or from repository root: `npm run docs:dev`)*

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) to view the documentation site.

### 3. Build for Production
```bash
npm run build
```
This generates the static site in `snippethub-docs/dist/` and compiles the Pagefind search indexes.

---

## Using Sveltia CMS

Sveltia CMS provides a visual editing environment for managing documentation articles without needing to edit Markdown directly.

### Accessing the CMS Admin
- **Production (GitHub Pages)**: `https://tmj51578.github.io/snippethub/admin/`
- **Local Dev Server**: `http://localhost:4321/admin/`

### Signing In with GitHub Token (Zero Infrastructure)
1. Navigate to `/admin/` in your browser.
2. Click **Sign In with Token**.
3. Generate a GitHub Personal Access Token (PAT) with `repo` scope (or fine-grained token with Contents read/write permissions for `tmj51578/snippethub`).
4. Paste the token into Sveltia CMS. The token is stored locally in your browser and used to read and write directly to the `main` branch.

### Adding & Editing Articles
- When you save or publish changes in Sveltia CMS, it automatically creates a Git commit and pushes to the repository.
- GitHub Actions detects the commit and re-deploys the documentation site to GitHub Pages in ~30 seconds.

---

## Deploying to GitHub Pages

The automated deployment is handled by `.github/workflows/deploy-docs.yml`.

To enable GitHub Pages in your repository settings:
1. Go to **Settings &rarr; Pages** in `tmj51578/snippethub`.
2. Under **Build and deployment &rarr; Source**, select **GitHub Actions**.
3. Any push or CMS edit to `main` touching `snippethub-docs/` will automatically build and publish the live site.

