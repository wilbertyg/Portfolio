function SectionHeader({ tag, title, children, aside }) {
    return (
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between md:gap-8">
            <div>
                {tag && (
                    <span className="mb-3 flex items-center gap-2 font-pixel text-xs uppercase tracking-[0.25em] text-gold">
                        <span aria-hidden="true" className="size-1.5 rotate-45 bg-gold" />
                        {tag}
                        <span aria-hidden="true" className="h-px w-10 bg-linear-to-r from-gold to-transparent" />
                    </span>
                )}
                <h2 className="font-display text-3xl font-bold leading-tight tracking-wide text-balance text-ink drop-shadow-[0_2px_12px_rgb(0_0_0/0.35)] sm:text-4xl md:text-5xl">
                    {title}
                </h2>
                {children && <p className="mt-3 max-w-[620px] leading-relaxed text-ink-soft">{children}</p>}
            </div>
            {aside}
        </div>
    )
}

export default SectionHeader
