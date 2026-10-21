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
  --font-display: "Cinzel", "Trajan Pro", Georgia, serif;
  --font-sans: "Alegreya Sans", "Segoe UI", system-ui, sans-serif;
  --font-pixel: "Pixelify Sans", ui-monospace, monospace;

  --animate-float: float 6s ease-in-out infinite;
  --animate-blink: blink 1s steps(1) infinite;
  --animate-glow: glow 2.4s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  @keyframes glow {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
  }
}

/* Day (parchment) / night (dungeon) tokens swap with the .dark class */
@theme inline {
  --color-void: var(--void);
  --color-panel: var(--panel);
  --color-panel-2: var(--panel-2);
  --color-gold: var(--gold);
  --color-gold-dim: var(--gold-dim);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-hp: var(--hp);
  --color-mp: var(--mp);
  --color-xp: var(--xp);
  --color-arcane: var(--arcane);
  --color-emerald: var(--emerald);
  --color-ember: var(--ember);
}

@layer base {
  :root {
    --void: #ece0c4;
    --panel: #fbf5e5;
    --panel-2: #f2e7cb;
    --gold: #8b5d14;
    --gold-dim: #c7a463;
    --ink: #2a1f12;
    --ink-soft: #4a3b25;
    --muted: #6b5940;
    --line: #d4c29a;
    --hp: #b8262b;
    --mp: #1f5fae;
    --xp: #8b5d14;
    --arcane: #6a3fd6;
    --emerald: #1d7a50;
    --ember: #b4500f;
    color-scheme: light;
  }

  .dark {
    --void: #07060f;
    --panel: #120f24;
    --panel-2: #1c1735;
    --gold: #e6bd61;
    --gold-dim: #6e5a2e;
    --ink: #f3ead6;
    --ink-soft: #d3c8b0;
    --muted: #a3977f;
    --line: #3a3054;
    --hp: #ff6b6f;
    --mp: #5aacff;
    --xp: #f5c542;
    --arcane: #b49bff;
    --emerald: #4fd99c;
    --ember: #ff9a52;
    color-scheme: dark;
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5.5rem;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: var(--void);
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 1.0625rem;
    line-height: 1.6;
    overflow-x: hidden;
  }

  ::selection {
    background-color: var(--gold);
    color: var(--void);
  }

  :focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 3px;
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
