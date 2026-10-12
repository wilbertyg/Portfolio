import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Virtual CSS module plugin so zero physical CSS files are needed in the repository.
const virtualTailwindPlugin = () => {
  const virtualId = 'virtual:tailwind.css'
  const resolvedVirtualId = '\0' + virtualId

  return {
    name: 'virtual-tailwind',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId
    },
    load(id) {
      if (id === resolvedVirtualId) {
        return `@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: "Satoshi", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: "Newsreader", "Instrument Serif", Georgia, serif;
  --font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, monospace;

  /* Warm Monochrome Palette */
  --color-canvas: #FBFBFA;
  --color-surface: #FFFFFF;
  --color-subtle: #F7F6F3;
  --color-line: #EAEAEA;
  --color-line-strong: #DCDCDA;
  --color-ink: #111111;
  --color-ink-soft: #2F3437;
  --color-muted: #787774;
  --color-faint: #A1A1A0;
  --color-accent: #111111;
  --color-accent-hover: #2A2A2A;

  /* Muted Spot Pastels (Minimalist UI Directive) */
  --color-pastel-red: #FDEBEC;
  --color-pastel-red-ink: #9F2F2D;
  --color-pastel-blue: #E1F3FE;
  --color-pastel-blue-ink: #1F6C9F;
  --color-pastel-green: #EDF3EC;
  --color-pastel-green-ink: #346538;
  --color-pastel-yellow: #FBF3DB;
  --color-pastel-yellow-ink: #956400;

  /* Double Helix Skill Category Indicators */
  --color-cat-ml: #1F6C9F;
  --color-cat-lang: #346538;
  --color-cat-tools: #956400;
  --color-cat-core: #9F2F2D;

  --animate-pulse-dot: pulse-dot 2s infinite;

  @keyframes pulse-dot {
    0% { box-shadow: 0 0 0 0 rgb(52 101 56 / 0.4); }
    70% { box-shadow: 0 0 0 6px rgb(52 101 56 / 0); }
    100% { box-shadow: 0 0 0 0 rgb(52 101 56 / 0); }
  }

  /* 3D Double Helix Tornado Orbit for Billboarded Chips */
  @keyframes double-helix-orbit {
    0% {
      transform: translateY(var(--y)) rotateY(0deg) translateZ(var(--r)) rotateY(0deg);
      opacity: 1;
    }
    25% {
      opacity: 0.75;
    }
    50% {
      transform: translateY(var(--y)) rotateY(180deg) translateZ(var(--r)) rotateY(-180deg);
      opacity: 0.22;
    }
    75% {
      opacity: 0.75;
    }
    100% {
      transform: translateY(var(--y)) rotateY(360deg) translateZ(var(--r)) rotateY(-360deg);
      opacity: 1;
    }
  }

  /* 3D Connective Base-Pair Rung Rotation across Central Tornado Axis */
  @keyframes helix-rung-orbit {
    0% {
      transform: translateY(var(--y)) rotateY(0deg);
      opacity: 0.35;
    }
    25% {
      opacity: 0.55;
    }
    50% {
      transform: translateY(var(--y)) rotateY(180deg);
      opacity: 0.18;
    }
    75% {
      opacity: 0.55;
    }
    100% {
      transform: translateY(var(--y)) rotateY(360deg);
      opacity: 0.35;
    }
  }

  /* Atmospheric Tornado 3D Sway */
  @keyframes helix-sway {
    from {
      transform: rotateX(-8deg) rotateZ(-2.5deg);
    }
    to {
      transform: rotateX(-8deg) rotateZ(2.5deg);
    }
  }
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5.5rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: #FBFBFA;
    color: #111111;
    font-family: var(--font-sans);
    line-height: 1.6;
    overflow-x: hidden;
  }

  ::selection {
    background-color: #E1F3FE;
    color: #1F6C9F;
  }

  :focus-visible {
    outline: 2px solid #111111;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
}
`
      }
    },
  }
}

export default defineConfig({
  plugins: [virtualTailwindPlugin(), react(), tailwindcss()],
})
