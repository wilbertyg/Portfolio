import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/** "Area discovered" title card shown the first time each [data-zone] section scrolls into view. */
function ZoneBanner() {
    const [zone, setZone] = useState(null)

    useEffect(() => {
        const seen = new Set(['Title'])
        let timer
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const name = entry.target.dataset.zone
                    if (!entry.isIntersecting || seen.has(name)) continue
                    seen.add(name)
                    setZone(name)
                    clearTimeout(timer)
                    timer = setTimeout(() => setZone(null), 2200)
                }
            },
            { threshold: 0.25 },
        )
        document.querySelectorAll('[data-zone]').forEach((el) => observer.observe(el))
        return () => {
            observer.disconnect()
            clearTimeout(timer)
        }
    }, [])

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-[22%] z-40 flex justify-center px-4">
            <AnimatePresence>
                {zone && (
                    <motion.div
                        key={zone}
                        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-center gap-2 text-center"
                    >
                        <span className="font-pixel text-xs uppercase tracking-[0.4em] text-gold drop-shadow-[0_1px_4px_rgb(0_0_0/0.8)]">Area discovered</span>
                        <span className="h-px w-48 bg-linear-to-r from-transparent via-gold to-transparent" />
                        <span className="font-display text-3xl font-bold tracking-[0.12em] text-[#fff6dd] drop-shadow-[0_2px_12px_rgb(0_0_0/0.9)] sm:text-5xl">
                            {zone}
                        </span>
                        <span className="h-px w-48 bg-linear-to-r from-transparent via-gold to-transparent" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ZoneBanner
