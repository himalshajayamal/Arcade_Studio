# Deployment

## GitHub Pages

1. Push the `game-arcade` folder contents to the repository root.
2. Enable GitHub Pages for the repository.
3. The workflow in `.github/workflows/deploy.yml` uploads the static site artifact.

## Local file mode

Open `index.html` directly from your file browser. The arcade avoids runtime `fetch()` so this works under `file://`.
