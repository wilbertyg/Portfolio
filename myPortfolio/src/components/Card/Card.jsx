import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { SpotlightLayer } from '../fx'

function Card({ title, description, image, url, category, tags = [], btnText = 'View Repository', index = 0, total = 0 }) {
    const reduce = useReducedMotion()
    const px = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 })
    const py = useSpring(useMotionValue(0), { stiffness: 160, damping: 18 })
    const rotateY = useTransform(px, [-0.5, 0.5], [-7, 7])
    const rotateX = useTransform(py, [-0.5, 0.5], [6, -6])

    const onMove = (e) => {
        const el = e.currentTarget
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
        if (reduce || e.pointerType !== 'mouse') return
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
    }
    const onLeave = () => {
        px.set(0)
        py.set(0)
    }

    return (
        <motion.article
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            style={{ rotateX, rotateY, transformPerspective: 1200 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-black/10 bg-white/55 p-3 backdrop-blur-xl transition-[border-color,box-shadow] duration-500 hover:border-black/20 hover:shadow-[0_30px_80px_-30px_rgba(124,58,237,0.45)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20 dark:hover:shadow-[0_30px_80px_-30px_rgba(167,139,250,0.5)]"
        >
            <SpotlightLayer />
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#E7E5E4] dark:bg-[#111118]">
                <img
                    src={image}
                    alt=""
                    loading="lazy"
                    width="640"
                    height="400"
                    className="size-full object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0 opacity-70 transition-opacity duration-500 group-hover:opacity-40" />
                {category && (
                    <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md">
                        {category}
                    </span>
                )}
                <span className="absolute right-4 bottom-3 font-mono text-[11px] text-white/80 tabular-nums">
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
            </div>

            <div className="relative flex flex-1 flex-col justify-between gap-6 px-3 pt-6 pb-3">
                <div className="flex flex-col gap-2.5">
                    <h3 className="font-sans text-2xl font-semibold leading-tight tracking-[-0.035em] text-[#0B0B0F] dark:text-[#F4F4F5]">{title}</h3>
                    <p className="text-sm leading-relaxed text-[#57534E] dark:text-[#A1A1AA]">{description}</p>
                </div>

                {tags.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
                        {tags.map((tag) => (
                            <li key={tag} className="rounded-full border border-black/10 px-2.5 py-1 font-mono text-[10px] text-[#57534E] dark:border-white/10 dark:text-[#A1A1AA]">
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}

                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center justify-between gap-3 border-t border-black/10 pt-4 text-sm font-semibold text-[#0B0B0F] dark:border-white/10 dark:text-[#F4F4F5]"
                >
                    <span>{btnText}</span>
                    <span className="sr-only">: {title} (opens in a new tab)</span>
                    <span className="grid size-10 place-items-center rounded-full border border-black/10 transition-all duration-500 group-hover:border-transparent group-hover:bg-[#0B0B0F] group-hover:text-white dark:border-white/15 dark:group-hover:bg-[#F4F4F5] dark:group-hover:text-[#0B0B0F]">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            className="transition-transform duration-500 group-hover:rotate-45"
                        >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </span>
                </a>
            </div>
        </motion.article>
    )
}

export default Card
