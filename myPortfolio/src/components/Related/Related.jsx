import { useState, useEffect, useRef, useCallback } from 'react'
import { RelatedList } from './RelatedList'
import SectionHeader from '../SectionHeader'
import Panel from '../Panel'
import { motion, AnimatePresence } from 'motion/react'
import { XP_REWARD } from '../../game/player'

const rarities = {
    'Honors & Awards': { name: 'Legendary', text: 'text-ember', border: 'border-ember', bg: 'bg-ember' },
    'Professional Certification': { name: 'Epic', text: 'text-arcane', border: 'border-arcane', bg: 'bg-arcane' },
    'Internship Certification': { name: 'Epic', text: 'text-arcane', border: 'border-arcane', bg: 'bg-arcane' },
    'Course Certificate': { name: 'Rare', text: 'text-mp', border: 'border-mp', bg: 'bg-mp' },
    'Bootcamp Certificate': { name: 'Uncommon', text: 'text-emerald', border: 'border-emerald', bg: 'bg-emerald' },
}
const rarityOf = (cert) => rarities[cert.category] ?? rarities['Course Certificate']

function TrophyIcon({ className }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}

function CertificateDialog({ cert, onClose }) {
    const closeRef = useRef(null)
    const rarity = rarityOf(cert)

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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cert-dialog-title"
                className="w-full max-w-[820px]"
                initial={{ scale: 0.92, opacity: 0, y: 16 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
            >
                <Panel className="flex max-h-[92vh] flex-col gap-4 overflow-y-auto bg-panel/95 p-5 md:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <span className={`grid size-12 shrink-0 place-items-center rounded-full border-2 ${rarity.border} ${rarity.text} bg-void/60 shadow-[0_0_24px_-4px_currentColor]`}>
                                <TrophyIcon className="size-6" />
                            </span>
                            <div>
                                <p className="font-pixel text-xs uppercase tracking-[0.25em] text-gold">Achievement unlocked</p>
                                <h3 id="cert-dialog-title" className="mt-1 font-display text-xl font-bold leading-snug tracking-wide text-ink md:text-2xl">
                                    {cert.title}
                                </h3>
                                <p className="mt-0.5 text-sm text-muted">
                                    <span className={rarity.text}>{rarity.name}</span> · {cert.issuer}
                                    {cert.year && ` · ${cert.year}`}
                                </p>
                            </div>
                        </div>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close preview"
                            className="flex shrink-0 items-center justify-center rounded-sm border-2 border-gold-dim bg-panel-2 p-1.5 text-muted transition-colors hover:border-gold hover:text-ink"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex w-full items-center justify-center overflow-hidden rounded-sm border-2 border-gold-dim bg-void/60">
                        <img src={cert.image} alt={`${cert.title} certificate`} width="760" height="520" className="max-h-[58vh] max-w-full object-contain" />
                    </div>

                    {cert.description && <p className="leading-relaxed text-ink-soft">{cert.description}</p>}
                </Panel>
            </motion.div>
        </motion.div>
    )
}

function Related() {
    const [activeCert, setActiveCert] = useState(null)
    const closeDialog = useCallback(() => setActiveCert(null), [])

    return (
        <section id="certifications" data-zone="Hall of Trophies" className="relative w-full px-4 py-24 sm:px-6 md:py-32">
            <div id="others" className="absolute top-0" aria-hidden="true" />

            <div className="mx-auto w-full max-w-6xl">
                <SectionHeader
                    tag="Chapter IV"
                    title="Hall of Trophies"
                    aside={
                        <div className="flex min-w-56 flex-col gap-1.5 self-start rounded-sm border-2 border-gold-dim bg-panel/80 px-3 py-2 backdrop-blur-sm md:self-auto">
                            <span className="flex justify-between font-pixel text-xs text-ink-soft">
                                <span>Achievements</span>
                                <span className="text-gold">
                                    {RelatedList.length}/{RelatedList.length}
                                </span>
                            </span>
                            <span className="h-2 overflow-hidden rounded-full border border-gold-dim bg-void/60" aria-hidden="true">
                                <span className="block h-full w-full bg-linear-to-r from-xp to-ember" />
                            </span>
                        </div>
                    }
                >
                    Professional credentials in deep learning, transformer architectures, and algorithms. Select one to inspect it.
                </SectionHeader>

                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {RelatedList.map((cert, index) => {
                        const rarity = rarityOf(cert)
                        return (
                            <motion.li
                                key={cert.id}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-20px' }}
                                transition={{ duration: 0.35, delay: index * 0.05 }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveCert(cert)}
                                    aria-label={`Inspect achievement: ${cert.title}`}
                                    className="group block h-full w-full text-left"
                                >
                                    <Panel as="span" className="flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-200 group-hover:-translate-y-1 group-hover:border-gold group-focus-visible:border-gold">
                                        <span className="relative aspect-[16/9] w-full overflow-hidden border-b-2 border-gold-dim bg-void">
                                            <img
                                                src={cert.image}
                                                alt=""
                                                loading="lazy"
                                                width="400"
                                                height="225"
                                                className="size-full object-cover opacity-80 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                                            />
                                            {/* Shine sweep on hover */}
                                            <span
                                                aria-hidden="true"
                                                className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/30 to-transparent transition-[left] duration-700 group-hover:left-[120%]"
                                            />
                                            <span className={`absolute top-3 left-3 rounded-sm border ${rarity.border} bg-void/80 px-2 py-0.5 font-pixel text-[10px] uppercase tracking-widest ${rarity.text}`}>
                                                {rarity.name}
                                            </span>
                                        </span>
                                        <span className="flex flex-1 items-start gap-3 p-4">
                                            <span className={`grid size-10 shrink-0 place-items-center rounded-full border-2 ${rarity.border} ${rarity.text} bg-void/50`}>
                                                <TrophyIcon className="size-5" />
                                            </span>
                                            <span className="flex min-w-0 flex-1 flex-col gap-1">
                                                <span className="font-display text-sm font-bold leading-snug tracking-wide text-ink">{cert.title}</span>
                                                <span className="text-sm text-muted">
                                                    {cert.issuer} · {cert.year}
                                                </span>
                                            </span>
                                        </span>
                                        <span className="flex items-center justify-between border-t border-line px-4 py-2 font-pixel text-[11px] uppercase tracking-widest">
                                            <span className="text-xp">+{XP_REWARD.trophy} EXP</span>
                                            <span className="text-muted transition-colors group-hover:text-gold">Inspect ▶</span>
                                        </span>
                                    </Panel>
                                </button>
                            </motion.li>
                        )
                    })}
                </ul>
            </div>

            <AnimatePresence>
                {activeCert && <CertificateDialog cert={activeCert} onClose={closeDialog} />}
            </AnimatePresence>
        </section>
    )
}

export default Related
