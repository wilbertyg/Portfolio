import Profile from '../../assets/profile.jpg'
import Button from '../Button/Button'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import Socials from '../Socials'

function About() {
    return (
        <section id="about" className="mx-auto w-full max-w-5xl px-6 pt-20 pb-12 md:pt-24 md:pb-16">
            <div className="flex flex-col-reverse items-start gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="flex flex-1 flex-col items-start gap-5">
                    {/* Sans Display Heading with Satoshi and text-balance */}
                    <h1 className="font-sans text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#111111] dark:text-[#FBFBFA] sm:text-5xl lg:text-6xl text-balance">
                        Wilbert Yang
                    </h1>

                    <p className="text-lg font-medium text-[#787774] dark:text-[#A1A1AA] sm:text-xl">
                        Computer Science Graduate <span className="mx-1 text-[#DCDCDA] dark:text-[#3F3F46]" aria-hidden="true">·</span> Artificial Intelligence
                    </p>

                    <p className="max-w-[580px] leading-[1.65] text-[#2F3437] dark:text-[#D4D4D8]">
                        Specializing in Artificial Intelligence and Data Science to build scalable machine learning architectures and automated real-world solutions.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button
                            href={CV}
                            download
                            variant="primary"
                            icon={
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                            }
                        >
                            Download CV
                        </Button>
                        <Button href="#projects" variant="secondary">View Projects</Button>
                    </div>

                    <div className="mt-1 flex items-center gap-3">
                        <span className="font-mono text-xs uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA]">Connect</span>
                        <Socials />
                    </div>
                </div>

                <div className="w-full max-w-[260px] shrink-0 lg:w-[280px] lg:max-w-none">
                    <div className="group flex flex-col gap-3 rounded-[10px] border border-[#EAEAEA] bg-white p-3 dark:border-[#27272A] dark:bg-[#18181A]">
                        <div className="aspect-square w-full overflow-hidden rounded-[8px] bg-[#F7F6F3] dark:bg-[#141416]">
                            <img
                                src={Profile}
                                alt="Portrait of Wilbert Yang"
                                width="280"
                                height="280"
                                fetchpriority="high"
                                className="size-full object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </div>
                        <dl className="flex items-center justify-around rounded-[6px] border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-1.5 dark:border-[#27272A] dark:bg-[#141416]">
                            <div className="flex flex-col items-center gap-0.5">
                                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">Location</dt>
                                <dd className="text-xs font-medium text-[#111111] dark:text-[#FBFBFA]">Indonesia</dd>
                            </div>
                            <div className="h-5 w-px bg-[#EAEAEA] dark:bg-[#27272A]" aria-hidden="true" />
                            <div className="flex flex-col items-center gap-0.5">
                                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#52525B] dark:text-[#A1A1AA]">Focus</dt>
                                <dd className="text-xs font-medium text-[#111111] dark:text-[#FBFBFA]">AI / Machine Learning</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About