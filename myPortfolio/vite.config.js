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
  --font-sans: "Pixelify Sans", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Press Start 2P", ui-monospace, monospace;

  /* Day: old game-manual parchment */
  --color-parch: #F3E2B8;
  --color-parch-deep: #E6CC94;
  --color-ink: #2B1A10;
  --color-ink-soft: #5C3F28;

  /* Night: overworld sky */
  --color-night: #0B1030;
  --color-night-hi: #161D4A;

  /* SNES-style menu window */
  --color-win-hi: #4A6CF0;
  --color-win: #2A46C0;
  --color-win-lo: #121C70;
  --color-void: #0B0E2A;
  --color-frame: #F4F4F8;

  /* HUD accents */
  --color-gold: #F8D048;
  --color-hp: #E84848;
  --color-mp: #48A8F8;
  --color-exp: #B868F8;
  --color-heal: #58D868;

  --animate-blink: blink 1s steps(1, end) infinite;
  --animate-nudge: nudge 0.6s steps(1, end) infinite;
  --animate-float: float 3.2s ease-in-out infinite;

  @keyframes blink {
    50% { opacity: 0; }
  }
  @keyframes nudge {
    50% { transform: translateX(3px); }
  }
  @keyframes float {
    50% { transform: translateY(-10px); }
  }
}

@layer base {
  html {
    scroll-behavior: smooth;
    scroll-padding-top: 5rem;
  }

  body {
    background-color: #F3E2B8;
    color: #2B1A10;
    font-family: var(--font-sans);
    line-height: 1.5;
    overflow-x: hidden;
  }

  .dark body {
    background-color: #0B1030;
    color: #F4F4F8;
  }

  ::selection {
    background-color: #F8D048;
    color: #0B0E2A;
  }

  :focus-visible {
    outline: 3px solid #F8D048;
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
