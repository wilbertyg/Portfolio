import { useState, useEffect } from 'react'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Certifications', id: 'certifications' },
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

function Navbar() {
    const [activeSection, setActiveSection] = useState('about')
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
            const scrollPos = window.scrollY + 120
            for (let i = navItems.length - 1; i >= 0; i--) {
                const section = document.getElementById(navItems[i].id)
                if (section && section.offsetTop <= scrollPos) {
                    setActiveSection(navItems[i].id)
                    break
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        handleScroll()
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 border-b border-[#EAEAEA] backdrop-blur-md transition-colors duration-200 dark:border-[#27272A] ${
                scrolled
                    ? 'bg-white/95 dark:bg-[#111112]/95'
                    : 'bg-[#FBFBFA]/90 dark:bg-[#111112]/90'
            }`}
        >
            <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6" aria-label="Main">
                <a href="#about" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[#111111] dark:text-[#FBFBFA]">
                    <span>Wilbert Yang</span>
                </a>

                <div className="hidden items-center gap-1 rounded-full border border-[#EAEAEA] bg-[#F7F6F3] p-1 dark:border-[#27272A] dark:bg-[#18181A] md:flex">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                aria-current={isActive ? 'true' : undefined}
                                className={`rounded-full px-3.5 py-1 text-xs transition-colors duration-150 ${
                                    isActive
                                        ? 'border border-[#EAEAEA] bg-white font-semibold text-[#111111] dark:border-[#2E2E32] dark:bg-[#222225] dark:text-[#FBFBFA]'
                                        : 'font-medium text-[#787774] hover:text-[#111111] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]'
                                }`}
                            >
                                {item.label}
                            </a>
                        )
                    })}
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />
                    <a
                        href={CV}
                        download
                        className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#EAEAEA] bg-white px-3 py-1.5 text-xs font-semibold text-[#111111] transition-all hover:border-[#111111] hover:bg-[#F7F6F3] active:scale-[0.98] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#FBFBFA] dark:hover:border-[#3F3F46] dark:hover:bg-[#222225]"
                    >
                        <DownloadIcon />
                        <span>CV</span>
                    </a>
                </div>

                <div className="flex items-center gap-1.5 md:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        className="flex items-center justify-center rounded-[6px] p-2 text-[#111111] transition-colors hover:bg-[#F7F6F3] dark:text-[#FBFBFA] dark:hover:bg-[#18181A]"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            {mobileMenuOpen ? (
                                <>
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </>
                            ) : (
                                <>
                                    <line x1="4" y1="7" x2="20" y2="7" />
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <line x1="4" y1="17" x2="20" y2="17" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div id="mobile-menu" className="flex flex-col gap-2 border-b border-[#EAEAEA] bg-white px-6 pt-4 pb-6 dark:border-[#27272A] dark:bg-[#18181A] md:hidden">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="border-b border-[#EAEAEA] py-2.5 text-sm font-medium text-[#787774] last-of-type:border-b-0 hover:text-[#111111] dark:border-[#27272A] dark:text-[#A1A1AA] dark:hover:text-[#FBFBFA]"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                    <a
                        href={CV}
                        download
                        className="mt-2 rounded-[6px] bg-[#111111] p-2.5 text-center text-xs font-semibold text-white active:scale-[0.98] dark:bg-[#FBFBFA] dark:text-[#111111]"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Download CV
                    </a>
                </div>
            )}
        </header>
    )
}

export default Navbar