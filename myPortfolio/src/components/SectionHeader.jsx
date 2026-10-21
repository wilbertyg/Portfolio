import { Reveal, SplitText } from './fx'

function SectionHeader({ index, tag, title, children, aside }) {
    return (
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="max-w-2xl">
                <Reveal y={12} className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#57534E] dark:text-[#A1A1AA]">
                    {index && <span className="text-[#7C3AED] dark:text-[#C4B5FD]">{index}</span>}
                    <span className="h-px w-10 bg-gradient-to-r from-[#7C3AED] to-transparent dark:from-[#C4B5FD]" aria-hidden="true" />
                    {tag && <span>{tag}</span>}
                </Reveal>
                <SplitText
                    as="h2"
                    text={title}
                    className="block font-sans text-4xl font-semibold leading-[1.02] tracking-[-0.045em] text-balance text-[#0B0B0F] dark:text-[#F4F4F5] sm:text-5xl md:text-6xl"
                />
                {children && (
                    <Reveal delay={0.15} y={16}>
                        <p className="mt-5 max-w-[560px] text-base leading-relaxed text-[#57534E] dark:text-[#A1A1AA]">{children}</p>
                    </Reveal>
                )}
            </div>
            {aside && <Reveal delay={0.2} y={16}>{aside}</Reveal>}
        </div>
    )
}

export default SectionHeader
