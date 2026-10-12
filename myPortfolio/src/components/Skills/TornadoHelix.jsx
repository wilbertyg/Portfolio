import { useEffect, useRef, useState, useMemo } from 'react'
import { SkillIcon } from './SkillIcons'
import { skillCategories } from './SkillList'

// Dynamically derive technical skills from SkillList.js (single source of truth)
const TECHNICAL_SKILLS = skillCategories.flatMap((category) => category.skills)

// Geometric parameters (compact spacing)
const ITEMS_PER_STRAND = 38 // 0 to 37 indices per strand
const R_CYLINDER = 540 // 3D cylinder radius in px (compacted from 620px)
const DY = 130 // vertical tier distance in px (reduced from 168.33px for tighter gap)
const DTHETA = 34.0 // helical angular step in degrees per tier
const TOTAL_HEIGHT = ITEMS_PER_STRAND * DY // 4940px wrap cycle
const HALF_HEIGHT = TOTAL_HEIGHT / 2
const VISIBLE_Y_CUTOFF = 960 // culling boundary for performance
const AUTO_SPEED = 28 // continuous autonomous pace in pixels/second

function TornadoHelix({ activeStrand }) {
    const containerRef = useRef(null)
    const stageRef = useRef(null)
    const itemElementsRef = useRef([])

    // Motion states
    const [isPaused, setIsPaused] = useState(false)
    const [scaleFactor, setScaleFactor] = useState(1)
    const [dragActive, setDragActive] = useState(false)

    // Physics references
    const progressYRef = useRef(0)
    const rotOffsetRef = useRef(0)
    const velocityYRef = useRef(0)
    const velocityRotRef = useRef(0)
    const isDraggingRef = useRef(false)
    const dragStartYRef = useRef(0)
    const dragStartXRef = useRef(0)
    const dragStartProgressYRef = useRef(0)
    const dragStartRotRef = useRef(0)
    const lastPointerYRef = useRef(0)
    const lastPointerXRef = useRef(0)
    const lastTimeRef = useRef(0)
    const animFrameIdRef = useRef(null)

    // Generate 76 items: 38 items for Strand α (phase 0) + 38 items for Strand β (phase 180)
    const items = useMemo(() => {
        const list = []
        const phases = [
            { phase: 0, strand: 'α', strandColor: 'bg-[#1F6C9F]' },
            { phase: 180, strand: 'β', strandColor: 'bg-[#346538]' },
        ]

        phases.forEach(({ phase, strand, strandColor }) => {
            for (let i = 0; i < ITEMS_PER_STRAND; i++) {
                const skillName = TECHNICAL_SKILLS[(i + (phase === 180 ? 7 : 0)) % TECHNICAL_SKILLS.length]
                list.push({
                    id: `${strand}-${i}`,
                    index: i,
                    phase,
                    strand,
                    strandColor,
                    name: skillName,
                })
            }
        })
        return list
    }, [])

    // Responsive scaling to fit mobile, tablet, and desktop viewports
    useEffect(() => {
        const updateScale = () => {
            const w = window.innerWidth
            if (w < 480) {
                setScaleFactor(0.48)
            } else if (w < 640) {
                setScaleFactor(0.60)
            } else if (w < 1024) {
                setScaleFactor(0.80)
            } else {
                setScaleFactor(1.0)
            }
        }
        updateScale()
        window.addEventListener('resize', updateScale)
        return () => window.removeEventListener('resize', updateScale)
    }, [])

    // Primary 60/120 FPS hardware-accelerated autonomous animation loop
    useEffect(() => {
        // Accessibility: honor prefers-reduced-motion
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let prefersReduced = mediaQuery.matches
        const handleMediaChange = (e) => {
            prefersReduced = e.matches
        }
        mediaQuery.addEventListener('change', handleMediaChange)

        let lastFrameTime = performance.now()

        const applyTransforms = (currentTime) => {
            const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.1)
            lastFrameTime = currentTime

            // Physics updates
            if (!isDraggingRef.current) {
                // Decay flick momentum smoothly
                if (Math.abs(velocityYRef.current) > 0.1) {
                    progressYRef.current += velocityYRef.current * (dt * 60)
                    velocityYRef.current *= 0.94
                } else if (!isPaused && !prefersReduced) {
                    // Continuous slow, smooth, autonomous progression (never halts on hover)
                    progressYRef.current += AUTO_SPEED * dt
                }

                if (Math.abs(velocityRotRef.current) > 0.05) {
                    rotOffsetRef.current += velocityRotRef.current * (dt * 60)
                    velocityRotRef.current *= 0.94
                }
            }

            const currentProg = progressYRef.current
            const currentRotOffset = rotOffsetRef.current

            // Update each card directly on DOM for zero layout thrashing
            items.forEach((item, idx) => {
                const el = itemElementsRef.current[idx]
                if (!el) return

                // Base Y position along the helix column
                const baseY = item.index * DY

                // Wrap-around modulo math centered at Y = 0
                let y = (baseY + currentProg + HALF_HEIGHT) % TOTAL_HEIGHT
                if (y < 0) y += TOTAL_HEIGHT
                y -= HALF_HEIGHT

                const absY = Math.abs(y)

                if (absY > VISIBLE_Y_CUTOFF) {
                    // Cull off-screen items cleanly without scale(0)
                    el.style.visibility = 'hidden'
                    el.style.opacity = '0'
                    el.style.transform = `translate(-50%, -50%) translate3d(0px, ${y.toFixed(1)}px, -1200px) scale(0.95, 0.95)`
                    return
                }

                // Rotational angle along helix
                const relIndex = y / DY
                const rotY = -(relIndex * DTHETA) + item.phase + currentRotOffset
                const rad = (rotY * Math.PI) / 180

                // 3D Cartesian coordinates on cylinder perimeter
                const x = R_CYLINDER * Math.sin(rad)
                const z = -R_CYLINDER * (1 - Math.cos(rad))
                const cosTheta = Math.cos(rad)

                // Subtle scale tapering near the top and bottom apex
                let scale = 1 - (absY / 9500)
                if (absY > 750) {
                    const taper = (absY - 750) / 210
                    scale *= Math.max(0.75, 1 - taper)
                }

                // Depth-based spatial opacity on pure white canvas
                // Front items (cosTheta = 1, z = 0): opacity 1.0
                // Back items (cosTheta = -1, z = -2R): opacity ~0.38
                const depthOpacity = 0.38 + 0.62 * ((cosTheta + 1) / 2)

                // Stacking order: front items (+Z) on top
                const zIndex = Math.round(1000 + z + (1 - absY / 1000) * 80)

                // Strand filter highlights
                const isItemDimmed = Boolean(activeStrand && activeStrand !== item.strand)

                // Direct DOM style assignment (GPU-only properties)
                el.style.visibility = 'inherit'
                el.style.opacity = isItemDimmed ? '0.12' : depthOpacity.toFixed(3)
                el.style.zIndex = zIndex
                el.style.filter = isItemDimmed ? 'grayscale(100%)' : 'none'
                el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)}, ${scale.toFixed(4)})`
            })

            animFrameIdRef.current = requestAnimationFrame(applyTransforms)
        }

        animFrameIdRef.current = requestAnimationFrame(applyTransforms)
        return () => {
            if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current)
            mediaQuery.removeEventListener('change', handleMediaChange)
        }
    }, [items, activeStrand, isPaused])

    // Pointer gesture interaction handlers (Drag & Swipe only; scroll-wheel completely removed)
    const handlePointerDown = (e) => {
        isDraggingRef.current = true
        setDragActive(true)
        dragStartYRef.current = e.clientY
        dragStartXRef.current = e.clientX
        lastPointerYRef.current = e.clientY
        lastPointerXRef.current = e.clientX
        dragStartProgressYRef.current = progressYRef.current
        dragStartRotRef.current = rotOffsetRef.current
        lastTimeRef.current = performance.now()
        velocityYRef.current = 0
        velocityRotRef.current = 0

        if (e.target && e.target.setPointerCapture) {
            try {
                e.target.setPointerCapture(e.pointerId)
            } catch {
                // ignore
            }
        }
    }

    const handlePointerMove = (e) => {
        if (!isDraggingRef.current) return

        const deltaY = e.clientY - dragStartYRef.current
        const deltaX = e.clientX - dragStartXRef.current

        // Real-time drag updates
        progressYRef.current = dragStartProgressYRef.current + deltaY * 1.35
        rotOffsetRef.current = dragStartRotRef.current + deltaX * 0.25

        const now = performance.now()
        const dt = Math.max(1, now - lastTimeRef.current)
        const instantVy = ((e.clientY - lastPointerYRef.current) / dt) * 16
        const instantVx = ((e.clientX - lastPointerXRef.current) / dt) * 16

        velocityYRef.current = instantVy * 0.7
        velocityRotRef.current = instantVx * 0.15

        lastPointerYRef.current = e.clientY
        lastPointerXRef.current = e.clientX
        lastTimeRef.current = now
    }

    const handlePointerUp = () => {
        isDraggingRef.current = false
        setDragActive(false)
    }

    return (
        <div
            ref={containerRef}
            aria-label="Interactive 3D Tornado Helix showcasing technical skills"
            className={`group relative h-[520px] w-full overflow-hidden select-none bg-white transition-colors duration-200 dark:bg-[#111112] sm:h-[640px] lg:h-[740px] ${
                dragActive ? 'cursor-grabbing' : 'cursor-grab'
            }`}
        >
            {/* Subtle Vertical Eye-Axis Center Hairline */}
            <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#EAEAEA] to-transparent dark:via-[#27272A]" />

            {/* Top Atmospheric Header Controls (Minimalist Editorial Styling) */}
            <div className="absolute top-4 inset-x-5 z-30 flex items-center justify-between text-xs pointer-events-none md:inset-x-6">
                <div className="flex items-center gap-2 pointer-events-auto">
                    <span className="h-3 w-px bg-[#EAEAEA] dark:bg-[#27272A]" />
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-[#F7F6F3] px-2.5 py-0.5 font-mono text-[10px] text-[#111111] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#FBFBFA]">
                        <span className="size-1.5 rounded-full bg-[#1F6C9F]" />
                        Strand α
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-[#F7F6F3] px-2.5 py-0.5 font-mono text-[10px] text-[#111111] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#FBFBFA]">
                        <span className="size-1.5 rounded-full bg-[#346538]" />
                        Strand β
                    </span>
                </div>

                <div className="flex items-center gap-2.5 pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => setIsPaused((p) => !p)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEAEA] bg-white px-3 py-1 font-mono text-[10px] font-medium text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-colors hover:bg-[#F7F6F3] active:scale-[0.98] dark:border-[#27272A] dark:bg-[#18181A] dark:text-[#FBFBFA] dark:hover:bg-[#222225]"
                    >
                        <span
                            className={`size-1.5 rounded-full ${
                                isPaused ? 'bg-[#956400]' : 'bg-[#346538]'
                            }`}
                        />
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <span className="hidden sm:inline-block font-mono text-[10px] text-[#787774] dark:text-[#A1A1AA]">
                        Autonomous flow
                    </span>
                </div>
            </div>

            {/* 3D Perspective Viewport */}
            <div
                className="absolute inset-0 flex items-center justify-center [perspective:1400px]"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
            >
                {/* Scaled 3D Stage Root */}
                <div
                    ref={stageRef}
                    style={{
                        transform: `scale(${scaleFactor})`,
                        transformStyle: 'preserve-3d',
                    }}
                    className="relative size-0 origin-center"
                >
                    {/* 3D Tornado List */}
                    <div
                        data-3d-tornado-list=""
                        className="helix_list relative size-0 [transform-style:preserve-3d]"
                    >
                        {items.map((item, index) => {
                            const isLit = Boolean(activeStrand && activeStrand === item.strand)

                            return (
                                <div
                                    key={item.id}
                                    ref={(el) => {
                                        itemElementsRef.current[index] = el
                                    }}
                                    data-3d-tornado-item=""
                                    className="helix_item will-change-transform absolute top-0 left-0 [transform-style:preserve-3d]"
                                    data-index={item.index}
                                    data-phase={item.phase}
                                    style={{
                                        translate: 'none',
                                        rotate: 'none',
                                        scale: 'none',
                                        zIndex: 500,
                                        opacity: 1,
                                        visibility: 'inherit',
                                        filter: 'none',
                                        transform:
                                            'translate(-50%, -50%) translate3d(0px, 0px, 0px) rotateY(0deg) scale(1, 1)',
                                    }}
                                >
                                    {/* Minimalist Flat Card: Scaled 1.5x showing ONLY Skill Logo & Name */}
                                    <div
                                        draggable="false"
                                        className={`group/card relative flex h-[105px] w-[310px] items-center gap-4.5 rounded-[16px] border bg-white px-4.5 py-3.5 select-none sm:h-[116px] sm:w-[354px] sm:gap-5 sm:px-5 sm:py-4 transition-colors duration-150 dark:bg-[#18181A] ${
                                            isLit
                                                ? 'border-[#111111] ring-1 ring-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.06)] dark:border-[#FBFBFA] dark:ring-[#FBFBFA]'
                                                : 'border-[#EAEAEA] hover:border-[#111111] shadow-[0_1px_3px_rgba(0,0,0,0.02)] dark:border-[#27272A] dark:hover:border-[#3F3F46]'
                                        }`}
                                    >
                                        {/* Skill Logo */}
                                        <div className="flex size-14 sm:size-16 shrink-0 items-center justify-center rounded-[12px] border border-[#EAEAEA] bg-[#F7F6F3] dark:border-[#27272A] dark:bg-[#141416]">
                                            <SkillIcon name={item.name} className="size-7 sm:size-8" />
                                        </div>

                                        {/* Skill Name */}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-sans text-[16px] sm:text-[18px] font-medium text-[#111111] tracking-tight dark:text-[#FBFBFA]">
                                                {item.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Seamless Boundary Gradient Fades */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-white to-transparent z-20 dark:from-[#111112]" />
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white to-transparent z-20 dark:from-[#111112]" />
        </div>
    )
}

export default TornadoHelix
