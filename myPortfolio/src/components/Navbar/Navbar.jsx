import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import PixelArt, { Hand } from '../PixelArt'
import { HERO, ICONS } from '../Game/sprites'
import { playSfx, setSfxEnabled, useSfxEnabled } from '../Game/sfx'
import { win, hudBtn, label } from '../styles'

const navItems = [
    { label: 'Status', id: 'about' },
    { label: 'Spells', id: 'skills' },
    { label: 'Quests', id: 'projects' },
    { label: 'Trophies', id: 'certifications' },
    { label: 'Save', id: 'contact' },
]

function SoundToggle() {
    const on = useSfxEnabled()
    return (
        <button
            type="button"
            onClick={() => setSfxEnabled(!on)}
            aria-pressed={on}
            aria-label="Sound effects"
            title={on ? 'Sound effects on' : 'Sound effects off'}
            className={hudBtn}
        >
            <PixelArt art={on ? ICONS.soundOn : ICONS.soundOff} className="h-4 w-auto" />
        </button>
    )
}

// Scroll progress rendered as an EXP bar along the bottom of the HUD.
function ExpBar() {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
    return (
        <span className="absolute inset-x-3 -bottom-1 h-1.5 rounded-sm bg-void" aria-hidden="true">
            <motion.span style={{ scaleX }} className="block h-full origin-left rounded-sm bg-exp" />
        </span>
    )
}

function Navbar() {
    const [activeSection, setActiveSection] = useState('title')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 160
            let current = 'title'
            for (const item of navItems) {
                const section = document.getElementById(item.id)
                if (section && section.offsetTop <= scrollPos) current = item.id
            }
            setActiveSection(current)
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) setMobileMenuOpen(false)
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
        <header className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-4 sm:pt-3">
            <a
                href="#main-content"
                className={`sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] ${win} focus:px-4 focus:py-2 ${label}`}
            >
                Skip to main content
            </a>
            <nav aria-label="Main" className={`${win} relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-2 sm:px-3`}>
                <a href="#title" className="flex items-center gap-3 rounded-sm pr-2" onClick={() => playSfx('select')}>
                    <span className="flex size-11 items-center justify-center rounded-sm border-2 border-void bg-void/40">
                        <PixelArt art={HERO.down[0]} className="h-9 w-auto" />
                    </span>
                    <span className="flex flex-col gap-1">
                        <span className={`${label} text-gold`}>Wilbert</span>
                        <span className={`${label} hidden text-[8px] whitespace-nowrap text-white/70 min-[400px]:block`}>
                            Lv.<span className="text-white">CS</span> · AI Mage
                        </span>
                    </span>
                </a>

                <ul className="hidden items-center gap-0.5 md:flex">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <li key={item.id}>
                                <a
                                    href={`#${item.id}`}
                                    aria-current={isActive ? 'true' : undefined}
                                    onClick={() => playSfx('select')}
                                    className={`group flex items-center gap-1.5 rounded-sm px-2 py-2 ${label} transition-colors lg:px-2.5 ${
                                        isActive ? 'text-gold' : 'text-white hover:text-gold'
                                    }`}
                                >
                                    <Hand active={isActive} />
                                    {item.label}
                                </a>
                            </li>
                        )
                    })}
                </ul>

                <div className="flex items-center gap-1.5">
                    <SoundToggle />
                    <ThemeToggle />
                    <a
                        href={CV}
                        download
                        onClick={() => playSfx('confirm')}
                        className={`hidden h-10 items-center gap-2 rounded-sm border-2 border-void bg-gold px-3 text-void shadow-[inset_-3px_-3px_0_#C88A18,inset_3px_3px_0_#FFF4C0] ${label} focus-visible:outline-white md:flex`}
                    >
                        <PixelArt art={ICONS.scroll} className="h-3.5 w-auto" />
                        CV
                    </a>
                    <button
                        type="button"
                        className={`${hudBtn} md:hidden`}
                        onClick={() => {
                            playSfx(mobileMenuOpen ? 'cancel' : 'select')
                            setMobileMenuOpen((open) => !open)
                        }}
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        <span className={`${label} text-[8px]`}>{mobileMenuOpen ? '✕' : 'Menu'}</span>
                    </button>
                </div>
                <ExpBar />
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        id="mobile-menu"
                        initial={{ opacity: 0, scaleY: 0.1 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0.1 }}
                        transition={{ duration: 0.14, ease: 'easeOut' }}
                        className={`${win} mt-3 ml-auto flex w-64 origin-top flex-col p-2 md:hidden`}
                    >
                        {navItems.map((item) => (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                className={`group flex items-center gap-3 rounded-sm px-3 py-3 ${label} ${activeSection === item.id ? 'text-gold' : 'text-white'}`}
                                onClick={() => {
                                    playSfx('confirm')
                                    setMobileMenuOpen(false)
                                }}
                            >
                                <Hand active={activeSection === item.id} />
                                {item.label}
                            </a>
                        ))}
                        <a
                            href={CV}
                            download
                            className={`mt-2 flex items-center justify-center gap-2 rounded-sm border-2 border-void bg-gold p-3 text-void ${label}`}
                            onClick={() => {
                                playSfx('confirm')
                                setMobileMenuOpen(false)
                            }}
                        >
                            <PixelArt art={ICONS.scroll} className="h-3.5 w-auto" />
                            Download CV
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar
