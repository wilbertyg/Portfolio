import { motion } from 'motion/react'
import Profile from '../../assets/profile.jpg'
import Button from '../Button/Button'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import Socials from '../Socials'
import { EASE, Magnetic, SplitText } from '../fx'

const rise = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease: EASE, delay },
})

function PortraitRing() {
    const label = 'COMPUTER SCIENCE · ARTIFICIAL INTELLIGENCE · DATA SCIENCE · '
    return (
        <div className="relative grid size-[112px] shrink-0 place-items-center">
            <motion.svg
                viewBox="0 0 120 120"
                aria-hidden="true"
                className="absolute inset-0 size-full text-[#57534E] dark:text-[#A1A1AA]"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            >
                <defs>
                    <path id="portrait-ring" d="M60,60 m-50,0 a50,50 0 1,1 100,0 a50,50 0 1,1 -100,0" />
                </defs>
                <text className="fill-current font-mono text-[7.4px] tracking-[0.18em]">
                    <textPath href="#portrait-ring">{label}</textPath>
                </text>
            </motion.svg>
            <div className="size-[72px] overflow-hidden rounded-full">
                <img
                    src={Profile}
                    alt="Portrait of Wilbert Yang"
                    width="72"
                    height="72"
                    fetchPriority="high"
                    className="size-full rounded-full object-cover object-[center_20%]"
                />
            </div>
        </div>
    )
}

function About() {
    return (
        <section id="about" className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-6 pt-[46vh] pb-10 sm:pt-32 lg:justify-center lg:pb-16">
            <div className="flex max-w-[680px] flex-col items-start">
                <motion.div
                    {...rise(0.3)}
                    className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/50 px-3.5 py-1.5 font-mono text-[11px] text-[#57534E] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:text-[#A1A1AA]"
                >
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                    </span>
                    Open to ML &amp; data opportunities
                </motion.div>

                <h1 className="font-sans text-[clamp(3.75rem,13vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.065em] text-[#0B0B0F] dark:text-[#F4F4F5]">
                    <SplitText as="span" text="Wilbert" inView={false} delay={0.4} className="block" />
                    <SplitText as="span" text="Yang" inView={false} delay={0.55} className="block" />
                </h1>

                <motion.p {...rise(0.85)} className="mt-7 font-serif text-2xl leading-snug text-[#292524] italic sm:text-3xl dark:text-[#E4E4E7]">
                    Engineering{' '}
                    <span className="bg-gradient-to-r from-[#0891B2] via-[#7C3AED] to-[#DB2777] bg-clip-text text-transparent dark:from-[#67E8F9] dark:via-[#A78BFA] dark:to-[#F472B6]">
                        intelligent
                    </span>{' '}
                    systems that learn from the world.
                </motion.p>

                <motion.p {...rise(1)} className="mt-5 max-w-[520px] leading-[1.7] text-[#57534E] dark:text-[#A1A1AA]">
                    Computer Science graduate specializing in Artificial Intelligence and Data Science — building scalable machine
                    learning architectures and automated real-world solutions.
                </motion.p>

                <motion.div {...rise(1.15)} className="mt-9 flex flex-wrap items-center gap-3">
                    <Magnetic>
                        <Button
                            href={CV}
                            download
                            size="lg"
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            }
                        >
                            Download CV
                        </Button>
                    </Magnetic>
                    <Magnetic>
                        <Button href="#projects" variant="secondary" size="lg">
                            View Projects
                        </Button>
                    </Magnetic>
                </motion.div>
            </div>

            <motion.div
                {...rise(1.35)}
                className="mt-14 flex flex-col gap-6 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-white/10"
            >
                <div className="flex items-center gap-5">
                    <PortraitRing />
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#78716C] dark:text-[#71717A]">Location</dt>
                            <dd className="text-sm font-medium text-[#0B0B0F] dark:text-[#F4F4F5]">Indonesia</dd>
                        </div>
                        <div>
                            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#78716C] dark:text-[#71717A]">Focus</dt>
                            <dd className="text-sm font-medium text-[#0B0B0F] dark:text-[#F4F4F5]">AI / Machine Learning</dd>
                        </div>
                        <div className="col-span-2">
                            <dt className="sr-only">Connect</dt>
                            <dd>
                                <Socials />
                            </dd>
                        </div>
                    </dl>
                </div>

                <a
                    href="#skills"
                    className="group hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#57534E] sm:inline-flex dark:text-[#A1A1AA]"
                >
                    Scroll to explore
                    <span className="relative h-10 w-[22px] rounded-full border border-current/40">
                        <motion.span
                            className="absolute top-2 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current"
                            animate={{ y: [0, 14, 0], opacity: [1, 0.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </span>
                </a>
            </motion.div>
        </section>
    )
}

export default About
