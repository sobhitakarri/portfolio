# Sobhita Karri — Portfolio

Robotics & autonomous systems portfolio. Minimal editorial UI with a construction-site loader, full-page scroll flight path, and light/dark theme.

**Live:** [https://sobhitakarri.github.io/portfolio/](https://sobhitakarri.github.io/portfolio/)

Hosting is **GitHub Pages only** (not Vercel).

---

## Stack

| Tool | Role |
|------|------|
| Vite + React 19 | App shell |
| Tailwind CSS | Utilities |
| Framer Motion | Motion / transitions |
| Three.js | Optional elsewhere; loader is SVG |
| EmailJS | Contact form |
| gh-pages | Deploy `dist/` → `gh-pages` branch |

---

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production → /dist (+ 404.html for SPA)
npm run preview   # preview build locally
npm run deploy    # build + push to GitHub Pages
```

---

## Deploy (GitHub Pages)

1. Repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / **`/` (root)** → Save
4. From this repo:

```bash
npm run deploy
```

Site URL: `https://sobhitakarri.github.io/portfolio/`

`vite.config.js` uses `base: '/portfolio/'` for this project site.  
`BrowserRouter` uses `basename={import.meta.env.BASE_URL}`.  
`postbuild` copies `dist/index.html` → `dist/404.html` so client routes work on refresh.

### Custom domain (optional)

1. Add `public/CNAME` with your domain (e.g. `sobhitakarri.dev`)
2. Point DNS (A/CNAME) to GitHub Pages
3. If the site is served from the domain root, set `base: '/'` in `vite.config.js` and redeploy

### Remove an old Vercel deploy

This project is not linked to Vercel in-repo. Delete any leftover project in the [Vercel dashboard](https://vercel.com/dashboard) (Project → Settings → Delete). Point the domain at GitHub Pages if you still use it.

---

## Structure

```
src/
  App.jsx                 # Loader gate + routes + FlightPath
  components/
    Loader.jsx            # Construction-site name build (SVG)
    FlightPath.jsx        # Full-page scroll drone corridor
    Hero.jsx / About.jsx / Domains.jsx / Projects.jsx …
    Navbar.jsx            # Nav + theme toggle
  hooks/
    useTheme.js           # light / dark (localStorage)
    useScrollFade.js
  data/projects.js
  index.css               # Design tokens, type scale, flight + loader styles
```

---

## Theme & design

- Light bone / dark charcoal via `data-theme` + CSS variables
- Type scale: `--fs-display` → `--fs-xs`
- Accent: `#1b32e0` (light) / `#6b7cff` (dark)
- Fonts: Inter Tight + IBM Plex Mono

---

## Contact form (EmailJS)

In `src/components/Contact.jsx` set:

```js
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'
```

Template fields: `from_name`, `from_email`, `message`

---

## Personalise

- [ ] `src/data/projects.js` — projects
- [ ] `public/resume.pdf` — resume
- [ ] `src/components/Contact.jsx` — EmailJS keys
- [ ] Footer / Navbar links — GitHub, LinkedIn, email

---

© Sobhita Karri
