import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { EASE } from '../fx'

const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
    { label: 'Contact', id: 'contact' },
]

function DownloadIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    )
}

function Logo() {
    return (
        <a href="#about" className="group flex items-center gap-2.5 rounded-full pr-2 text-sm font-semibold tracking-tight text-[#0B0B0F] dark:text-[#F4F4F5]">
            <span className="relative grid size-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#0891B2] via-[#7C3AED] to-[#DB2777] text-xs font-bold text-white transition-transform duration-500 group-hover:rotate-[360deg] dark:from-[#67E8F9] dark:via-[#A78BFA] dark:to-[#F472B6] dark:text-[#05050A]">
                W
            </span>
            <span className="hidden sm:inline">Wilbert Yang</span>
        </a>
    )
}

function Navbar() {
    const [activeSection, setActiveSection] = useState('about')
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { scrollYProgress } = useScroll()
    const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
            const scrollPos = window.scrollY + window.innerHeight * 0.4
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
            if (atBottom) return setActiveSection(navItems[navItems.length - 1].id)
            for (let i = navItems.length - 1; i >= 0; i--) {
                const section = document.getElementById(navItems[i].id)
                if (section && section.getBoundingClientRect().top + window.scrollY <= scrollPos) {
                    setActiveSection(navItems[i].id)
                    break
                }
            }
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('keydown', handleKeyDown)
        handleScroll()
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [mobileMenuOpen])

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <motion.div
                aria-hidden="true"
                style={{ scaleX: progress }}
                className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-[#0891B2] via-[#7C3AED] to-[#DB2777] dark:from-[#67E8F9] dark:via-[#A78BFA] dark:to-[#F472B6]"
            />
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-[#0B0B0F] focus:shadow-md dark:focus:bg-[#111118] dark:focus:text-[#F4F4F5]"
            >
                Skip to main content
            </a>

            <motion.nav
                aria-label="Main"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                className={`mx-4 mt-4 flex items-center justify-between gap-2 rounded-full border p-1.5 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 sm:mx-auto sm:max-w-fit ${
                    scrolled || mobileMenuOpen
                        ? 'border-black/10 bg-[#F4F3EF]/75 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.25)] dark:border-white/10 dark:bg-[#0A0A12]/70 dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]'
                        : 'border-transparent bg-transparent'
                }`}
            >
                <Logo />

                <ul className="hidden items-center md:flex">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={`relative block rounded-full px-3.5 py-2 text-xs font-medium transition-colors duration-300 ${
                                        isActive
                                            ? 'text-[#0B0B0F] dark:text-[#F4F4F5]'
                                            : 'text-[#57534E] hover:text-[#0B0B0F] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="navActive"
                                            className="absolute inset-0 rounded-full bg-black/[0.06] dark:bg-white/[0.09]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                        />
                                    )}
                                    <span className="relative">{item.label}</span>
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    <a
                        href={CV}
                        download
                        className="hidden items-center gap-1.5 rounded-full bg-[#0B0B0F] px-4 py-2 text-xs font-semibold text-white transition-transform duration-300 hover:scale-[1.04] active:scale-[0.97] dark:bg-[#F4F4F5] dark:text-[#0B0B0F] md:inline-flex"
                    >
                        <DownloadIcon />
                        <span>CV</span>
                    </a>
                    <button
                        type="button"
                        className="grid size-9 place-items-center rounded-full text-[#0B0B0F] transition-colors hover:bg-black/5 dark:text-[#F4F4F5] dark:hover:bg-white/10 md:hidden"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        <span className="relative block h-3 w-5" aria-hidden="true">
                            <span className={`absolute left-0 h-[1.5px] w-5 rounded bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-1/2 rotate-45' : 'top-0'}`} />
                            <span className={`absolute left-0 h-[1.5px] w-5 rounded bg-current transition-all duration-300 ${mobileMenuOpen ? 'top-1/2 -rotate-45' : 'top-full'}`} />
                        </span>
                    </button>
                </div>
            </motion.nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ clipPath: 'circle(0% at 100% 0%)' }}
                        animate={{ clipPath: 'circle(150% at 100% 0%)' }}
                        exit={{ clipPath: 'circle(0% at 100% 0%)' }}
                        transition={{ duration: 0.7, ease: EASE }}
                        className="fixed inset-0 -z-10 flex flex-col justify-between bg-[#F4F3EF]/95 px-6 pt-28 pb-10 backdrop-blur-2xl dark:bg-[#05050A]/95 md:hidden"
                    >
                        <ul className="flex flex-col gap-1">
                            {navItems.map((item, i) => (
                                <motion.li
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.06 }}
                                >
                                    <a
                                        href={`#${item.id}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-baseline gap-4 py-2 text-4xl font-semibold tracking-[-0.04em] text-[#0B0B0F] dark:text-[#F4F4F5]"
                                    >
                                        <span className="font-mono text-xs font-normal tracking-normal text-[#7C3AED] dark:text-[#C4B5FD]">0{i + 1}</span>
                                        {item.label}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                        <motion.a
                            href={CV}
                            download
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0B0B0F] p-4 text-sm font-semibold text-white dark:bg-[#F4F4F5] dark:text-[#0B0B0F]"
                        >
                            <DownloadIcon />
                            Download CV
                        </motion.a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
