import { useState } from 'react'
import { skillCategories } from './SkillList'
import TornadoHelix from './TornadoHelix'
import SectionHeader from '../SectionHeader'

function Skills() {
    const [activeStrand, setActiveStrand] = useState(null)

    return (
        <section id="skills" className="relative w-full bg-white px-6 py-20 md:py-28 border-y border-[#EAEAEA]">
            <div className="mx-auto w-full max-w-5xl">
                <SectionHeader
                    tag="Capabilities"
                    title="Technical Expertise"
                    aside={
                        <div
                            role="group"
                            aria-label="Filter by helix strand"
                            className="flex items-center gap-1.5 self-start rounded-full border border-[#EAEAEA] bg-[#F7F6F3] p-1 md:self-auto"
                        >
                            <button
                                type="button"
                                onClick={() => setActiveStrand(null)}
                                className={`rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                    activeStrand === null
                                        ? 'border border-[#EAEAEA] bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                                        : 'text-[#787774] hover:text-[#111111]'
                                }`}
                            >
                                All Strands
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveStrand(activeStrand === 'α' ? null : 'α')}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                    activeStrand === 'α'
                                        ? 'border border-[#EAEAEA] bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                                        : 'text-[#787774] hover:text-[#111111]'
                                }`}
                            >
                                <span className="size-1.5 rounded-full bg-[#1F6C9F]" />
                                Strand α
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveStrand(activeStrand === 'β' ? null : 'β')}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] font-medium transition-colors duration-150 ${
                                    activeStrand === 'β'
                                        ? 'border border-[#EAEAEA] bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
                                        : 'text-[#787774] hover:text-[#111111]'
                                }`}
                            >
                                <span className="size-1.5 rounded-full bg-[#346538]" />
                                Strand β
                            </button>
                        </div>
                    }
                >
                </SectionHeader>

                {/* Main Double Helix Tornado Container */}
                <div className="overflow-hidden rounded-[10px] border border-[#EAEAEA] bg-white">
                    <TornadoHelix activeStrand={activeStrand} />
                </div>

                {/* Accessible Content for Assistive Tech */}
                <div className="sr-only">
                    {skillCategories.map((cat) => (
                        <div key={cat.id}>
                            <h3>{cat.title}</h3>
                            <ul>
                                {cat.skills.map((s) => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills