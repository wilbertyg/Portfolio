function Card({ title, description, image, url, category, tags = [], btnText = 'View Repository' }) {
    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-[#EAEAEA] bg-white transition-[border-color,transform] duration-200 hover:border-[#111111]">
            <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#EAEAEA] bg-[#F7F6F3]">
                <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {category && (
                    <span className="absolute top-3 left-3 rounded-full border border-[#EAEAEA] bg-white/95 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#111111] backdrop-blur-xs">
                        {category}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col justify-between gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                    <h3 className="font-sans text-base font-semibold leading-snug text-[#111111]">{title}</h3>
                    <p className="text-xs leading-relaxed text-[#787774]">{description}</p>
                </div>

                {tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                        {tags.map((tag) => (
                            <li key={tag} className="rounded-[4px] border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-0.5 font-mono text-[10px] text-[#787774]">
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="border-t border-[#EAEAEA] pt-3">
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#111111] transition-colors duration-150 hover:text-[#787774]"
                    >
                        <span>{btnText}</span>
                        <span className="sr-only">: {title} (opens in a new tab)</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </a>
                </div>
            </div>
        </article>
    )
}

export default Card