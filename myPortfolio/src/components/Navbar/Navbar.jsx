import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import Profile from '../../assets/profile.jpg'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { player } from '../../game/player'

const navItems = [
    { label: 'Character', id: 'about', key: '1' },
    { label: 'Skills', id: 'skills', key: '2' },
    { label: 'Quests', id: 'projects', key: '3' },
    { label: 'Trophies', id: 'certifications', key: '4' },
    { label: 'Guild', id: 'contact', key: '5' },
]

function ScrollIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
            <path d="M19 17V5a2 2 0 0 0-2-2H4" />
            <path d="M15 8h-5" />
            <path d="M15 12h-5" />
        </svg>
    )
}

function Navbar() {
    const [activeSection, setActiveSection] = useState(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { scrollYProgress } = useScroll()
    const journey = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 160
            let current = null
            for (let i = navItems.length - 1; i >= 0; i--) {
                const section = document.getElementById(navItems[i].id)
                if (section && section.offsetTop <= scrollPos) {
                    current = navItems[i].id
                    break
                }
            }
            setActiveSection(current)
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false)
                return
            }
            // RPG-style hotkeys: 1-5 jump to a menu entry
            const tag = e.target.tagName
            if (e.ctrlKey || e.metaKey || e.altKey || tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return
            if (document.querySelector('[aria-modal="true"]')) return
            const item = navItems.find((n) => n.key === e.key)
            if (item) document.getElementById(item.id)?.scrollIntoView()
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('keydown', handleKeyDown)
        handleScroll()
        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [mobileMenuOpen])

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-sm focus:border-2 focus:border-gold focus:bg-panel focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-ink"
            >
                Skip to main content
            </a>
            <nav
                className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-md border-2 border-gold-dim bg-panel/85 px-2.5 shadow-[0_0_0_1px_var(--color-void),0_12px_30px_-12px_rgb(0_0_0/0.7)] backdrop-blur-md"
                aria-label="Main"
            >
                {/* Player frame */}
                <a href="#top" className="group flex min-w-0 items-center gap-2.5" aria-label={`${player.name}, level ${player.level}. Back to title`}>
                    <span className="relative shrink-0">
                        <img src={Profile} alt="" width="36" height="36" className="size-9 rounded-full border-2 border-gold object-cover object-[center_20%]" />
                        <span className="absolute -right-1.5 -bottom-1 rounded-sm border border-gold bg-void px-1 font-pixel text-[9px] leading-tight text-gold">
                            {player.level}
                        </span>
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                        <span className="truncate font-display text-sm font-bold leading-none tracking-wide text-ink group-hover:text-gold">
                            {player.name}
                        </span>
                        <span className="flex items-center gap-1.5" aria-hidden="true">
                            <span className="font-pixel text-[9px] leading-none text-muted">JOURNEY</span>
                            <span className="h-1.5 w-20 overflow-hidden rounded-full border border-gold-dim bg-void/60 sm:w-28">
                                <motion.span style={{ scaleX: journey }} className="block h-full origin-left bg-linear-to-r from-xp to-ember" />
                            </span>
                        </span>
                    </span>
                </a>

                <ul className="hidden items-center gap-0.5 lg:flex">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    className={`group relative flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-150 ${
                                        isActive ? 'bg-gold/15 text-gold' : 'text-ink-soft hover:text-gold'
                                    }`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`text-[10px] text-gold transition-opacity ${isActive ? 'opacity-100 animate-blink' : 'opacity-0 group-hover:opacity-100'}`}
                                    >
                                        ▶
                                    </span>
                                    {item.label}
                                    <kbd className="rounded-[3px] border border-line px-1 font-pixel text-[9px] font-normal text-muted" aria-hidden="true">
                                        {item.key}
                                    </kbd>
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="hidden items-center gap-2 lg:flex">
                    <ThemeToggle showLabel />
                    <a
                        href={CV}
                        download
                        className="inline-flex items-center gap-1.5 rounded-sm border-2 border-gold bg-linear-to-b from-[#f9dc8c] to-[#c48a2c] px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#2a1a05] transition hover:brightness-110 active:translate-y-px"
                    >
                        <ScrollIcon />
                        <span>CV</span>
                    </a>
                </div>

                <div className="flex items-center gap-1.5 lg:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-sm border-2 border-gold-dim bg-panel/80 px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-ink transition-colors hover:border-gold"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {mobileMenuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-md border-2 border-gold-dim bg-panel/95 p-3 backdrop-blur-md lg:hidden"
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                aria-current={activeSection === item.id ? 'true' : undefined}
                                className="group flex items-center gap-3 rounded-sm px-3 py-3 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink-soft hover:bg-gold/10 hover:text-gold focus-visible:bg-gold/10 aria-[current=true]:text-gold"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span aria-hidden="true" className="text-gold opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-aria-[current=true]:opacity-100">
                                    ▶
                                </span>
                                {item.label}
                            </a>
                        ))}
                        <a
                            href={CV}
                            download
                            className="mt-2 flex items-center justify-center gap-2 rounded-sm border-2 border-gold bg-linear-to-b from-[#f9dc8c] to-[#c48a2c] p-3 font-display text-xs font-bold uppercase tracking-[0.12em] text-[#2a1a05] active:translate-y-px"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <ScrollIcon />
                            Download CV
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
