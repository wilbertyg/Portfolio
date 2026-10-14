import Socials from '../Socials'

function Footer() {
    const scrollToTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    }

    return (
        <footer className="mt-16 w-full border-t border-[#EAEAEA] bg-[#FBFBFA] px-6 pt-16 pb-10 dark:border-[#27272A] dark:bg-[#111112] md:pt-20 md:pb-12">
            <div className="mx-auto flex max-w-5xl flex-col gap-10">
                <div className="flex flex-col items-start gap-6 border-b border-[#EAEAEA] pb-8 dark:border-[#27272A] md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-8 md:pb-10">
                    <div className="flex max-w-[500px] flex-col gap-2">
                        <h2 className="font-sans text-2xl font-semibold leading-tight tracking-[-0.02em] text-balance text-[#111111] dark:text-[#FBFBFA] sm:text-3xl md:text-4xl">
                            Let’s build something intelligent.
                        </h2>
                        <p className="text-sm leading-relaxed text-[#71717A] dark:text-[#A1A1AA]">
                            Open to machine learning internships, technical collaborations, and research opportunities.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-3">
                        <a
                            href="mailto:ywilbert12@gmail.com"
                            className="inline-flex items-center gap-2 rounded-[6px] border border-[#111111] bg-[#111111] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#2A2A2A] active:scale-[0.98] dark:border-[#FBFBFA] dark:bg-[#FBFBFA] dark:text-[#111111] dark:hover:bg-[#E5E5E5]"
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <span>ywilbert12@gmail.com</span>
                        </a>
                        <Socials />
                    </div>
                </div>

                <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <p className="font-mono text-xs text-[#71717A] dark:text-[#A1A1AA]">© {new Date().getFullYear()} Wilbert Yang. All rights reserved.</p>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        aria-label="Scroll back to top"
                        className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#EAEAEA] bg-white px-2.5 py-1 font-mono text-xs text-[#71717A] transition-colors hover:border-[#111111] hover:text-[#111111] active:scale-[0.98] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#A1A1AA] dark:hover:border-[#FBFBFA] dark:hover:text-[#FBFBFA]"
                    >
                        <span>Back to top</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="18 15 12 9 6 15" />
                        </svg>
                    </button>
                </div>
            </div>
        </footer>
    )
}

export default Footer
