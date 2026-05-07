# SONNB — RTL Engineer Portfolio

> A cinematic, transistor-level-aesthetic portfolio for an RTL / FPGA / Verification engineer.
> Built with **Vite + React + Tailwind CSS + Framer Motion**.

---

## ⚡ Live Preview

Run locally: `npm run dev` → `http://localhost:5173`

---

## 🗂 Project Structure

```
portfolioSA/
├── public/                        # Static assets served at root
│   ├── favicon.svg                # Chip-shaped IC SVG favicon
│   ├── resume.pdf                 # Embedded + downloadable resume
│   ├── hero-pcb-traces.svg        # PCB trace decoration for hero section
│   └── 404-chip.svg               # 404 error page chip graphic
│
├── src/
│   ├── main.jsx                   # React entry point
│   ├── App.jsx                    # Root — loader gate + section assembly
│   ├── index.css                  # Global styles (PCB grid, scanlines,
│   │                              #   IC card decorators, scrollbar,
│   │                              #   terminal inputs, glitch text)
│   │
│   ├── components/                # Page-level section components
│   │   ├── Loader.jsx             # ★ Cinematic 4-phase intro animation
│   │   ├── Navbar.jsx             # Sticky nav — chip-label logo + resume btn
│   │   ├── Hero.jsx               # Glitch name + typewriter tagline + CTAs
│   │   ├── About.jsx              # Bio + component datasheet stats card
│   │   ├── SkillsMatrix.jsx       # 4-tab skills with animated proficiency bars
│   │   ├── Projects.jsx           # Filter tabs + project card grid
│   │   ├── ProjectCard.jsx        # Card + modal expand (waveform, spec, GitHub)
│   │   ├── Resume.jsx             # PDF iframe embed + wget-style download
│   │   ├── Blog.jsx               # Accordion write-ups (design notes)
│   │   ├── Contact.jsx            # Terminal-style EmailJS contact form
│   │   ├── Footer.jsx             # Social links + copyright
│   │   │
│   │   └── ui/                    # Reusable micro-component library
│   │       ├── PixelBlast.jsx     # Three.js WebGL Bayer-dithered pixel bg
│   │       │                      #   Used in Hero — interactive ripple on click
│   │       ├── PixelBlast.css     # Styles for PixelBlast canvas container
│   │       ├── TextType.jsx       # GSAP-powered typewriter (multi-string,
│   │       │                      #   variable speed, cursor blink) — used in Hero
│   │       ├── TextType.css       # Cursor blink + text-type base styles
│   │       └── hover-footer.jsx   # Exports TextHoverEffect + FooterBackgroundGradient
│   │                              #   Used in Footer.jsx
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useTypewriter.js       # Cycles through strings with type/delete/pause
│   │   └── useScrollFade.js       # IntersectionObserver fade-up on scroll
│   │
│   ├── data/                      # Static content — edit to personalise
│   │   ├── projects.js            # 6 RTL/FPGA/ASIC project entries
│   │   ├── skills.js              # 4 skill categories × 8 skills each
│   │   └── blog.js                # 3 design note write-up stubs
│   │
│   └── lib/
│       └── utils.js               # clsx + tailwind-merge helper (cn())
│
├── index.html                     # HTML shell — Google Fonts, meta tags, SEO
├── vite.config.js                 # Vite + @vitejs/plugin-react
├── tailwind.config.js             # Custom tokens: colors, fonts, animations
├── postcss.config.js              # Tailwind + Autoprefixer
├── package.json                   # All dependencies
└── sonnb.txt                      # Personal notes / scratchpad
```

---

## 🎬 Loader — 4-Phase Cinematic Intro

The `Loader.jsx` is the crown-jewel component. It plays once per session (skipped on reload via `sessionStorage`).

| Phase | Duration | What Happens |
|-------|----------|--------------|
| **0 — PCB Traces** | ~1.2 s | Canvas draws copper traces outward from center; via holes pulse green; SMD resistor/cap silhouettes fade in |
| **1 — Chip Zoom** | ~1.3 s | QFP IC package SVG renders → camera zooms into die → MOSFET gate array (poly/N-well/Metal-1 layers, color-coded) becomes visible |
| **2 — Boot Sequence** | ~1.6 s | Terminal logs print line-by-line: `SYNTHESIS: DONE`, `STA: PASS`, `DRC: CLEAN` with progress bar |
| **3 — Wipe Out** | ~0.7 s | Framer Motion `AnimatePresence` fade → hero page revealed |

A **[ SKIP INTRO ]** button appears after 1 second.

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#0a0a0f` | Page background |
| `--bg-secondary` | `#0f0f1a` | Cards, nav |
| `--accent-green` | `#00ff88` | All accents, borders, bars |
| `--accent-purple` | `#7c3aed` | Secondary highlight |
| `--text-muted` | `#8892a4` | Body text, labels |
| `--text-bright` | `#c9d1d9` | Headings, values |

