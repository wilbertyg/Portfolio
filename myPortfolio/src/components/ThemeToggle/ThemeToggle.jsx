import { motion, AnimatePresence } from 'motion/react'
import { useTheme } from '../../context/ThemeContext'
import PixelArt from '../PixelArt'
import { ICONS } from '../Game/sprites'
import { playSfx } from '../Game/sfx'
import { hudBtn } from '../styles'

// Day/night: also flips the overworld's lighting.
function ThemeToggle({ className = '' }) {
    const { isDark, toggleTheme } = useTheme()
    const label = isDark ? 'Switch to day (light) mode' : 'Switch to night (dark) mode'

    return (
        <button
            type="button"
            onClick={() => {
                playSfx('select')
                toggleTheme()
            }}
            aria-label={label}
            title={label}
            className={`${hudBtn} ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? 'moon' : 'sun'}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'linear' }}
                    className="flex"
                >
                    <PixelArt art={isDark ? ICONS.moon : ICONS.sun} className="h-4.5 w-auto" />
                </motion.span>
            </AnimatePresence>
        </button>
    )
}

export default ThemeToggle
