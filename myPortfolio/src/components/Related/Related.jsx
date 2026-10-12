import { useState, useEffect, useRef, useCallback } from 'react'
import Card2 from '../Card/Card2'
import { RelatedList } from './RelatedList'
import SectionHeader from '../SectionHeader'
import { motion, AnimatePresence } from 'motion/react'

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
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/60 p-4 backdrop-blur-xs dark:bg-black/80 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="cert-dialog-title"
                className="flex max-h-[95vh] w-full max-w-[800px] flex-col gap-4 overflow-y-auto rounded-[10px] border border-[#EAEAEA] bg-white p-5 dark:border-[#27272A] dark:bg-[#18181A] md:max-h-[90vh] md:p-6"
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#A1A1AA]">{cert.category}</span>
                        <h3 id="cert-dialog-title" className="mt-1 font-serif text-xl font-normal leading-snug text-[#111111] dark:text-[#FBFBFA] md:text-2xl">
                            {cert.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-[#787774] dark:text-[#A1A1AA]">
                            {cert.issuer}
                            {cert.year && ` · ${cert.year}`}
                        </p>
                    </div>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close preview"
                        className="flex items-center justify-center rounded-[6px] border border-[#EAEAEA] bg-[#F7F6F3] p-1.5 text-[#787774] transition-colors hover:border-[#111111] hover:text-[#111111] dark:border-[#27272A] dark:bg-[#141416] dark:text-[#A1A1AA] dark:hover:border-[#FBFBFA] dark:hover:text-[#FBFBFA]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="flex w-full items-center justify-center overflow-hidden rounded-[8px] border border-[#EAEAEA] bg-[#F7F6F3] dark:border-[#27272A] dark:bg-[#141416]">
                    <img src={cert.image} alt={`${cert.title} certificate`} className="max-h-[58vh] max-w-full object-contain" />
                </div>

                {cert.description && <p className="text-xs leading-relaxed text-[#787774] dark:text-[#A1A1AA]">{cert.description}</p>}
            </motion.div>
        </motion.div>
    )
}

function Related() {
    const [activeCert, setActiveCert] = useState(null)
    const closeDialog = useCallback(() => setActiveCert(null), [])

    return (
        <section id="certifications" className="relative w-full px-6 py-20 md:py-28">
            <div id="others" className="absolute top-0" aria-hidden="true" />

            <div className="mx-auto w-full max-w-5xl">
                <SectionHeader tag="Credentials" title="Certifications & Honors">
                    Professional credentials in deep learning, transformer architectures, and algorithms.
                </SectionHeader>

                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {RelatedList.map((cert, index) => (
                        <motion.li
                            key={cert.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card2 {...cert} onPreview={() => setActiveCert(cert)} />
                        </motion.li>
                    ))}
                </ul>
            </div>

            <AnimatePresence>
                {activeCert && <CertificateDialog cert={activeCert} onClose={closeDialog} />}
            </AnimatePresence>
        </section>
    )
}

export default Related