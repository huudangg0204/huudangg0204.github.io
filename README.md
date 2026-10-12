# Retro Pixel CV / Portfolio Template

A responsive React + Vite portfolio template with an 8-bit quest theme. Personalize the data and media, then deploy it automatically to GitHub Pages.

## Features

- Retro single-page portfolio with skills, projects, contact section, and 8-bit sound effects.
- Project modal with image gallery (arrows, dots, touch swipe) and optional demo video.
- Automatic media discovery from `public/assets/projects/<project-id>/` during development and production builds.
- GitHub Actions deployment on every push to `main`.

## Personalize the Template

| Content | Location |
| --- | --- |
| Profile, education, links, CV path, hobbies | `src/data/profile.json` |
| Project copy, stack, metrics, repository URL | `src/data/projects.json` |
| Avatar and CV | `public/assets/avatar/`, `public/assets/cv/` |
| Project screenshots and demo videos | `public/assets/projects/<project-id>/` |

### Add project media

The folder name must exactly match the project `id` in `src/data/projects.json`.

```text
public/assets/projects/video-retrieval/
├── preview.png
├── gallery-01.png
├── gallery-02.webp
└── demo.mp4
```

- Every `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, and `.avif` image becomes part of the gallery.
- `preview.*` is shown first. Name other images `gallery-01`, `gallery-02`, and so on to control their order.
- The first `.mp4`, `.webm`, or `.ogv` file becomes the demo video.
- Image-only and video-only projects are both supported.
- Restart `pnpm dev` after changing media locally; a GitHub build automatically rescans media on every push.

## Run Locally

Requires Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173/](http://localhost:5173/).

| Command | Description |
| --- | --- |
| `pnpm dev` | Generate media manifest and run the local server |
| `pnpm build` | Generate media manifest and build `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm deploy` | Optional manual `gh-pages`-branch deployment |

## Deploy to GitHub Pages

This repository is configured as a GitHub **user site**. Create a public repository named exactly:

```text
huudangg0204.github.io
```

The live site will be available at:

```text
https://huudangg0204.github.io/
```

`vite.config.js` uses `base: '/'` for this user-site URL. If you use this template under another account, rename the repository to `<your-username>.github.io` and keep `base: '/'`.

### First deployment

1. On GitHub, create a public repository called `huudangg0204.github.io`. Do not create a README, `.gitignore`, or license through the GitHub form.

2. In this project directory, initialize Git and push the first commit. This workspace contains an empty invalid `.git` directory, so remove it first only if `git status` reports that this folder is not a repository.

   ```bash
   rmdir .git
   git init -b main
   git add .
   git commit -m "feat: launch retro pixel CV template"
   git remote add origin https://github.com/huudangg0204/huudangg0204.github.io.git
   git push -u origin main
   ```

3. On GitHub, open the new repository's **Settings** → **Pages**. Under **Build and deployment**, choose **GitHub Actions** as the source.

4. Open the **Actions** tab and wait for `Deploy Portfolio to GitHub Pages` to succeed. The workflow at `.github/workflows/deploy.yml` builds the app and publishes `dist/`.

5. Open `https://huudangg0204.github.io/`. The first deployment can take a few minutes.

### Publish later updates

Every push to `main` redeploys automatically:

```bash
git add .
git commit -m "feat: update portfolio content"
git push
```

Do not commit `node_modules/`, `dist/`, `.env`, or credentials. The included `.gitignore` already excludes them.

## Link from Your GitHub Profile

Keep the `huudangg0204` repository for your profile README. Add:

```md
🌐 Portfolio: [huudangg0204.github.io](https://huudangg0204.github.io/)
```

You can also add this URL in the Website field of your GitHub profile.

## Structure

```text
src/components/       Portfolio sections and project modal
src/data/             Profile and project content
public/assets/        Avatar, CV, and project media
scripts/              Build-time media manifest generator
.github/workflows/    GitHub Pages deployment workflow
```

## Why builds are required after adding media

GitHub Pages is static hosting. The media scanner therefore runs during `pnpm dev` and `pnpm build`; it cannot discover a newly added local file in a site that has already been deployed. The GitHub Actions workflow runs `pnpm build` for every push, so adding media and pushing is enough. See [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) and [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy.html#github-pages).
