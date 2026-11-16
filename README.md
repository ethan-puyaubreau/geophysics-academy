# Earth Mechanics Academy

A Khan Academy–style study site for geophysical mechanics and dynamics: short lessons, interactive models, leveled practice problems (Concept → Apply → Extend) and an exam/interview drill.

Open `index.html` in a browser (or serve the folder, e.g. `python3 -m http.server`). Content lives in `content/*.js`, one file per module; the app engine is `app.js`. Progress is stored in the browser's localStorage.

Modules: Foundations · Continuum Mechanics · Ocean Waves & Tides · Glaciers & Ice Sheets · Crustal Deformation · Earthquake & Volcano Deformation (from Segall 2010, Ch. 1–12) · Heat & Mantle Dynamics · Seismology · Physical Volcanology · Synthesis.

Practice problems and solutions are original; they are written around course concepts rather than copied from course handouts or solutions.

## Deployment (GitHub Pages)

Every push to `main` runs `.github/workflows/pages.yml`, which syntax-checks the JavaScript, runs `scripts/build-pages.sh` (wraps `index.html` in a full HTML document and copies the assets into `_site/`), and deploys `_site/` to GitHub Pages.

One-time setup: in the repository on GitHub, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. The site is then published at `https://ethan-puyaubreau.github.io/geophysics-academy/`.

To preview the deployed build locally: `./scripts/build-pages.sh && python3 -m http.server -d _site`.
