import { useState, useEffect, useRef, useCallback } from 'react'
import Card2 from '../Card/Card2'
import { RelatedList } from './RelatedList'
import SectionHeader from '../SectionHeader'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { playSfx } from '../Game/sfx'
import { win, label } from '../styles'

const years = [...new Set(RelatedList.map((c) => c.year))].sort((a, b) => b - a)

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
            className="fixed inset-0 z-[60] flex items-center justify-center bg-void/80 p-3 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cert-dialog-title"
                className={`${win} flex max-h-[95vh] w-full max-w-[820px] flex-col gap-4 overflow-y-auto p-4 md:max-h-[90vh] md:p-6`}
                initial={{ scaleY: 0.05, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0.05, opacity: 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className={`${label} text-[9px] text-gold`}>{cert.category}</span>
                        <h3 id="cert-dialog-title" className="mt-1 text-2xl leading-tight md:text-3xl">
                            {cert.title}
                        </h3>
                        <p className="mt-1 text-lg text-white/70">
                            {cert.issuer}
                            {cert.year && ` · ${cert.year}`}
                        </p>
                    </div>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className={`shrink-0 rounded-sm border-2 border-void bg-void/50 px-3 py-2 ${label} text-[9px] hover:bg-void`}
                    >
                        ✕ Esc
                    </button>
                </div>

                <div className="flex w-full items-center justify-center overflow-hidden rounded-sm border-4 border-void bg-void">
                    <img src={cert.image} alt={`${cert.title} certificate`} width="760" height="520" className="max-h-[58vh] max-w-full object-contain" />
                </div>

                {cert.description && <p className="text-xl leading-snug text-white/85">{cert.description}</p>}
            </motion.div>
        </motion.div>
    )
}

function Related() {
    const [activeCert, setActiveCert] = useState(null)
    const closeDialog = useCallback(() => {
        playSfx('cancel')
        setActiveCert(null)
    }, [])
    const reduceMotion = useReducedMotion()

    return (
        <section id="certifications" tabIndex={-1} className="relative w-full px-4 py-20 outline-none sm:px-6 md:py-28">
            <div id="others" className="absolute top-0" aria-hidden="true" />

            <div className="mx-auto max-w-6xl">
                <SectionHeader
                    index="04"
                    tag="Hall of Fame"
                    icon="trophy"
                    title="Trophies"
                    aside={
                        <div className={`${win} w-full shrink-0 px-4 py-3 sm:w-64`}>
                            <p className={`${label} flex justify-between text-[9px]`}>
                                <span>Unlocked</span>
                                <span className="text-gold">
                                    {RelatedList.length}/{RelatedList.length}
                                </span>
                            </p>
                            <span className="mt-2 block h-3.5 rounded-sm border-2 border-void bg-void/70">
                                <span className="block h-full w-full bg-gold shadow-[inset_0_-3px_0_rgb(0_0_0/0.25),inset_0_2px_0_rgb(255_255_255/0.4)]" />
                            </span>
                            <p className={`${label} mt-2 text-[8px] text-heal`}>100% complete</p>
                        </div>
                    }
                >
                    Certifications and honors earned along the way — deep learning, transformer architectures, algorithms, and the field.
                </SectionHeader>

                <div className="flex flex-col gap-10 md:gap-14">
                    {years.map((year) => (
                        <div key={year}>
                            <h3 className="mb-5 flex items-center gap-4 font-display text-sm text-ink-soft dark:text-gold">
                                <span className="h-1 flex-1 bg-current opacity-30" aria-hidden="true" />
                                {year}
                                <span className="h-1 flex-1 bg-current opacity-30" aria-hidden="true" />
                            </h3>
                            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {RelatedList.filter((c) => c.year === year).map((cert, index) => (
                                    <motion.li
                                        key={cert.id}
                                        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <Card2
                                            {...cert}
                                            onPreview={() => {
                                                playSfx('confirm')
                                                setActiveCert(cert)
                                            }}
                                        />
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>{activeCert && <CertificateDialog cert={activeCert} onClose={closeDialog} />}</AnimatePresence>
        </section>
    )
}

export default Related
