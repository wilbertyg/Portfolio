import Panel from '../Panel'
import Socials from '../Socials'

const choices = [
    { label: 'Send a raven', detail: 'ywilbert12@gmail.com', href: 'mailto:ywilbert12@gmail.com' },
    { label: 'Visit the GitHub archives', detail: 'github.com/wilbertyg', href: 'https://github.com/wilbertyg', external: true },
    { label: 'Meet at the LinkedIn tavern', detail: 'Wilbert Yang', href: 'https://www.linkedin.com/in/wilbert-yang-bb6515251/', external: true },
]

function Footer() {
    const scrollToTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    }

    return (
        <footer id="contact" data-zone="The Guild Hall" className="relative z-10 w-full px-4 pt-24 pb-10 sm:px-6 md:pt-32">
            <div className="mx-auto flex max-w-4xl flex-col gap-10">
                <div className="text-center">
                    <span className="mb-3 flex items-center justify-center gap-2 font-pixel text-xs uppercase tracking-[0.25em] text-gold">
                        <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                        Final Chapter
                        <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                    </span>
                    <h2 className="font-display text-3xl font-bold tracking-wide text-balance text-ink drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:text-4xl md:text-5xl">
                        Join the Party
                    </h2>
                </div>

                <Panel className="p-5 pt-7 sm:p-8 sm:pt-9">
                    <span className="absolute -top-3.5 left-5 rounded-sm border-2 border-gold-dim bg-panel-2 px-3 py-0.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-gold">
                        Guild Master
                    </span>
                    <p className="text-lg leading-relaxed text-ink sm:text-xl">
                        A new party is forming. Wilbert is open to{' '}
                        <strong className="text-gold">machine learning internships</strong>, technical collaborations, and research
                        opportunities. Will you recruit him?
                    </p>

                    <ul className="mt-6 flex flex-col gap-1 border-t border-line pt-4">
                        {choices.map((c) => (
                            <li key={c.label}>
                                <a
                                    href={c.href}
                                    {...(c.external && { target: '_blank', rel: 'noopener noreferrer' })}
                                    className="group flex flex-col gap-0.5 rounded-sm px-3 py-3 transition-colors hover:bg-gold/10 focus-visible:bg-gold/10 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <span className="flex items-center gap-3 font-display text-base font-bold tracking-wide text-ink group-hover:text-gold">
                                        <span aria-hidden="true" className="text-gold opacity-0 transition-opacity group-hover:animate-blink group-hover:opacity-100 group-focus-visible:opacity-100">
                                            ▶
                                        </span>
                                        {c.label}
                                    </span>
                                    <span className="pl-7 font-pixel text-xs text-muted sm:pl-0">
                                        {c.detail}
                                        {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line px-3 pt-5">
                        <span className="font-pixel text-xs uppercase tracking-wider text-muted">Other spells</span>
                        <Socials />
                    </div>
                </Panel>

                <div className="flex flex-col-reverse items-center gap-4 text-center sm:flex-row sm:justify-between">
                    <p className="font-pixel text-xs text-muted">
                        © {new Date().getFullYear()} Wilbert Yang · Thanks for playing
                    </p>
                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-2 rounded-sm border-2 border-gold-dim bg-panel/80 px-3 py-1.5 font-pixel text-xs uppercase tracking-widest text-ink-soft backdrop-blur-sm transition-colors hover:border-gold hover:text-gold active:translate-y-px"
                    >
                        Return to title
                        <span aria-hidden="true">▲</span>
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default Footer
