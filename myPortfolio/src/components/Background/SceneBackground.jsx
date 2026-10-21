import { useEffect, useRef, memo } from 'react'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'
import { blobVertex, blobFragment, particleVertex, particleFragment } from './shaders'

/**
 * Fixed full-screen Three.js scene behind the page.
 * - An iridescent, noise-displaced core floats beside the hero.
 * - A particle field morphs between one formation per section as you scroll:
 *   ringed disk (about) → double helix (skills) → data terrain (projects)
 *   → torus knot (certifications) → sphere (contact), dispersing between each.
 * - Particles flee the pointer; the camera parallaxes with it.
 * - Honors prefers-reduced-motion by rendering only on scroll/resize, with time frozen.
 */

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'contact']

const THEMES = {
    dark: {
        clear: '#05050A',
        c1: '#67E8F9',
        c2: '#A78BFA',
        c3: '#F472B6',
        base: '#0B0B14',
        blending: THREE.AdditiveBlending,
        opacity: 0.9,
        wire: 0.14,
    },
    light: {
        clear: '#F4F3EF',
        c1: '#0891B2',
        c2: '#7C3AED',
        c3: '#DB2777',
        base: '#E7E4F2',
        blending: THREE.NormalBlending,
        opacity: 0.7,
        wire: 0.18,
    },
}

