import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Socials from '../Socials'
import { EASE, Magnetic, Reveal, SplitText } from '../fx'

function LocalTime() {
    const format = () =>
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())
    const [time, setTime] = useState(format)
    useEffect(() => {
        const id = setInterval(() => setTime(format()), 1000)
        return () => clearInterval(id)
    }, [])
    return <time className="tabular-nums">{time} WIB</time>
}

function Footer() {
    const scrollToTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    }

    return (
        <footer id="contact" className="relative z-10 w-full px-6 pt-32 pb-10 md:pt-48">
            <div className="mx-auto flex max-w-6xl flex-col gap-20">
                <div className="flex flex-col items-center text-center">
                    <Reveal y={12} className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#57534E] dark:text-[#A1A1AA]">
                        <span className="text-[#7C3AED] dark:text-[#C4B5FD]">04</span>
                        <span className="h-px w-10 bg-gradient-to-r from-[#7C3AED] to-transparent dark:from-[#C4B5FD]" aria-hidden="true" />
                        <span>Contact</span>
                    </Reveal>

                    <h2 className="max-w-4xl font-sans text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-[#0B0B0F] dark:text-[#F4F4F5]">
                        <SplitText text="Let’s build something" className="block" />
                        <Reveal delay={0.25} as="span" className="mt-[0.08em] block pb-[0.1em] font-serif font-normal italic tracking-[-0.03em]">
                            <span className="bg-gradient-to-r from-[#0891B2] via-[#7C3AED] to-[#DB2777] bg-clip-text pr-2 text-transparent dark:from-[#67E8F9] dark:via-[#A78BFA] dark:to-[#F472B6]">
                                intelligent.
                            </span>
                        </Reveal>
                    </h2>

                    <Reveal delay={0.35}>
                        <p className="mt-8 max-w-[480px] leading-relaxed text-[#57534E] dark:text-[#A1A1AA]">
                            Open to machine learning internships, technical collaborations, and research opportunities.
                        </p>
                    </Reveal>

                    <Reveal delay={0.45} className="mt-12 flex flex-col items-center gap-6">
                        <Magnetic strength={0.25}>
                            <a
                                href="mailto:ywilbert12@gmail.com"
                                className="group relative inline-flex items-center gap-4 overflow-hidden rounded-full bg-[#0B0B0F] py-3 pr-3 pl-7 text-base font-semibold text-white shadow-[0_20px_60px_-15px_rgba(124,58,237,0.6)] transition-shadow duration-500 hover:shadow-[0_25px_80px_-10px_rgba(124,58,237,0.8)] sm:text-lg dark:bg-[#F4F4F5] dark:text-[#0B0B0F] dark:shadow-[0_20px_60px_-15px_rgba(167,139,250,0.6)]"
                            >
                                <span>ywilbert12@gmail.com</span>
                                <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-[#0891B2] via-[#7C3AED] to-[#DB2777] text-white transition-transform duration-500 group-hover:rotate-[-45deg] dark:from-[#67E8F9] dark:via-[#A78BFA] dark:to-[#F472B6] dark:text-[#05050A]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </span>
                            </a>
                        </Magnetic>
                        <Socials />
                    </Reveal>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: EASE }}
                    className="grid grid-cols-1 items-center gap-4 border-t border-black/10 pt-6 font-mono text-xs text-[#57534E] sm:grid-cols-3 dark:border-white/10 dark:text-[#A1A1AA]"
                >
                    <p>© {new Date().getFullYear()} Wilbert Yang. All rights reserved.</p>
                    <p className="flex items-center gap-2 sm:justify-center">
                        <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                        Indonesia · <LocalTime />
                    </p>
                    <div className="sm:text-right">
                        <button
                            type="button"
                            onClick={scrollToTop}
                            aria-label="Scroll back to top"
                            className="group inline-flex items-center gap-2 rounded-full border border-black/10 px-3.5 py-2 transition-colors hover:border-black/30 hover:text-[#0B0B0F] dark:border-white/10 dark:hover:border-white/30 dark:hover:text-[#F4F4F5]"
                        >
                            <span>Back to top</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5">
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        </button>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}

export default Footer
