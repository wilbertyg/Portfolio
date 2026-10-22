import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Profile from '../../assets/profile.jpg'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import Button from '../Button/Button'
import Socials from '../Socials'
import SectionHeader from '../SectionHeader'
import PixelArt from '../PixelArt'
import { ICONS } from '../Game/sprites'
import { SkillIcon } from '../Skills/SkillIcons'
import { ProjectList } from '../Projects/ProjectList'
import { RelatedList } from '../Related/RelatedList'
import { skillCategories } from '../Skills/SkillList'
import { win, slot, label } from '../styles'

const STATS = [
    ['Quests cleared', ProjectList.length],
    ['Trophies', RelatedList.length],
    ['Spells learned', new Set(skillCategories.flatMap((c) => c.skills)).size],
    ['Gold medals', RelatedList.filter((c) => c.category === 'Honors & Awards').length],
]

const EQUIPMENT = [
    ['Weapon', 'Python'],
    ['Shield', 'PyTorch'],
    ['Armor', 'Scikit-Learn'],
    ['Relic', 'Jupyter Notebooks'],
]

// Downsamples and posterizes the photo into a 48×64 sprite; click to toggle the real photo.
function PixelPortrait() {
    const ref = useRef(null)
    const [hd, setHd] = useState(false)

    useEffect(() => {
        const img = new Image()
        img.onload = () => {
            const c = ref.current
            if (!c) return
            const w = (c.width = 48)
            const h = (c.height = 64)
            const g = c.getContext('2d', { willReadFrequently: true })
            const sh = Math.min(img.height, (img.width * h) / w)
            const sw = (sh * w) / h
            g.drawImage(img, (img.width - sw) / 2, (img.height - sh) * 0.2, sw, sh, 0, 0, w, h)
            const d = g.getImageData(0, 0, w, h)
            for (let i = 0; i < d.data.length; i++) if (i % 4 !== 3) d.data[i] = Math.round(d.data[i] / 42) * 42
            g.putImageData(d, 0, 0)
        }
        img.src = Profile
    }, [])

    return (
        <button
            type="button"
            onClick={() => setHd((v) => !v)}
            aria-pressed={hd}
            aria-label="Show full-resolution photo of Wilbert Yang"
            className="group relative block aspect-[3/4] w-full overflow-hidden rounded-sm border-4 border-void bg-void"
        >
            <img
                src={Profile}
                alt=""
                width="300"
                height="400"
                className={`absolute inset-0 size-full object-cover object-[center_20%] transition-opacity duration-300 ${hd ? 'opacity-100' : 'opacity-0'}`}
            />
            <canvas ref={ref} className={`absolute inset-0 size-full [image-rendering:pixelated] transition-opacity duration-300 ${hd ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`absolute right-2 bottom-2 ${label} rounded-sm bg-void/80 px-2 py-1 text-[8px] text-gold`}>{hd ? '16-bit' : 'HD'} ▸</span>
        </button>
    )
}

function Bar({ name, value, color, text }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-8 ${label} text-gold`}>{name}</span>
            <span className="h-3.5 flex-1 rounded-sm border-2 border-void bg-void/70">
                <span
                    className={`block h-full ${color} shadow-[inset_0_-3px_0_rgb(0_0_0/0.25),inset_0_2px_0_rgb(255_255_255/0.4)]`}
                    style={{ width: `${value}%` }}
                />
            </span>
            <span className={`w-12 text-right ${label} text-[8px]`}>{text}</span>
        </div>
    )
}

function About() {
    const reduceMotion = useReducedMotion()
    const rise = (delay) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
    })

    return (
        <section id="about" tabIndex={-1} className="relative w-full px-4 py-20 outline-none sm:px-6 md:py-28">
            <div className="mx-auto max-w-6xl">
                <SectionHeader index="01" tag="Status" icon="heart" title="The Hero">
                    Every adventure needs a protagonist. Here&rsquo;s the character sheet.
                </SectionHeader>

                <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-8">
                    <motion.div {...rise(0)} className={`${win} flex flex-col gap-4 self-start p-4`}>
                        <PixelPortrait />
                        <div>
                            <p className="font-display text-sm leading-relaxed text-gold">Wilbert Yang</p>
                            <p className="text-lg text-white/80">Data Sage · AI / Machine Learning</p>
                        </div>
                        <div className="flex flex-col gap-2" aria-hidden="true">
                            <Bar name="HP" value={100} color="bg-heal" text="999" />
                            <Bar name="MP" value={100} color="bg-mp" text="∞" />
                            <Bar name="EXP" value={72} color="bg-exp" text="72%" />
                        </div>
                    </motion.div>

                    <div className="flex flex-col gap-6 lg:gap-8">
                        <motion.div {...rise(0.08)} className={`${win} p-5 sm:p-7`}>
                            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                                {[
                                    ['Name', 'Wilbert Yang'],
                                    ['Class', 'Computer Science Graduate'],
                                    ['Specialty', 'Artificial Intelligence & Data Science'],
                                    ['Home', 'Indonesia'],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex flex-col">
                                        <dt className={`${label} text-[9px] text-gold`}>{k}</dt>
                                        <dd className="text-xl leading-tight">{v}</dd>
                                    </div>
                                ))}
                                <div className="flex flex-col sm:col-span-2">
                                    <dt className={`${label} text-[9px] text-gold`}>Status</dt>
                                    <dd className="flex items-center gap-2 text-xl leading-tight text-heal">
                                        <span className="size-2.5 bg-heal motion-safe:animate-blink" aria-hidden="true" />
                                        Open to opportunities — recruiting party members
                                    </dd>
                                </div>
                            </dl>

                            <p className="mt-6 border-t-2 border-dashed border-white/25 pt-5 text-xl leading-snug text-white/90">
                                Specializing in Artificial Intelligence and Data Science — crafting scalable machine learning systems that turn raw
                                data into automated, real-world solutions.
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-4">
                                <Button href={CV} download icon={<PixelArt art={ICONS.scroll} className="h-3.5 w-auto" />}>
                                    Download CV
                                </Button>
                                <Button href="#projects" variant="secondary">
                                    Quest log ▸
                                </Button>
                                <Socials />
                            </div>
                        </motion.div>

                        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                            <motion.div {...rise(0.16)} className={`${win} p-5`}>
                                <h3 className={`${label} mb-3 text-gold`}>Stats</h3>
                                <dl className="flex flex-col gap-2">
                                    {STATS.map(([k, v]) => (
                                        <div key={k} className="flex items-baseline gap-2 text-xl">
                                            <dt>{k}</dt>
                                            <span className="flex-1 border-b-2 border-dotted border-white/30" aria-hidden="true" />
                                            <dd className="font-display text-sm text-gold">{v}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </motion.div>

                            <motion.div {...rise(0.24)} className={`${win} p-5`}>
                                <h3 className={`${label} mb-3 text-gold`}>Equipment</h3>
                                <dl className="flex flex-col gap-2">
                                    {EQUIPMENT.map(([k, v]) => (
                                        <div key={k} className="flex items-center gap-3">
                                            <dt className={`w-16 ${label} text-[8px] text-white/60`}>{k}</dt>
                                            <dd className="flex items-center gap-2.5 text-xl">
                                                <span className={`${slot} flex size-8 items-center justify-center bg-frame/90 p-1`}>
                                                    <SkillIcon name={v} className="size-5" />
                                                </span>
                                                {v}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About