const gauss = () => {
    const u = 1 - Math.random()
    const v = Math.random()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function randomUnit() {
    const z = Math.random() * 2 - 1
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(1 - z * z)
    return [r * Math.cos(a), r * Math.sin(a), z]
}

function buildParticles(count) {
    const arr = (n = 3) => new Float32Array(count * n)
    const p0 = arr(), p1 = arr(), p2 = arr(), p3 = arr(), p4 = arr(), dir = arr()
    const rand = arr(1), scale = arr(1)

    const cols = 160
    const rows = Math.ceil(count / cols)
    const golden = Math.PI * (3 - Math.sqrt(5))

    for (let i = 0; i < count; i++) {
        const j = i * 3

        // 0: spiral ring disk (flat in XZ) with a faint halo around the core
        if (Math.random() < 0.85) {
            const r = 2.1 + Math.pow(Math.random(), 1.8) * 3.4
            const arm = Math.floor(Math.random() * 3)
            const t = (arm * Math.PI * 2) / 3 + r * 0.8 + gauss() * 0.22
            p0[j] = Math.cos(t) * r
            p0[j + 1] = gauss() * 0.05 * (1 + r * 0.15)
            p0[j + 2] = Math.sin(t) * r
        } else {
            const [x, y, z] = randomUnit()
            const r = 1.7 + Math.random() * 0.6
            p0[j] = x * r
            p0[j + 1] = y * r
            p0[j + 2] = z * r
        }

        // 1: double helix — x along the axis, angle, signed radius
        if (Math.random() < 0.78) {
            const x = Math.random() * 15 - 7.5
            const strand = Math.random() < 0.5 ? 0 : Math.PI
            p1[j] = x + gauss() * 0.03
            p1[j + 1] = x * 0.9 + strand + gauss() * 0.05
            p1[j + 2] = 1.15 + gauss() * 0.05
        } else {
            const x = -7.5 + Math.floor(Math.random() * 28) * 0.555
            p1[j] = x
            p1[j + 1] = x * 0.9
            p1[j + 2] = (Math.random() * 2 - 1) * 1.15
        }

        // 2: terrain lattice
        const c = i % cols
        const r = Math.floor(i / cols)
        p2[j] = -9 + (18 * c) / (cols - 1)
        p2[j + 1] = -1.9
        p2[j + 2] = -8 + (11 * r) / Math.max(1, rows - 1)

        // 3: (2,3) torus knot with tube jitter
        const t = Math.random() * Math.PI * 2
        const kr = Math.cos(3 * t) + 2
        const [jx, jy, jz] = randomUnit()
        const tube = 0.28 * Math.sqrt(Math.random())
        p3[j] = (kr * Math.cos(2 * t)) * 0.95 + jx * tube
        p3[j + 1] = (kr * Math.sin(2 * t)) * 0.95 + jy * tube
        p3[j + 2] = -Math.sin(3 * t) * 0.95 + jz * tube

        // 4: fibonacci sphere
        const y = 1 - (i / (count - 1)) * 2
        const sr = Math.sqrt(1 - y * y)
        const th = golden * i
        const rad = 2.6 + gauss() * 0.04
        p4[j] = Math.cos(th) * sr * rad
        p4[j + 1] = y * rad
        p4[j + 2] = Math.sin(th) * sr * rad

        const [dx, dy, dz] = randomUnit()
        dir[j] = dx
        dir[j + 1] = dy
        dir[j + 2] = dz
        rand[i] = Math.random()
        scale[i] = 0.35 + Math.pow(Math.random(), 2) * 1.3
    }

    const geo = new THREE.BufferGeometry()
    // `position` only drives bounding volumes; the shader reads the aP* formations.
    geo.setAttribute('position', new THREE.BufferAttribute(p4, 3))
    geo.setAttribute('aP0', new THREE.BufferAttribute(p0, 3))
    geo.setAttribute('aP1', new THREE.BufferAttribute(p1, 3))
    geo.setAttribute('aP2', new THREE.BufferAttribute(p2, 3))
    geo.setAttribute('aP3', new THREE.BufferAttribute(p3, 3))
    geo.setAttribute('aP4', new THREE.BufferAttribute(p4, 3))
    geo.setAttribute('aDir', new THREE.BufferAttribute(dir, 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20)
    return geo
}

const smooth = (e0, e1, x) => {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
    return t * t * (3 - 2 * t)
}

function SceneBackground() {
    const { isDark } = useTheme()
    const canvasRef = useRef(null)
    const apiRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
        } catch {
            return undefined // No WebGL: the body background colour stands in.
        }

        const isSmall = window.innerWidth < 768
        const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        let reduced = reduceQuery.matches

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
        camera.position.set(0, 0, 10)

        // Particle field
        const particleGeo = buildParticles(isSmall ? 7000 : 16000)
        const particleMat = new THREE.ShaderMaterial({
            vertexShader: particleVertex,
            fragmentShader: particleFragment,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uTime: { value: 0 },
                uProgress: { value: 0 },
                uSize: { value: isSmall ? 34 : 30 },
                uPixelRatio: { value: 1 },
                uMouse: { value: new THREE.Vector3(99, 99, 0) },
                uMouseForce: { value: 0 },
                uOpacity: { value: 1 },
                uC1: { value: new THREE.Color() },
                uC2: { value: new THREE.Color() },
                uC3: { value: new THREE.Color() },
            },
        })
        const particles = new THREE.Points(particleGeo, particleMat)
        scene.add(particles)

        // Hero core
        const blobGeo = new THREE.IcosahedronGeometry(1.35, isSmall ? 32 : 64)
        const blobMat = new THREE.ShaderMaterial({
            vertexShader: blobVertex,
            fragmentShader: blobFragment,
            uniforms: {
                uTime: { value: 0 },
                uDistort: { value: 0.2 },
                uBase: { value: new THREE.Color() },
                uDark: { value: 1 },
                uC1: particleMat.uniforms.uC1,
                uC2: particleMat.uniforms.uC2,
                uC3: particleMat.uniforms.uC3,
            },
        })
        const blob = new THREE.Mesh(blobGeo, blobMat)
        const wireMat = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.05, 1)), wireMat)
        const core = new THREE.Group()
        core.add(blob, wire)
        scene.add(core)

        // Layout state
        const state = {
            time: 12,
            progress: 0,
            target: 0,
            anchors: [0],
            pointer: new THREE.Vector2(0, 0),
            pointerSmooth: new THREE.Vector2(0, 0),
            mouseForce: 0,
            lastMove: -1e9,
            layouts: [],
        }

        const halfExtents = () => {
            const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
            return [halfH * camera.aspect, halfH]
        }

        const computeLayouts = () => {
            const [hw, hh] = halfExtents()
            const wide = camera.aspect > 1.05
            state.layouts = wide
                ? [
                      { x: hw * 0.42, y: 0.1, s: Math.min(1, hw / 7) },
                      { x: 0, y: 0, s: Math.max(0.75, hw / 8) },
                      { x: 0, y: -0.3, s: 1 },
                      { x: hw * 0.62, y: 0, s: 0.8 },
                      { x: 0, y: 0, s: 1 },
                  ]
                : [
                      { x: 0, y: hh * 0.42, s: 0.62 },
                      { x: 0, y: 0, s: 0.62 },
                      { x: 0, y: -0.4, s: 0.7 },
                      { x: 0, y: hh * 0.2, s: 0.62 },
                      { x: 0, y: 0, s: 0.75 },
                  ]
        }

        const measure = () => {
            const vh = window.innerHeight
            const max = Math.max(1, document.documentElement.scrollHeight - vh)
            const anchors = SECTION_IDS.map((id, i) => {
                const el = document.getElementById(id)
                if (!el || i === 0) return 0
                const top = el.getBoundingClientRect().top + window.scrollY
                return Math.min(max, Math.max(0, top - vh * 0.5))
            })
            for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1])
            state.anchors = anchors
        }

        const readScroll = () => {
            const y = window.scrollY
            const a = state.anchors
            let target = a.length - 1
            for (let i = 0; i < a.length - 1; i++) {
                if (y < a[i + 1]) {
                    const span = a[i + 1] - a[i]
                    const frac = span > 0 ? (y - a[i]) / span : 1
                    target = i + smooth(0.45, 1, frac)
                    break
                }
            }
            state.target = target
        }

        const resize = () => {
            const w = window.innerWidth
            const h = window.innerHeight
            const pr = Math.min(window.devicePixelRatio || 1, 2)
            renderer.setPixelRatio(pr)
            renderer.setSize(w, h, false)
            camera.aspect = w / h
            camera.updateProjectionMatrix()
            particleMat.uniforms.uPixelRatio.value = pr
            computeLayouts()
            measure()
            readScroll()
        }

        const applyTheme = (dark) => {
            const t = dark ? THEMES.dark : THEMES.light
            renderer.setClearColor(t.clear, 1)
            particleMat.uniforms.uC1.value.set(t.c1)
            particleMat.uniforms.uC2.value.set(t.c2)
            particleMat.uniforms.uC3.value.set(t.c3)
            particleMat.uniforms.uOpacity.value = t.opacity * (isSmall ? 0.7 : 1)
            particleMat.blending = t.blending
            particleMat.needsUpdate = true
            blobMat.uniforms.uBase.value.set(t.base)
            blobMat.uniforms.uDark.value = dark ? 1 : 0
            wireMat.color.set(dark ? '#C4B5FD' : '#4C1D95')
            state.wireOpacity = t.wire
        }

        const ndcToWorld = new THREE.Vector3()
        let raf = 0
        let last = performance.now()

        const frame = (now) => {
            raf = 0
            const dt = Math.min((now - last) / 1000, 0.1)
            last = now
            const ease = reduced ? 1 : 1 - Math.pow(0.0015, dt)

            if (!reduced) state.time += dt
            state.progress += (state.target - state.progress) * ease
            state.pointerSmooth.lerp(state.pointer, reduced ? 1 : 1 - Math.pow(0.002, dt))

            const p = state.progress
            const i0 = Math.min(Math.floor(p), 3)
            const f = p - i0
            const A = state.layouts[i0]
            const B = state.layouts[i0 + 1]
            particles.position.set(
                THREE.MathUtils.lerp(A.x, B.x, f),
                THREE.MathUtils.lerp(A.y, B.y, f),
                0
            )
            particles.scale.setScalar(THREE.MathUtils.lerp(A.s, B.s, f))

            // Pointer projected onto z=0, expressed in the particle group's local space
            ndcToWorld.set(state.pointerSmooth.x, state.pointerSmooth.y, 0.5).unproject(camera)
            ndcToWorld.sub(camera.position).normalize()
            const dist = -camera.position.z / ndcToWorld.z
            ndcToWorld.multiplyScalar(dist).add(camera.position)
            const local = particleMat.uniforms.uMouse.value
            local.copy(ndcToWorld).sub(particles.position).divideScalar(particles.scale.x)

            const active = !reduced && now - state.lastMove < 1800
            state.mouseForce += ((active ? 1 : 0) - state.mouseForce) * Math.min(1, dt * 3)
            particleMat.uniforms.uMouseForce.value = state.mouseForce
            particleMat.uniforms.uTime.value = state.time
            particleMat.uniforms.uProgress.value = p

            // Core: shrinks away as the hero leaves; swells near the pointer
            const L = state.layouts[0]
            const coreScale = L.s * (1 - smooth(0, 0.7, p))
            core.visible = coreScale > 0.01
            core.position.set(L.x, L.y + (1 - coreScale / L.s) * 1.5, 0)
            core.scale.setScalar(coreScale * (1 + Math.sin(state.time * 0.9) * 0.015))
            const near = Math.max(0, 1 - ndcToWorld.distanceTo(core.position) / 3)
            blobMat.uniforms.uTime.value = state.time
            blobMat.uniforms.uDistort.value += (0.2 + near * 0.16 - blobMat.uniforms.uDistort.value) * Math.min(1, dt * 2)
            blob.rotation.y = state.time * 0.12 + state.pointerSmooth.x * 0.4
            blob.rotation.x = -state.pointerSmooth.y * 0.3
            wire.rotation.y = -state.time * 0.08
            wire.rotation.z = state.time * 0.05
            wireMat.opacity = state.wireOpacity * (0.6 + near * 0.6)

            camera.position.x = state.pointerSmooth.x * 0.35
            camera.position.y = state.pointerSmooth.y * 0.22
            camera.lookAt(0, 0, 0)

            renderer.render(scene, camera)
            if (!reduced) raf = requestAnimationFrame(frame)
        }

        const invalidate = () => {
            if (!raf) raf = requestAnimationFrame(frame)
        }

        const onScroll = () => {
            readScroll()
            invalidate()
        }
        const onResize = () => {
            resize()
            invalidate()
        }
        const onPointer = (e) => {
            state.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1)
            state.lastMove = performance.now()
        }
        const onReduceChange = (e) => {
            reduced = e.matches
            last = performance.now()
            invalidate()
        }

        // Section heights change (filters, images loading), so re-measure on body resize.
        const ro = new ResizeObserver(() => {
            measure()
            readScroll()
            invalidate()
        })
        ro.observe(document.body)

        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onResize)
        window.addEventListener('pointermove', onPointer, { passive: true })
        reduceQuery.addEventListener('change', onReduceChange)

        apiRef.current = {
            setTheme: (dark) => {
                applyTheme(dark)
                invalidate()
            },
        }
        applyTheme(document.documentElement.classList.contains('dark'))
        resize()
        state.progress = state.target
        invalidate()

        return () => {
            cancelAnimationFrame(raf)
            ro.disconnect()
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onResize)
            window.removeEventListener('pointermove', onPointer)
            reduceQuery.removeEventListener('change', onReduceChange)
            apiRef.current = null
            particleGeo.dispose()
            particleMat.dispose()
            blobGeo.dispose()
            blobMat.dispose()
            wire.geometry.dispose()
            wireMat.dispose()
            renderer.dispose()
        }
    }, [])

    useEffect(() => {
        apiRef.current?.setTheme(isDark)
    }, [isDark])

    return (
        <>
            <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 block h-full w-full" />
            {/* Vignette keeps text legible over the brightest formations */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_45%,rgba(244,243,239,0.75)_100%)] dark:bg-[radial-gradient(120%_90%_at_50%_40%,transparent_40%,rgba(5,5,10,0.85)_100%)]"
            />
        </>
    )
}

export default memo(SceneBackground)
