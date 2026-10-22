import Socials from '../Socials'
import SectionHeader from '../SectionHeader'
import PixelArt, { Hand } from '../PixelArt'
import { ICONS } from '../Game/sprites'
import { playSfx } from '../Game/sfx'
import { win, label } from '../styles'

function Footer() {
    const toTitle = () => {
        playSfx('door')
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    }

    return (
        <footer id="contact" tabIndex={-1} className="relative z-10 w-full px-4 pt-20 pb-8 outline-none sm:px-6 md:pt-28">
            <div className="mx-auto max-w-6xl">
                <SectionHeader index="05" tag="Save Point" icon="letter" title="Save your progress?">
                    Open to machine learning internships, technical collaborations, and research opportunities.
                </SectionHeader>

                <div className="grid items-center gap-8 md:grid-cols-[220px_1fr] md:gap-12">
                    <div className="relative mx-auto flex flex-col items-center" aria-hidden="true">
                        <span className="absolute top-6 size-36 rounded-full bg-mp/30 blur-2xl motion-safe:animate-pulse" />
                        <PixelArt art={ICONS.gem} className="relative h-40 w-auto motion-safe:animate-float" />
                        <span className="mt-3 h-3 w-20 rounded-[50%] bg-ink/20 dark:bg-void/70" />
                    </div>

                    <div className={`${win} min-w-0 p-5 sm:p-7`}>
                        <p className="text-xl leading-snug sm:text-2xl">
                            A save crystal hums softly. <span className="text-gold">Record a message for Wilbert?</span>
                        </p>
                        <ul className="mt-5 flex flex-col gap-1" aria-label="Contact options">
                            <li>
                                <a href="mailto:ywilbert12@gmail.com" className="group flex items-center gap-3 rounded-sm px-2 py-3 hover:bg-white/10">
                                    <Hand />
                                    <span className={`${label} text-gold`}>Yes — send a letter</span>
                                    <span className="ml-auto hidden text-lg text-white/70 sm:inline">ywilbert12@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a href="#title" className="group flex items-center gap-3 rounded-sm px-2 py-3 hover:bg-white/10">
                                    <Hand />
                                    <span className={`${label} text-white/80`}>Not yet — keep exploring</span>
                                </a>
                            </li>
                        </ul>
                        <div className="mt-5 flex flex-wrap items-center gap-3 border-t-2 border-dashed border-white/25 pt-5">
                            <span className={`${label} text-[9px] text-white/60`}>Or warp to</span>
                            <Socials showLabels className="flex-wrap" />
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center gap-4 text-center md:mt-28">
                    <p className="font-display text-lg text-ink motion-safe:animate-blink sm:text-2xl dark:text-gold">Thanks for playing!</p>
                    <p className="text-lg text-ink-soft dark:text-white/60">
                        © {new Date().getFullYear()} Wilbert Yang · Crafted with React, Canvas &amp; Tailwind
                    </p>
                    <button
                        type="button"
                        onClick={toTitle}
                        className={`group mt-2 flex items-center gap-2 rounded-sm px-3 py-2 ${label} text-ink hover:bg-ink/10 focus-visible:outline-ink dark:text-white dark:hover:bg-white/10 dark:focus-visible:outline-gold`}
                    >
                        <Hand />▲ Return to title
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default Footer
