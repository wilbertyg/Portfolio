function Card2({ title, issuer, year, category, image, onPreview }) {
    return (
        <button
            type="button"
            onClick={onPreview}
            className="group flex h-full w-full flex-col overflow-hidden rounded-[10px] border border-[#EAEAEA] bg-white text-left transition-[border-color,transform] duration-200 hover:border-[#111111]"
        >
            <div className="relative aspect-[16/10.5] w-full overflow-hidden border-b border-[#EAEAEA] bg-[#F7F6F3]">
                <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/30 opacity-0 backdrop-blur-xs transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#EAEAEA] bg-white px-3 py-1.5 font-mono text-[11px] font-semibold text-[#111111]">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="11" y1="8" x2="11" y2="14" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        View Credential
                    </span>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-1.5 p-4">
                <div className="flex items-center justify-between gap-2">
                    {category && <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#787774]">{category}</span>}
                    {year && <span className="font-mono text-[10px] text-[#A1A1A0]">{year}</span>}
                </div>
                <h3 className="font-sans text-sm font-semibold leading-snug text-[#111111]">{title}</h3>
                {issuer && <p className="text-xs text-[#787774]">{issuer}</p>}
            </div>
        </button>
    )
}

export default Card2