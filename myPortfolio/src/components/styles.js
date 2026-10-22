// Shared Tailwind class strings for the 16-bit RPG theme.

// Classic SNES menu window: white frame, dark keyline, blue gradient.
export const win =
    'rounded-lg border-4 border-frame bg-linear-to-b from-win-hi via-win to-win-lo text-white shadow-[inset_0_0_0_2px_var(--color-void),0_0_0_3px_var(--color-void),6px_8px_0_3px_rgb(11_14_42/0.3)]'

// Recessed inventory slot inside a window.
export const slot = 'rounded-sm border-2 border-void/70 bg-void/35 shadow-[inset_2px_2px_0_rgb(0_0_0/0.35)]'

export const label = 'font-display text-[10px] uppercase leading-relaxed tracking-wider'

export const chip =
    'rounded-sm border-2 border-void/80 bg-void/50 px-2 py-1 font-display text-[8px] uppercase leading-none tracking-wider text-mp'

// Small square HUD button (sound, day/night, menu).
export const hudBtn =
    'flex size-10 items-center justify-center rounded-sm border-2 border-void bg-void/40 text-white transition-colors hover:bg-void/70 active:translate-y-px'

// Menu row with a pointing-hand cursor that appears on hover/focus/selection.
export const menuItem =
    'group flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-white/10 focus-visible:bg-white/10'
