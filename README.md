<div align="center">

<img src="public/assets/img9.png" alt="ICE TECH Logo" width="72" />

# 🧊 ICE TECH

### A premium, high-performance web experience for ICE TECH

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-00E5FF?style=for-the-badge&logo=vercel&logoColor=white)](https://saif-ur-rehman456.github.io/Reimagine-ICE-TECH/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![GSAP](https://img.shields.io/badge/GSAP_3-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-00E5FF?style=for-the-badge)](./LICENSE)

</div>

---

> [!NOTE]
> **The performance story is the headline.** Largest Contentful Paint went from **81.05s → 2.2s** by removing artificial loading delays, restructuring the animation boot sequence, and rewriting the asset pipeline — while keeping every cinematic effect intact. Full breakdown in [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md).

## ✨ Highlights

- 🎭 **Motion Excellence** — GSAP + `@gsap/react` + Lenis smooth scrolling drive scroll-triggered reveals, split-text typography (`split-type`), clip-mask transitions, and a custom keyboard-scroll experience.
- ⚡ **Performance First** — Code splitting into vendor/GSAP/Lenis chunks, terser minification with console stripping, WebP-only imagery, and aggressive cache headers.
- 💎 **Premium Aesthetic** — Obsidian-glass surfaces, cyan accents, and a cinematic dark theme built entirely with Tailwind.
- 📱 **Fluid Layout** — Scales gracefully from small phones to ultrawide displays.
- 🔍 **SEO & Meta Ready** — Open Graph tags, JSON-LD schema, semantic HTML5, and a tuned favicon set.
- 🛡️ **Fault Tolerant** — React ErrorBoundary wrapping the app plus hardened security headers (`X-Frame-Options`, `nosniff`, referrer policy).

## 🖼️ Sections

| Section | What it does |
| :--- | :--- |
| **StartingAnimation** | Cinematic boot loader — 10s+ legacy intro reduced to a crisp 2–3s sequence |
| **Hero** | Full-viewport statement with GSAP entrance choreography |
| **TechStack** | Animated showcase of the stack powering the site |
| **MainProducts / Products** | Flagship product showcases with scroll-reveal imagery |
| **About** | Brand story with scroll-triggered narrative |
| **CTA / Footer** | Conversion banner and site-wide navigation |

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 19 · Vite 6 |
| **Animation** | GSAP 3 · @gsap/react · Lenis · split-type |
| **Styling** | Tailwind CSS 3 · PostCSS · Autoprefixer |
| **Icons** | Lucide React |
| **Deployment** | GitHub Pages · Vercel · Netlify (pre-configured) |

## 🏁 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ and npm.

```bash
# 1. Clone
git clone https://github.com/Saif-Ur-Rehman456/Reimagine-ICE-TECH.git
cd Reimagine-ICE-TECH

# 2. Install
npm install

# 3. Develop — http://localhost:5173
npm run dev

# 4. Build & preview the production bundle — http://localhost:4173
npm run build
npm run preview
```

### 📦 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Produce the optimized production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run build:analyze` | Build with debug output for bundle analysis |
| `npm run serve:dist` | Serve `dist/` on port 4173 |
| `npm run deploy` | Build and publish to GitHub Pages |

### 🔧 Environment

The project supports `.env` (development) and `.env.production` (production) files for API endpoints (both gitignored — create them locally as needed). No secrets are required to run the site.

## 🚢 Deployment

Deploy anywhere — config files are already in the repo:

| Platform | Method |
| :--- | :--- |
| **GitHub Pages** | `npm run deploy` (gh-pages configured) |
| **Vercel** | Zero-config — `vercel.json` handles routing & headers |
| **Netlify** | Zero-config — `netlify.toml` handles build & cache headers |
| **Self-hosted** | `npm run build && npm run preview` (or run behind pm2/nginx) |

## 📈 Core Web Vitals

| Metric | Before | After | Status |
| :--- | :--- | :--- | :--- |
| **LCP** | 🔴 81.05s | 🟢 **2.2s** | Excellent |
| **CLS** | 🟢 0.00 | 🟢 **0.00** | Perfect |
| **INP** | 🟡 104ms | 🟢 **<100ms** | Snappy |

*Measured with Google PageSpeed Insights. See [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) for the complete optimization checklist — code splitting, image pipeline, caching strategy, and security headers.*

## 📂 Project Structure

```
src/
├── components/
│   ├── StartingAnimation.jsx   # Boot sequence loader
│   ├── Hero.jsx                # Above-the-fold statement
│   ├── TechStack.jsx           # Animated stack showcase
│   ├── Products.jsx            # Product grid
│   ├── MainProducts.jsx        # Flagship showcase
│   ├── About.jsx               # Brand narrative
│   ├── CTA.jsx / Footer.jsx    # Conversion & navigation
│   ├── ScrollClipMask.jsx      # Scroll-driven clip-path reveals
│   ├── TransitionOverlay.jsx   # Route/section transitions
│   ├── CustomKeyboardScroll.jsx# Keyboard-first scroll handling
│   └── ErrorBoundary.jsx       # Crash containment
├── hooks/                      # Custom React hooks
├── context/                    # React context providers
├── App.jsx / main.jsx          # App shell & entry point
└── index.css                   # Tailwind + global styles
```

## 🤝 Contributing

Issues and pull requests are welcome! For significant changes, open an issue first to discuss what you'd like to change.

## 📜 License

Released under the [MIT License](./LICENSE).

---

<p align="center">
<strong>⭐ Star this repo if it helped you — and try the <a href="https://saif-ur-rehman456.github.io/Reimagine-ICE-TECH/">live demo</a>!</strong>
</p>

<p align="center"><em>Built with 🧊 by Saif-Ur-Rehman456</em></p>
