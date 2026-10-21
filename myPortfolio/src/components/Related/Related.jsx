import { useState, useEffect, useRef, useCallback } from 'react'
import { RelatedList } from './RelatedList'
import SectionHeader from '../SectionHeader'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react'
import { EASE } from '../fx'

function CertificateDialog({ cert, onClose }) {
    const closeRef = useRef(null)

    useEffect(() => {
        const previouslyFocused = document.activeElement
        closeRef.current?.focus()
        document.body.style.overflow = 'hidden'

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = ''
            previouslyFocused?.focus?.()
        }
    }, [onClose])

    return (
        <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0B0B0F]/40 p-4 backdrop-blur-xl dark:bg-black/70 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cert-dialog-title"
                className="flex max-h-[95vh] w-full max-w-[860px] flex-col gap-5 overflow-y-auto rounded-[28px] border border-black/10 bg-[#F4F3EF]/90 p-5 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.5)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0A0A12]/90 md:max-h-[90vh] md:p-7"
                initial={{ scale: 0.92, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: EASE }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7C3AED] dark:text-[#C4B5FD]">{cert.category}</span>
                        <h3 id="cert-dialog-title" className="mt-2 font-sans text-2xl font-semibold leading-tight tracking-[-0.035em] text-[#0B0B0F] dark:text-[#F4F4F5] md:text-3xl">
                            {cert.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#57534E] dark:text-[#A1A1AA]">
                            {cert.issuer}
                            {cert.year && ` · ${cert.year}`}
                        </p>
                    </div>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="grid size-10 shrink-0 place-items-center rounded-full border border-black/10 text-[#57534E] transition-all duration-300 hover:rotate-90 hover:bg-[#0B0B0F] hover:text-white dark:border-white/15 dark:text-[#A1A1AA] dark:hover:bg-[#F4F4F5] dark:hover:text-[#0B0B0F]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="flex w-full items-center justify-center overflow-hidden rounded-[20px] border border-black/10 bg-white dark:border-white/10 dark:bg-[#111118]">
                    <img src={cert.image} alt={`${cert.title} certificate`} width="760" height="520" className="max-h-[58vh] max-w-full object-contain" />
                </div>

                {cert.description && <p className="text-sm leading-relaxed text-[#57534E] dark:text-[#A1A1AA]">{cert.description}</p>}
            </motion.div>
        </motion.div>
    )
}

function CertRow({ cert, index, onPreview, onHover }) {
    return (
        <motion.li
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: EASE, delay: index * 0.06 }}
            className="border-b border-black/10 dark:border-white/10"
        >
            <button
                type="button"
                onClick={onPreview}
                onPointerEnter={(e) => e.pointerType === 'mouse' && onHover(cert)}
                onPointerLeave={() => onHover(null)}
                onFocus={() => onHover(null)}
                aria-label={`View credential: ${cert.title}`}
                className="group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 overflow-hidden py-6 text-left sm:grid-cols-[4.5rem_1fr_auto_auto] sm:gap-8 md:py-8"
            >
                <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-[#0891B2]/[0.07] via-[#7C3AED]/[0.07] to-[#DB2777]/[0.07] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 dark:from-[#67E8F9]/[0.06] dark:via-[#A78BFA]/[0.08] dark:to-[#F472B6]/[0.06]"
                />
                <img
                    src={cert.image}
                    alt=""
                    loading="lazy"
                    width="72"
                    height="48"
                    className="relative h-12 w-[72px] rounded-lg object-cover ring-1 ring-black/10 sm:hidden dark:ring-white/10"
                />
                <span className="relative hidden font-mono text-sm text-[#78716C] tabular-nums sm:block dark:text-[#71717A]">{cert.year}</span>
                <span className="relative flex min-w-0 flex-col gap-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:group-hover:translate-x-3">
                    <span className="text-lg font-semibold leading-snug tracking-[-0.03em] text-[#0B0B0F] sm:text-2xl dark:text-[#F4F4F5]">{cert.title}</span>
                    <span className="text-sm text-[#57534E] dark:text-[#A1A1AA]">
                        {cert.issuer}
                        <span className="sm:hidden"> · {cert.year}</span>
                    </span>
                </span>
                <span className="relative hidden rounded-full border border-black/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#57534E] lg:block dark:border-white/10 dark:text-[#A1A1AA]">
                    {cert.category}
                </span>
                <span className="relative grid size-10 place-items-center rounded-full border border-black/10 text-[#0B0B0F] transition-all duration-500 group-hover:-rotate-45 group-hover:border-transparent group-hover:bg-[#0B0B0F] group-hover:text-white dark:border-white/15 dark:text-[#F4F4F5] dark:group-hover:bg-[#F4F4F5] dark:group-hover:text-[#0B0B0F]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </span>
            </button>
        </motion.li>
    )
}

/** Floating certificate thumbnail that trails the mouse while a row is hovered. */
function HoverPreview({ cert }) {
    const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 24, mass: 0.6 })
    const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 24, mass: 0.6 })

    useEffect(() => {
        const onMove = (e) => {
            x.set(e.clientX)
            y.set(e.clientY)
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
    }, [x, y])

    return (
        <motion.div aria-hidden="true" style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-40 hidden md:block">
            <AnimatePresence>
                {cert && (
                    <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                        animate={{ opacity: 1, scale: 1, rotate: -3 }}
                        exit={{ opacity: 0, scale: 0.7, rotate: 4 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="absolute -top-32 left-8 w-[300px] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]"
                    >
                        <img src={cert.image} alt="" className="aspect-[16/11] w-full object-cover" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

function Related() {
    const [activeCert, setActiveCert] = useState(null)
    const [hovered, setHovered] = useState(null)
    const closeDialog = useCallback(() => setActiveCert(null), [])

    return (
        <section id="certifications" className="relative w-full px-6 py-24 md:py-36">
            <div id="others" className="absolute top-0" aria-hidden="true" />

            <div className="mx-auto w-full max-w-6xl">
                <SectionHeader index="03" tag="Credentials" title="Certifications & Honors">
                    Professional credentials in deep learning, transformer architectures, and algorithms.
                </SectionHeader>

                <ul className="border-t border-black/10 dark:border-white/10" onPointerLeave={() => setHovered(null)}>
                    {RelatedList.map((cert, index) => (
                        <CertRow
                            key={cert.id}
                            cert={cert}
                            index={index}
                            onHover={setHovered}
                            onPreview={() => {
                                setHovered(null)
                                setActiveCert(cert)
                            }}
                        />
                    ))}
                </ul>
            </div>

            <HoverPreview cert={activeCert ? null : hovered} />

            <AnimatePresence>
                {activeCert && <CertificateDialog cert={activeCert} onClose={closeDialog} />}
            </AnimatePresence>
        </section>
    )
}

export default Related
