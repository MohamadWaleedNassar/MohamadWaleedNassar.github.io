# Mohamad Waleed Nassar: portfolio

Static site (HTML, CSS, JavaScript). No build step, no install.

## Files
- `index.html`: page structure
- `styles.css`: design (dark "solder mask" theme and light "service manual" theme)
- `data.js`: **all content**: edit text, numbers, projects and links here
- `main.js`: animations and interactions
- `assets/`: portrait, favicon and CV PDF (replace the PDF with your newest export, keep the file name)
- `.nojekyll`: tells GitHub Pages to serve the files as they are

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server 8000` in this folder and visit http://localhost:8000

## Host on GitHub Pages
1. Create a **public** repository named `MohamadWaleedNassar.github.io` on GitHub (your username, then `.github.io`).
2. Upload the **contents** of this folder (not the folder itself) to the repository root: `index.html`, `styles.css`, `data.js`, `main.js`, `.nojekyll` and the `assets` folder.
3. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, then Save.
4. Wait one to two minutes. Your site is live at `https://mohamadwaleednassar.github.io`.
