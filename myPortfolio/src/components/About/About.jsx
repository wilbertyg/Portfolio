import Profile from '../../assets/profile.jpg'
import Button from '../Button/Button'
import CV from '../../assets/CV_Wilbert Yang.pdf'
import Socials from '../Socials'

function TrophyLogo() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
            <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
            <path d="M6 3h12v7a6 6 0 0 1-12 0V3z" />
            <path d="M12 16v4" />
            <path d="M8 20h8" />
            <polyline points="10 8 9 9 10 10" />
            <polyline points="14 8 15 9 14 10" />
        </svg>
    )
}

function NvidiaLogo() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8.948 7.377c-.15 0-.294.01-.433.023-1.892.176-3.37 1.63-3.666 3.473-.327 2.036.93 4.025 2.923 4.639 1.993.614 4.148-.28 5.034-2.088.163-.332.257-.698.274-1.076.04-.897-.247-1.782-.81-2.482-.82-1.018-2.072-1.614-3.376-1.614l.054 1.125c.954 0 1.871.437 2.47 1.18.43.535.65 1.209.62 1.892-.014.288-.086.567-.21.82-.676 1.38-2.32 2.062-3.84 1.593-1.52-.468-2.479-1.986-2.23-3.54.226-1.408 1.353-2.518 2.796-2.651.107-.01.216-.017.33-.017v-1.125zm3.176-2.336c-.47-.03-1.018-.041-1.62-.041-3.69 0-6.85 2.508-7.73 6.06-.82 3.32.74 6.75 3.77 8.28 3.03 1.53 6.74.84 8.94-1.69 1.13-1.3 1.77-2.94 1.8-4.66.03-1.85-.62-3.6-1.8-4.94-1.33-1.52-3.33-2.4-5.36-2.4l.07 1.13c1.7 0 3.37.74 4.48 2.01 1 1.14 1.55 2.62 1.53 4.19-.02 1.45-.57 2.85-1.53 3.94-1.86 2.14-5 2.72-7.56 1.42-2.56-1.3-3.89-4.2-3.19-7 .74-2.99 3.4-5.11 6.51-5.11.51 0 .97.01 1.37.03l.28-1.28zm2.4-2.041c-.93-.05-1.97-.08-3.08-.08-4.96 0-9.28 3.19-10.74 7.78C-.02 15.01 2.05 19.64 6.01 21.6c3.96 1.96 8.84 1.05 11.83-2.2 1.6-1.74 2.51-3.99 2.56-6.36.05-2.53-.88-4.96-2.53-6.82-1.95-2.21-4.85-3.48-7.87-3.48l.08 1.13c2.68 0 5.25 1.12 6.98 3.08 1.47 1.66 2.3 3.82 2.25 6.07-.05 2.11-.86 4.11-2.28 5.66-2.66 2.89-7 3.7-10.53 1.95-3.53-1.75-5.38-5.87-4.43-9.7C1.19 7.42 5.03 4.58 9.44 4.58c.99 0 1.91.03 2.75.07l.33-1.65z" />
        </svg>
    )
}

function BinusLogo() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
    )
}

function GdscLogo() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="7 8 3 12 7 16" />
            <polyline points="17 8 21 12 17 16" />
            <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
    )
}

const highlights = [
    {
        logo: <TrophyLogo />,
        badgeBg: 'bg-[#FBF3DB] text-[#956400]',
        heading: '1st Place Winner',
        sub: 'TECHFEST 2024 Competitive Programming',
    },
    {
        logo: <NvidiaLogo />,
        badgeBg: 'bg-[#EDF3EC] text-[#346538]',
        heading: 'NVIDIA Certified',
        sub: 'Deep Learning & NLP Transformers',
    },
    {
        logo: <BinusLogo />,
        badgeBg: 'bg-[#E1F3FE] text-[#1F6C9F]',
        heading: 'BINUS University',
        sub: 'CS / Artificial Intelligence',
    },
    {
        logo: <GdscLogo />,
        badgeBg: 'bg-[#FDEBEC] text-[#9F2F2D]',
        heading: 'Community Activist',
        sub: 'BINUS DSC Education & Dev',
    },
]

