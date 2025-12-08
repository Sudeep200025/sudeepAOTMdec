# Satellite Internet in India — Student Project (Single Page)

## Overview
This mobile-first single page explains satellite internet in an accessible, non-technical tone. It’s designed for a student showcase: clean visuals, generous whitespace, readable typography, and simple interactions. The page covers what satellite internet is, how it works, why it matters for India, benefits/challenges, a comparison with fiber and mobile, India-specific use cases, leading companies, future possibilities, an illustrative map, and an FAQ.

## Design & Accessibility Choices
- **Palette & Typography:** Light background `#F7FAFC`, primary `#2B6CB0`, accent `#00A3C4`, dark text `#1A202C`. System font stack for fast rendering. Large mobile headings for readability.
- **Semantics & Keyboard:** Uses proper HTML5 sections and landmarks (`header`, `main`, `section`, `footer`). Navigation and modals are keyboard-accessible; focus states are visible. FAQ uses `aria-expanded` and panels for screen readers.
- **Motion:** Minimal animations and honors `prefers-reduced-motion`. Smooth scrolling respects the same preference.

## Performance & Implementation
- **Minimal JS & No Libraries:** Vanilla JS only; small runtime (<50KB when minified). No external frameworks — faster load and simpler grading.
- **Images:** Lazy-loaded with `srcset` for responsive delivery. Use SVG icons where possible.
- **Responsive Layout:** Mobile-first breakpoints at 480px, 768px, 1024px. Navigation collapses to a hamburger under 768px.
- **Progressive Enhancement:** The site works with JS disabled (content visible) — interactive extras enhance the experience.

## Interactions
- Hamburger nav (accessible), smooth scroll, FAQ accordion (keyboard), comparison toggle to hide/show numeric metric cells, company info modals (keyboard accessible).

## How to run
1. Place `index.html`, `styles.css`, `script.js` in the same folder.
2. Create `assets/images/` and `assets/icons/` and add placeholder images with the filenames listed in the assets section.
3. Open `index.html` in a browser.

## Notes & Next steps
- Replace placeholder images with real illustrations or optimized SVGs.
- Optionally fetch `data/companies.json` to populate modals dynamically.
- For deployment, minify `styles.css` and `script.js`, and serve images with proper compressed formats (WebP/AVIF) for faster performance.
