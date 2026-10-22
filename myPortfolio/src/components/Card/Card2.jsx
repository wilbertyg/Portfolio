import PixelArt from '../PixelArt'
import { ICONS } from '../Game/sprites'
import { win, slot, label } from '../styles'

// Trophy tier by credential type.
const TIERS = {
    'Honors & Awards': { name: 'Gold', y: '#F8D048', w: '#FFF4C0' },
    'Professional Certification': { name: 'Silver', y: '#C8D0E0', w: '#FFFFFF' },
    'Internship Certification': { name: 'Silver', y: '#C8D0E0', w: '#FFFFFF' },
}
const BRONZE = { name: 'Bronze', y: '#D88A48', w: '#F8C898' }

function Card2({ title, issuer, category, year, image, onPreview }) {
    const tier = TIERS[category] ?? BRONZE
    return (
        <button
            type="button"
            onClick={onPreview}
            aria-label={`Inspect trophy: ${title}`}
            className={`${win} group flex h-full w-full flex-col gap-3 p-3 text-left transition-transform duration-150 hover:-translate-y-1`}
        >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border-4 border-void bg-void">
                <img src={image} alt="" loading="lazy" width="400" height="250" className="size-full object-cover" />
                <span
                    className={`absolute inset-0 flex items-center justify-center bg-void/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${label} text-gold`}
                >
                    ▸ Inspect
                </span>
            </div>
            <div className="flex flex-1 items-start gap-3">
                <span className={`${slot} flex size-12 shrink-0 items-center justify-center`}>
                    <PixelArt art={ICONS.trophy} colors={{ y: tier.y, w: tier.w }} className="h-7 w-auto" />
                </span>
                <div className="min-w-0">
                    <p className={`${label} text-[8px] text-white/60`}>
                        {tier.name} · {category}
                    </p>
                    <h3 className="text-xl leading-tight">{title}</h3>
                    <p className="text-base text-white/70">
                        {issuer}
                        {year && ` · ${year}`}
                    </p>
                </div>
            </div>
            <span className={`${label} text-[8px] text-heal`}>★ Unlocked</span>
        </button>
    )
}

export default Card2
