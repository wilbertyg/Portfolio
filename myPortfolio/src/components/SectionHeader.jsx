import { motion } from 'motion/react'
import PixelArt from './PixelArt'
import { ICONS } from './Game/sprites'

function SectionHeader({ index, tag, icon, title, children, aside }) {
    return (
        <div className="mb-8 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-8">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <p className="mb-4 flex items-center gap-2.5 font-display text-[10px] tracking-wider text-ink-soft uppercase dark:text-gold">
                    {icon && <PixelArt art={ICONS[icon]} className="h-4 w-auto" />}
                    Chapter {index}
                    <span className="h-0.5 w-6 bg-current" aria-hidden="true" />
                    {tag}
                </p>
                <h2 className="font-display text-2xl leading-tight text-ink [text-shadow:3px_3px_0_rgb(92_63_40/0.2)] sm:text-3xl md:text-4xl dark:text-white dark:[text-shadow:4px_4px_0_var(--color-void)]">
                    {title}
                </h2>
                {children && <p className="mt-4 max-w-[600px] text-lg leading-snug text-ink-soft sm:text-xl dark:text-white/75">{children}</p>}
            </motion.div>
            {aside}
        </div>
    )
}

export default SectionHeader
