# Harith Fakrullah — Portfolio

Personal portfolio website built with **React**, **Tailwind CSS**, **GSAP**, and **Framer Motion**.

Live at: https://www.harithfakrullah.dev/

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion + GSAP |
| Smooth Scroll | Lenis |
| Icons | React Icons |
| Font | Cormorant Garamond + Inter |
| Deployment | Vercel |

---

## Features

- Animated loading/intro screen with F1 team logos
- GSAP word-by-word hero text reveal
- Canvas-based animated star particle background
- Lenis smooth scroll integrated with GSAP ScrollTrigger
- Custom cursor with mix-blend-difference effect
- Scroll progress indicator
- Responsive navbar with hamburger menu
- Project cards with live/GitHub links
- Horizontally browsable Selected Work with a 3D workspace preview
- Tech skills with brand-color icons
- Work experience timeline
- Footer with live clock

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Trixxy98/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Fixed navbar + mobile hamburger menu
│   ├── Hero.jsx            # Hero section with GSAP text animation
│   ├── StarBackground.jsx  # Canvas particle background
│   ├── SelectedWork.jsx    # Project cards grid
│   ├── ProjectCard.jsx     # Individual project card
│   ├── WhatIDo.jsx         # Accordion services section
│   ├── Skills.jsx          # Tech stack with icons
│   ├── Experience.jsx      # Work experience timeline
│   ├── Footer.jsx          # Footer with live clock
│   ├── LoadingScreen.jsx   # Intro loading animation
│   ├── ScrollProgress.jsx  # Scroll progress bar
│   └── CustomCursor.jsx    # Custom cursor (desktop only)
├── data/
│   └── projects.js         # Project data
├── hooks/
│   └── useSmoothScroll.js  # Lenis + GSAP ScrollTrigger integration
├── App.jsx
├── main.jsx
└── index.css
```

---

## Contact

- **Email** — harithfakrullah@gmail.com
- **LinkedIn** — [linkedin.com/in/harithfakrullah](https://linkedin.com/in/harithfakrullah/)
- **GitHub** — [github.com/Trixxy98](https://github.com/Trixxy98)

## 3D Model Credit

The hero uses [F1 2026 concept (polygon model)](https://sketchfab.com/3d-models/f1-2026-concept-polygon-model-ea3bde709b1e4dc9b0ec8557d106ed42) by [Qvist_designs](https://sketchfab.com/Qvist_Designs), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The original model was simplified for desktop and mobile web use, resized and rotated, and restyled as a blueprint hologram. The original file is not included.
