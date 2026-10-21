import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

export const EASE = [0.16, 1, 0.3, 1]

/** Fades and lifts children into place the first time they scroll into view. */
export function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
    const Tag = motion[as]
    return (
        <Tag
            className={className}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE, delay }}
        >
            {children}
        </Tag>
    )
}

/** Word-by-word masked rise. Screen readers get the plain string via aria-label. */
export function SplitText({ text, className = '', delay = 0, stagger = 0.06, as = 'span', inView = true }) {
    const Tag = motion[as]
    const words = text.split(' ')
    const trigger = inView
        ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-40px' } }
        : { initial: 'hidden', animate: 'show' }
    return (
        <Tag aria-label={text} className={className} {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }}>
            {words.map((word, i) => (
                <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.25em] -mb-[0.25em] align-bottom">
                    <motion.span
                        className="inline-block will-change-transform"
                        variants={{
                            hidden: { y: '110%', rotate: 4 },
                            show: { y: '0%', rotate: 0, transition: { duration: 1, ease: EASE } },
                        }}
                    >
                        {word}
                        {i < words.length - 1 && ' '}
                    </motion.span>
                </span>
            ))}
        </Tag>
    )
}

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Pulls its child toward the cursor while hovered (fine pointers only). */
export function Magnetic({ children, strength = 0.35, className = '' }) {
    const ref = useRef(null)
    const reduce = useReducedMotion()
    const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })
    const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 16, mass: 0.4 })

    const onMove = (e) => {
        if (reduce || !finePointer()) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const reset = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={`inline-flex ${className}`}>
            {children}
        </motion.div>
    )
}

/** Tracks the pointer inside an element as --mx/--my so children can paint a spotlight. */
export function useSpotlight() {
    return (e) => {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
}

export function SpotlightLayer() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),rgba(124,58,237,0.10),transparent_65%)] dark:bg-[radial-gradient(420px_circle_at_var(--mx)_var(--my),rgba(167,139,250,0.16),transparent_65%)]"
        />
    )
}

/** A soft trailing ring that grows over interactive elements. Decorative; the native cursor stays. */
export function CursorTrail() {
    const reduce = useReducedMotion()
    const [enabled, setEnabled] = useState(false)
    const [hovering, setHovering] = useState(false)
    const [visible, setVisible] = useState(false)
    const x = useSpring(-100, { stiffness: 500, damping: 40, mass: 0.5 })
    const y = useSpring(-100, { stiffness: 500, damping: 40, mass: 0.5 })

    useEffect(() => {
        if (reduce || !finePointer()) return undefined
        setEnabled(true)
        const onMove = (e) => {
            x.set(e.clientX)
            y.set(e.clientY)
            setVisible(true)
            setHovering(Boolean(e.target.closest?.('a, button, [role="tab"]')))
        }
        const onLeave = () => setVisible(false)
        window.addEventListener('pointermove', onMove, { passive: true })
        document.documentElement.addEventListener('pointerleave', onLeave)
        return () => {
            window.removeEventListener('pointermove', onMove)
            document.documentElement.removeEventListener('pointerleave', onLeave)
        }
    }, [reduce, x, y])

    if (!enabled) return null
    return (
        <motion.div
            aria-hidden="true"
            style={{ x, y }}
            className="pointer-events-none fixed top-0 left-0 z-[90] mix-blend-difference"
        >
            <motion.div
                animate={{ scale: hovering ? 1.9 : 1, opacity: visible ? 1 : 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="-translate-x-1/2 -translate-y-1/2 size-8 rounded-full border border-white/80"
            />
        </motion.div>
    )
}

/** Counts up to `value` once visible. */
export function CountUp({ value, duration = 1.4 }) {
    const ref = useRef(null)
    const reduce = useReducedMotion()
    const [n, setN] = useState(reduce ? value : 0)

    useEffect(() => {
        if (reduce) return setN(value)
        const el = ref.current
        let raf = 0
        const io = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            io.disconnect()
            const start = performance.now()
            const tick = (now) => {
                const t = Math.min(1, (now - start) / (duration * 1000))
                setN(Math.round(value * (1 - Math.pow(1 - t, 3))))
                if (t < 1) raf = requestAnimationFrame(tick)
            }
            raf = requestAnimationFrame(tick)
        })
        io.observe(el)
        return () => {
            io.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [value, duration, reduce])

    return <span ref={ref}>{String(n).padStart(2, '0')}</span>
}