### Fonts

- **JetBrains Mono** — all headings, code-feel labels, nav, terminal
- **Inter** — body text, descriptions

### Global Effects (in `index.css`)

- **PCB grid** — `body::before` 40×40px green trace grid at 4% opacity
- **Scanline overlay** — `body::after` 4px repeating horizontal stripes at 3% opacity
- **IC corner decorators** — `.ic-card::before/::after` — L-bracket SVG corners that expand on hover
- **Glitch text** — `.glitch-text` — RGB-split displacement animation, fires every 4s
- **Custom scrollbar** — 6px green bar with glow shadow

---

## 📄 Sections

| Section | Component | Key Feature |
|---------|-----------|-------------|
| **Hero** | `Hero.jsx` | Glitch name, typewriter tagline cycles 5 roles, floating logic-gate SVGs |
| **About** | `About.jsx` | Bio + component datasheet card (GPA, projects, tools, status) |
| **Skills** | `SkillsMatrix.jsx` | 4 tabs: RTL / Verification / EDA Tools / Programming — animated fill bars |
| **Projects** | `Projects.jsx` + `ProjectCard.jsx` | Filter by category, card grid, modal with waveform + spec + GitHub |
| **Resume** | `Resume.jsx` | PDF iframe + terminal `wget` download line |
| **Blog** | `Blog.jsx` | Accordion write-ups with tags and read time |
| **Contact** | `Contact.jsx` | Terminal-style form (`name@portfolio:~$`), EmailJS, animated output log |
| **Footer** | `Footer.jsx` | Glowing green border, social icons (GitHub / LinkedIn / Email) |

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **Vite** | 8.x | Build tool + dev server |
| **React** | 19.x | UI framework |
| **Tailwind CSS** | 3.x | Utility styling |
| **Framer Motion** | 11.x | Scroll animations, modals, page transitions |
| **GSAP** | 3.x | Advanced timeline animations |
| **Three.js** | 0.184.x | 3D canvas effects |
| **EmailJS** | 4.x | Contact form (no backend needed) |
| **react-icons** | 5.x | GitHub, LinkedIn, Mail icons |
| **lucide-react** | 1.x | UI icon set |
| **clsx + tailwind-merge** | — | Conditional class utilities (`cn()`) |
| **gh-pages** | 6.x | GitHub Pages deployment |

---

## 🔧 Scripts

```bash
npm run dev       # Start Vite dev server at http://localhost:5173
npm run build     # Production build → /dist
npm run preview   # Preview production build locally
npm run deploy    # Build + push to GitHub Pages (gh-pages branch)
```

---

## ✉️ Contact Form Setup (EmailJS)

1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Create a **Service**, **Email Template**, and get your **Public Key**
3. Open `src/components/Contact.jsx` and replace:

```js
const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'
const EMAILJS_KEY      = 'YOUR_PUBLIC_KEY'
```

Template variables used: `from_name`, `from_email`, `message`

---

## 🚀 Deployment (GitHub Pages)

```bash
# 1. Set base URL in vite.config.js if deploying to a subdirectory:
#    base: '/your-repo-name/'

# 2. Deploy:
npm run deploy
```

The site will be available at `https://<your-username>.github.io/<repo-name>/`

---

## ✏️ Personalisation Checklist

- [ ] `src/data/projects.js` — add your real project titles, specs, GitHub links
- [ ] `src/data/skills.js` — adjust skill names and proficiency levels
- [ ] `src/data/blog.js` — add your own write-up content
- [ ] `public/resume.pdf` — replace with your actual resume
- [ ] `src/components/Contact.jsx` — add your EmailJS keys
- [ ] `src/components/Footer.jsx` — update GitHub / LinkedIn / Email URLs
- [ ] `src/components/Navbar.jsx` — update logo text and resume link
- [ ] `index.html` — update `<title>` and meta description
- [ ] `vite.config.js` — set `base` to your repo name for GitHub Pages

---

## 📦 Key Files to Know

| File | Purpose |
|------|---------|
| `src/data/projects.js` | All project content — title, tagline, spec, tags, GitHub |
| `src/data/skills.js` | Skill categories and proficiency percentages |
| `src/data/blog.js` | Blog post stubs — title, excerpt, full content |
| `src/hooks/useTypewriter.js` | Custom hook: type → pause → delete → cycle |
| `src/hooks/useScrollFade.js` | IntersectionObserver → adds `.visible` class |
| `src/lib/utils.js` | `cn()` helper for conditional Tailwind classes |
| `src/index.css` | All global CSS: tokens, grid bg, scanlines, utilities |
| `tailwind.config.js` | Custom colors, fonts, keyframe animations |

---

*Built with RTL-level precision. © SONNB 2025*
