function SectionHeader({ tag, title, children, aside }) {
    return (
        <div className="mb-8 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
                {tag && (
                    <span className="mb-2 inline-block font-mono text-xs font-semibold uppercase tracking-wider text-[#787774] dark:text-[#A1A1AA]">
                        {tag}
                    </span>
                )}
                <h2 className="font-serif text-3xl font-normal leading-tight tracking-[-0.03em] text-[#111111] dark:text-[#FBFBFA] md:text-4xl">
                    {title}
                </h2>
                {children && <p className="mt-2 max-w-[620px] text-sm leading-relaxed text-[#787774] dark:text-[#A1A1AA]">{children}</p>}
            </div>
            {aside}
        </div>
    )
}

export default SectionHeader