function About() {
    return (
        <section id="about" className="mx-auto w-full max-w-5xl px-6 pt-28 pb-16 md:pt-36 md:pb-20">
            <div className="mb-16 flex flex-col-reverse items-start gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
                <div className="flex flex-1 flex-col items-start gap-5">
                    {/* Status Pill with Muted Pastel Green */}


                    {/* Editorial Serif Heading */}
                    <h1 className="font-serif text-5xl font-normal leading-[1.08] tracking-[-0.03em] text-[#111111] dark:text-[#FBFBFA] sm:text-6xl">
                        Wilbert Yang
                    </h1>

                    <p className="text-lg font-medium text-[#787774] dark:text-[#A1A1AA] sm:text-xl">
                        Computer Science Graduate <span className="mx-1 text-[#DCDCDA] dark:text-[#3F3F46]" aria-hidden="true">·</span> Artificial Intelligence
                    </p>

                    <p className="max-w-[580px] leading-[1.65] text-[#2F3437] dark:text-[#D4D4D8]">
                        Specializing in Artificial Intelligence, seeking an AI Engineer, Data Scientist or related role
                        to apply strong technical fundamentals, automation skills, and collaborative problem-solving to real-world engineering problems.
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
                        <span className="font-mono text-xs uppercase tracking-wider text-[#787774] dark:text-[#A1A1AA]">Connect</span>
                        <Socials />
                    </div>
                </div>

                <div className="w-full max-w-[260px] shrink-0 lg:w-[280px] lg:max-w-none">
                    <div className="group flex flex-col gap-3 rounded-[10px] border border-[#EAEAEA] bg-white p-3 dark:border-[#27272A] dark:bg-[#18181A]">
                        <div className="aspect-square w-full overflow-hidden rounded-[8px] bg-[#F7F6F3] dark:bg-[#141416]">
                            <img
                                src={Profile}
                                alt="Portrait of Wilbert Yang"
                                className="size-full object-cover object-[center_20%] transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                        </div>
                        <dl className="flex items-center justify-around rounded-[6px] border border-[#EAEAEA] bg-[#F7F6F3] px-2 py-1.5 dark:border-[#27272A] dark:bg-[#141416]">
                            <div className="flex flex-col items-center gap-0.5">
                                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#787774] dark:text-[#A1A1AA]">Location</dt>
                                <dd className="text-xs font-medium text-[#111111] dark:text-[#FBFBFA]">Indonesia</dd>
                            </div>
                            <div className="h-5 w-px bg-[#EAEAEA] dark:bg-[#27272A]" aria-hidden="true" />
                            <div className="flex flex-col items-center gap-0.5">
                                <dt className="font-mono text-[10px] uppercase tracking-wider text-[#787774] dark:text-[#A1A1AA]">Focus</dt>
                                <dd className="text-xs font-medium text-[#111111] dark:text-[#FBFBFA]">AI / Machine Learning</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Highlights Grid with Authentic Logos (Zero Emojis) */}
            {/* <ul className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {highlights.map((h) => (
                    <li
                        key={h.heading}
                        className="flex items-start gap-3.5 rounded-[8px] border border-[#EAEAEA] bg-white p-4 transition-colors duration-150 hover:border-[#111111]"
                    >
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-[6px] border border-[#EAEAEA] ${h.badgeBg}`}>
                            {h.logo}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-sans text-sm font-semibold text-[#111111]">{h.heading}</span>
                            <span className="text-xs leading-snug text-[#787774]">{h.sub}</span>
                        </div>
                    </li>
                ))}
            </ul> */}
        </section>
    )
}

export default About