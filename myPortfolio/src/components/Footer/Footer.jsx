import Socials from '../Socials'

function Footer() {
    const scrollToTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    }

    return (
        <footer className="mt-16 w-full border-t border-[#EAEAEA] bg-[#FBFBFA] px-6 pt-16 pb-10 md:pt-20 md:pb-12">
            <div className="mx-auto flex max-w-5xl flex-col gap-10">
                <div className="flex flex-col items-start gap-6 border-b border-[#EAEAEA] pb-8 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-8 md:pb-10">
                    <div className="flex max-w-[500px] flex-col gap-2">
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#787774]">Get in touch</span>
                        <h2 className="font-serif text-3xl font-normal leading-tight text-[#111111] md:text-4xl">
                            Let&apos;s build something intelligent.
                        </h2>
                        <p className="text-sm leading-relaxed text-[#787774]">
                            Open to machine learning internships, technical collaborations, and research opportunities.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-3">
                        <a
                            href="mailto:ywilbert12@gmail.com"
                            className="inline-flex items-center gap-2 rounded-[6px] border border-[#111111] bg-[#111111] px-4 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#2A2A2A] active:scale-[0.98]"
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
                    <p className="font-mono text-xs text-[#A1A1A0]">© {new Date().getFullYear()} Wilbert Yang. All rights reserved.</p>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#EAEAEA] bg-white px-2.5 py-1 font-mono text-xs text-[#787774] transition-colors hover:border-[#111111] hover:text-[#111111] active:scale-[0.98]"
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
