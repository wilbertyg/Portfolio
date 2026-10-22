import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { useTheme } from '../../context/ThemeContext'

// Page sections in scroll order; the camera visits one waypoint per section.
const SECTION_IDS = ['top', 'about', 'skills', 'projects', 'certifications', 'contact']

const WAYPOINTS = [
    { pos: [5, 5.5, 15], look: [-3.5, 3.2, 0] },
    { pos: [-7, 3.5, 8], look: [-3.5, 2.5, -3.5] },
    { pos: [-6, 1.5, 3], look: [-20, -2.5, -11] },
    { pos: [8, 2.5, -1], look: [19, -1, -16] },
    { pos: [-2, -1.5, -15], look: [-19, -8, -25.5] },
    { pos: [6, -7, -30], look: [10, -12.5, -42] },
]

const PALETTES = {
    dark: {
        skyTop: '#04030c', skyMid: '#1a1240', skyBottom: '#47205a', fog: '#171033',
        hemiSky: '#7b6bd6', hemiGround: '#1a1030', hemi: 0.75, sun: '#a9bcff', sunI: 1.1,
        orb: '#e9edff', fogDensity: 0.018, stars: 1, glow: 1, lamps: 1,
    },
    light: {
        skyTop: '#3d7fd0', skyMid: '#9ccaf0', skyBottom: '#f8d8a8', fog: '#c6dcef',
        hemiSky: '#d8ecff', hemiGround: '#9a8358', hemi: 1.5, sun: '#fff0cc', sunI: 2.6,
        orb: '#fff4c2', fogDensity: 0.011, stars: 0, glow: 0.35, lamps: 0.35,
    },
}

const C = {
    grass: '#4f8a3c', grassDark: '#3c6e31', rock: '#6d5a4c', rockDark: '#4a3d36', bark: '#5b3b24',
    leaf: '#2f7a46', leafAlt: '#3e9a52', blossom: '#c86fa8', stone: '#8c8a96', robe: '#4b2fa0',
    skin: '#f0c9a0', gold: '#f2c14e', crystal: '#8f6bff', fire: '#ff7a1a', flame: '#ffd36b', wood: '#6b4526',
    roof: '#9b3b3b', wall: '#d9cbb0', cloud: '#f4f1ff',
}

// Deterministic noise so shared vertices jitter identically (no cracks at seams).
const hash = (x, y, z) => {
    const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453
    return s - Math.floor(s)
}

function jitter(geo, amount, seed = 0) {
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) {
        const x = Math.round(p.getX(i) * 100) / 100
        const y = Math.round(p.getY(i) * 100) / 100
        const z = Math.round(p.getZ(i) * 100) / 100
        p.setXYZ(
            i,
            x + (hash(x + seed, y, z) - 0.5) * amount,
            y + (hash(x, y + seed, z + 3.1) - 0.5) * amount * 0.6,
            z + (hash(x + 7.7, y, z + seed) - 0.5) * amount,
        )
    }
    geo.computeVertexNormals()
    return geo
}

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra })
const glowMat = (color, intensity = 2) =>
    new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, flatShading: true, roughness: 0.4 })

function mesh(geo, material, [x, y, z] = [0, 0, 0], parent) {
    const m = new THREE.Mesh(geo, material)
    m.position.set(x, y, z)
    parent?.add(m)
    return m
}

function makeIsland(radius, depth, seed) {
    const g = new THREE.Group()
    const top = jitter(new THREE.CylinderGeometry(radius, radius * 0.95, 0.9, 11, 1), radius * 0.08, seed)
    mesh(top, mat(C.grass), [0, 0, 0], g)
    const rock = new THREE.ConeGeometry(radius * 0.92, depth, 11, 4)
    rock.rotateX(Math.PI)
    rock.translate(0, -0.45 - depth / 2, 0)
    mesh(jitter(rock, radius * 0.22, seed + 1), mat(C.rock), [0, 0, 0], g)
    // A few loose boulders hanging under the rim
    for (let i = 0; i < 4; i++) {
        const a = seed * 3 + i * 1.7
        const b = mesh(new THREE.DodecahedronGeometry(0.3 + hash(i, seed, 1) * 0.4, 0), mat(C.rockDark),
            [Math.cos(a) * radius * 0.6, -depth * (0.5 + hash(seed, i, 2) * 0.4), Math.sin(a) * radius * 0.6], g)
        b.rotation.set(a, a * 2, 0)
    }
    return g
}

function makeTree(parent, [x, z], scale = 1, kind = 0, y = 0.45) {
    const t = new THREE.Group()
    mesh(new THREE.CylinderGeometry(0.1, 0.16, 0.9, 5), mat(C.bark), [0, 0.45, 0], t)
    if (kind === 0) {
        mesh(new THREE.ConeGeometry(0.75, 1.3, 6), mat(C.leaf), [0, 1.3, 0], t)
        mesh(new THREE.ConeGeometry(0.55, 1.0, 6), mat(C.leafAlt), [0, 1.9, 0], t)
    } else {
        mesh(new THREE.IcosahedronGeometry(0.75, 0), mat(kind === 2 ? C.blossom : C.leafAlt), [0, 1.4, 0], t)
    }
    t.position.set(x, y, z)
    t.scale.setScalar(scale)
    t.rotation.y = x * 3 + z
    parent.add(t)
    return t
}

function runeTexture(seed) {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.moveTo(32, 8)
    ctx.lineTo(32, 56)
    for (let i = 0; i < 2; i++) {
        const y = 12 + hash(seed, i, 5) * 30
        const dir = hash(i, seed, 9) > 0.5 ? 1 : -1
        ctx.moveTo(32, y)
        ctx.lineTo(32 + dir * 16, y + (hash(seed, i, 3) > 0.5 ? 14 : -10))
    }
    ctx.stroke()
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
}

const particleVertex = /* glsl */ `
    uniform float uTime;
    uniform float uSize;
    uniform float uRise;
    attribute float aSeed;
    attribute vec3 aColor;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        vec3 p = position;
        float fade = 1.0;
        if (uRise > 0.0) {
            float h = mod(uTime * 0.7 + aSeed * 7.0, uRise);
            p.y += h;
            p.x += sin(uTime * 2.0 + aSeed * 30.0) * 0.15 * h;
            fade = 1.0 - h / uRise;
        } else {
            p.x += sin(uTime * 0.45 + aSeed * 6.28) * 0.9;
            p.y += sin(uTime * 0.6 + aSeed * 12.0) * 0.6;
            p.z += cos(uTime * 0.35 + aSeed * 9.0) * 0.9;
        }
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        float tw = 0.55 + 0.45 * sin(uTime * 2.5 + aSeed * 40.0);
        gl_PointSize = uSize * (10.0 / -mv.z) * (0.6 + 0.4 * tw);
        vColor = aColor;
        vAlpha = fade * tw;
    }
`

const particleFragment = /* glsl */ `
    uniform float uOpacity;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vColor * 1.6, a * a * vAlpha * uOpacity);
    }
`

function makeParticles({ count, spread, center = [0, 0, 0], colors, size, rise = 0 }) {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const tmp = new THREE.Color()
    for (let i = 0; i < count; i++) {
        pos[i * 3] = center[0] + (Math.random() - 0.5) * spread[0]
        pos[i * 3 + 1] = center[1] + (Math.random() - 0.5) * spread[1]
        pos[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread[2]
        tmp.set(colors[i % colors.length])
        col.set([tmp.r, tmp.g, tmp.b], i * 3)
        seed[i] = Math.random()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    const material = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSize: { value: size }, uRise: { value: rise }, uOpacity: { value: 1 } },
        vertexShader: particleVertex,
        fragmentShader: particleFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, material)
    points.frustumCulled = false
    return points
}

function buildWorld(scene, lowPower) {
    const anim = []
    const lamps = []

    // ---------- Sky dome ----------
    const skyUniforms = {
        uTop: { value: new THREE.Color() },
        uMid: { value: new THREE.Color() },
        uBottom: { value: new THREE.Color() },
    }
    const sky = new THREE.Mesh(
        new THREE.SphereGeometry(400, 32, 16),
        new THREE.ShaderMaterial({
            uniforms: skyUniforms,
            side: THREE.BackSide,
            depthWrite: false,
            vertexShader: /* glsl */ `
                varying vec3 vDir;
                void main() {
                    vDir = normalize(position);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: /* glsl */ `
                uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBottom;
                varying vec3 vDir;
                void main() {
                    float h = vDir.y;
                    vec3 c = h > 0.0 ? mix(uMid, uTop, pow(h, 0.55)) : mix(uMid, uBottom, pow(-h, 0.45));
                    gl_FragColor = vec4(c, 1.0);
                    #include <colorspace_fragment>
                }
            `,
        }),
    )
    scene.add(sky)

    // ---------- Stars ----------
    const starCount = lowPower ? 700 : 1600
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
        const u = Math.random() * Math.PI * 2
        const v = Math.random() * 0.9 + 0.05
        const r = 300
        starPos.set([Math.cos(u) * Math.sqrt(1 - v * v) * r, v * r - 40, Math.sin(u) * Math.sqrt(1 - v * v) * r], i * 3)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({ color: '#ffffff', size: 1.4, sizeAttenuation: false, transparent: true, depthWrite: false, fog: false })
    scene.add(new THREE.Points(starGeo, starMat))

    // ---------- Moon / sun ----------
    const orbMat = new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false })
    const orb = mesh(new THREE.SphereGeometry(9, 24, 16), orbMat, [-70, 75, -220], scene)
    const haloMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.12, fog: false, depthWrite: false })
    mesh(new THREE.SphereGeometry(16, 24, 16), haloMat, [0, 0, 0], orb)

    // ---------- Lights ----------
    const hemi = new THREE.HemisphereLight('#ffffff', '#000000', 1)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#ffffff', 1)
    sun.position.set(-30, 40, 20)
    scene.add(sun)

    // ---------- Island 0: crystal sanctum (hero + character) ----------
    const main = makeIsland(6.5, 9, 1)
    scene.add(main)
    anim.push((t) => { main.position.y = Math.sin(t * 0.4) * 0.25 })

    const crystalGroup = new THREE.Group()
    crystalGroup.position.set(0, 4.6, 0)
    main.add(crystalGroup)
    const crystalGeo = new THREE.OctahedronGeometry(1, 0)
    crystalGeo.scale(1, 1.75, 1)
    const crystal = mesh(crystalGeo, new THREE.MeshStandardMaterial({
        color: C.crystal, emissive: '#6a3dff', emissiveIntensity: 1.6, flatShading: true, roughness: 0.15, metalness: 0.3,
    }), [0, 0, 0], crystalGroup)
    const inner = mesh(new THREE.OctahedronGeometry(0.55, 0), glowMat('#cfe8ff', 4), [0, 0, 0], crystalGroup)
    const ringA = mesh(new THREE.TorusGeometry(2.1, 0.035, 6, 72), glowMat(C.gold, 2.5), [0, 0, 0], crystalGroup)
    const ringB = mesh(new THREE.TorusGeometry(2.6, 0.025, 6, 72), glowMat('#9fd8ff', 2.5), [0, 0, 0], crystalGroup)
    ringA.rotation.x = Math.PI / 2.3
    ringB.rotation.x = Math.PI / 1.7
    const runes = new THREE.Group()
    crystalGroup.add(runes)
    for (let i = 0; i < 8; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({
            map: runeTexture(i + 1), color: '#ffd77a', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        }))
        const a = (i / 8) * Math.PI * 2
        s.position.set(Math.cos(a) * 3.2, Math.sin(a * 2) * 0.4, Math.sin(a) * 3.2)
        s.scale.setScalar(0.55)
        runes.add(s)
    }
    const crystalLight = new THREE.PointLight('#8f6bff', 30, 18, 1.6)
    crystalGroup.add(crystalLight)
    lamps.push([crystalLight, 30])
    // Stone dais under the crystal
    mesh(jitter(new THREE.CylinderGeometry(1.6, 1.9, 0.5, 8), 0.1, 4), mat(C.stone), [0, 0.65, 0], main)
    mesh(jitter(new THREE.CylinderGeometry(1.1, 1.3, 0.35, 8), 0.08, 5), mat(C.stone), [0, 1.05, 0], main)
    anim.push((t) => {
        crystal.rotation.y = t * 0.5
        inner.rotation.y = -t * 1.2
        crystalGroup.position.y = 4.6 + Math.sin(t * 1.2) * 0.25
        ringA.rotation.z = t * 0.6
        ringB.rotation.z = -t * 0.45
        runes.rotation.y = t * 0.25
        crystalLight.intensity = crystalLight.userData.base * (0.85 + Math.sin(t * 2.3) * 0.15)
    })

    // The mage
    const mage = new THREE.Group()
    mage.position.set(2.6, 0.45, 2.4)
    mage.rotation.y = -0.6
    main.add(mage)
    const robeMat = mat(C.robe)
    mesh(new THREE.ConeGeometry(0.5, 1.4, 8), robeMat, [0, 0.7, 0], mage)
    mesh(new THREE.SphereGeometry(0.24, 10, 8), mat(C.skin), [0, 1.55, 0], mage)
    mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 12), robeMat, [0, 1.7, 0], mage)
    const hat = mesh(new THREE.ConeGeometry(0.34, 0.95, 8), robeMat, [0, 2.15, 0], mage)
    hat.rotation.z = -0.25
    mesh(new THREE.CylinderGeometry(0.33, 0.35, 0.08, 8), mat(C.gold, { metalness: 0.6, roughness: 0.4 }), [0, 1.78, 0], mage)
    mesh(new THREE.CylinderGeometry(0.035, 0.045, 2.2, 5), mat(C.bark), [0.55, 1.1, 0.1], mage)
    const staffOrb = mesh(new THREE.IcosahedronGeometry(0.16, 0), glowMat('#7fe3ff', 5), [0.55, 2.3, 0.1], mage)
    const staffLight = new THREE.PointLight('#7fe3ff', 6, 6, 2)
    staffOrb.add(staffLight)
    lamps.push([staffLight, 6])
    anim.push((t) => {
        mage.position.y = 0.45 + Math.max(0, Math.sin(t * 2)) * 0.04
        staffOrb.rotation.y = t * 2
        staffOrb.scale.setScalar(1 + Math.sin(t * 3) * 0.12)
    })

    const mainTrees = [[-4.5, 2], [-3.8, -3.6], [4.6, -2.6], [-1.5, -5.2], [1.8, -5.3], [-5.3, -0.8], [5.4, 0.6], [-2.9, 4.4]]
    mainTrees.forEach(([x, z], i) => makeTree(main, [x, z], 0.8 + hash(x, z, 1) * 0.6, i % 3))
    // Lanterns along the path
    ;[[1.2, 3.8], [-1.2, 3.6]].forEach(([x, z]) => {
        mesh(new THREE.CylinderGeometry(0.05, 0.06, 1.2, 5), mat(C.wood), [x, 1.05, z], main)
        const l = mesh(new THREE.OctahedronGeometry(0.14, 0), glowMat(C.flame, 3), [x, 1.75, z], main)
        const pl = new THREE.PointLight(C.flame, 2.5, 4, 2)
        l.add(pl)
        lamps.push([pl, 2.5])
    })

    // Waterfall spilling off the rim
    const fallUniforms = { uTime: { value: 0 } }
    const fall = mesh(new THREE.PlaneGeometry(1.2, 14, 1, 1), new THREE.ShaderMaterial({
        uniforms: fallUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: /* glsl */ `
            uniform float uTime; varying vec2 vUv;
            void main(){
                float streak = sin(vUv.x * 40.0 + sin(vUv.y * 9.0)) * 0.5 + 0.5;
                float flow = fract(vUv.y * 6.0 + uTime * 1.6 + streak * 0.3);
                float edge = smoothstep(0.0, 0.25, vUv.x) * smoothstep(1.0, 0.75, vUv.x);
                float a = edge * smoothstep(0.0, 0.5, vUv.y) * (0.35 + flow * 0.35);
                gl_FragColor = vec4(mix(vec3(0.55,0.8,1.0), vec3(1.0), flow), a);
            }
        `,
    }), [-1.8, -6.6, 6.2], main)
    fall.rotation.y = -0.25
    anim.push((t) => { fallUniforms.uTime.value = t })

    // ---------- Island 1: the skill grove — standing stones ----------
    const grove = makeIsland(5, 7, 7)
    grove.position.set(-20, -3, -11)
    scene.add(grove)
    anim.push((t) => { grove.position.y = -3 + Math.sin(t * 0.35 + 1) * 0.3 })
    const schoolColors = ['#b49bff', '#4fd99c', '#f5c542']
    for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2
        const stone = mesh(jitter(new THREE.BoxGeometry(0.7, 2.4, 0.45, 1, 2, 1), 0.12, i), mat(C.stone), [Math.cos(a) * 3, 1.6, Math.sin(a) * 3], grove)
        stone.lookAt(0, 1.6, 0)
        const glyph = mesh(new THREE.PlaneGeometry(0.3, 0.9), glowMat(schoolColors[i % 3], 3), [0, 0.1, 0.24], stone)
        glyph.material.side = THREE.DoubleSide
    }
    const altar = mesh(jitter(new THREE.CylinderGeometry(0.8, 1, 0.9, 6), 0.1, 3), mat(C.stone), [0, 0.9, 0], grove)
    const orbs = new THREE.Group()
    orbs.position.set(0, 2.4, 0)
    grove.add(orbs)
    schoolColors.forEach((c, i) => {
        const a = (i / 3) * Math.PI * 2
        const o = mesh(new THREE.IcosahedronGeometry(0.28, 1), glowMat(c, 3.5), [Math.cos(a) * 0.9, 0, Math.sin(a) * 0.9], orbs)
        const pl = new THREE.PointLight(c, 4, 6, 2)
        o.add(pl)
        lamps.push([pl, 4])
    })
    anim.push((t) => {
        orbs.rotation.y = t * 0.8
        orbs.position.y = 2.4 + Math.sin(t * 1.5) * 0.2
        altar.rotation.y = t * 0.05
    })
    ;[[3.6, 2.6], [-3.8, 1.8], [0.6, -4.1], [-2.2, -3.6]].forEach(([x, z], i) => makeTree(grove, [x, z], 0.9, (i + 1) % 3))

    // ---------- Island 2: quest outpost — tower & signpost ----------
    const outpost = makeIsland(5.2, 8, 13)
    outpost.position.set(19, -1.5, -16)
    scene.add(outpost)
    anim.push((t) => { outpost.position.y = -1.5 + Math.sin(t * 0.3 + 2) * 0.3 })
    const tower = new THREE.Group()
    tower.position.set(-1.2, 0.45, -1)
    outpost.add(tower)
    mesh(jitter(new THREE.CylinderGeometry(1.1, 1.3, 4.2, 8), 0.06, 2), mat(C.wall), [0, 2.1, 0], tower)
    mesh(new THREE.ConeGeometry(1.6, 1.8, 8), mat(C.roof), [0, 5.1, 0], tower)
    mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.2, 4), mat(C.wood), [0, 6.4, 0], tower)
    const flag = mesh(new THREE.PlaneGeometry(0.8, 0.45, 6, 1), new THREE.MeshStandardMaterial({ color: C.gold, side: THREE.DoubleSide, flatShading: true }), [0.4, 6.75, 0], tower)
    const flagBase = flag.geometry.attributes.position.array.slice()
    for (const [y, a] of [[1.4, 0.3], [2.8, 2.1], [3.3, -1.3]]) {
        const w = mesh(new THREE.PlaneGeometry(0.3, 0.45), glowMat('#ffcf6b', 2.5), [Math.sin(a) * 1.13, y, Math.cos(a) * 1.13], tower)
        w.rotation.y = a
    }
    const towerLight = new THREE.PointLight('#ffcf6b', 5, 7, 2)
    towerLight.position.set(0, 3, 1.6)
    tower.add(towerLight)
    lamps.push([towerLight, 5])
    anim.push((t) => {
        const p = flag.geometry.attributes.position
        for (let i = 0; i < p.count; i++) {
            const x = flagBase[i * 3]
            p.setZ(i, Math.sin(t * 4 + x * 6) * 0.08 * (x + 0.4))
        }
        p.needsUpdate = true
    })
    // Signpost with quest notices
    const sign = new THREE.Group()
    sign.position.set(2.2, 0.45, 1.5)
    outpost.add(sign)
    mesh(new THREE.CylinderGeometry(0.08, 0.1, 2.2, 5), mat(C.wood), [0, 1.1, 0], sign)
    mesh(new THREE.BoxGeometry(1.6, 1.1, 0.1), mat(C.wood), [0, 1.6, 0.1], sign)
    ;[[-0.4, 1.75], [0.35, 1.5], [-0.15, 1.4]].forEach(([x, y], i) => {
        const note = mesh(new THREE.PlaneGeometry(0.4, 0.5), mat('#f3e6c4'), [x, y, 0.16], sign)
        note.rotation.z = (i - 1) * 0.15
    })
    const marker = mesh(new THREE.OctahedronGeometry(0.22, 0), glowMat(C.gold, 4), [0, 2.9, 0], sign)
    anim.push((t) => {
        marker.position.y = 2.9 + Math.sin(t * 2.5) * 0.15
        marker.rotation.y = t * 2
    })
    ;[[3.4, -2.5], [-3.6, 2.4], [0.2, -3.9]].forEach(([x, z], i) => makeTree(outpost, [x, z], 1, i % 2))

    // ---------- Island 3: hall of trophies — chalice in a beam of light ----------
    const vault = makeIsland(4.4, 7, 21)
    vault.position.set(-12, -6, -30)
    scene.add(vault)
    anim.push((t) => { vault.position.y = -6 + Math.sin(t * 0.38 + 3) * 0.3 })
    mesh(jitter(new THREE.CylinderGeometry(1.4, 1.7, 0.6, 8), 0.08, 9), mat(C.stone), [0, 0.75, 0], vault)
    mesh(new THREE.CylinderGeometry(0.6, 0.8, 1.2, 8), mat(C.stone), [0, 1.65, 0], vault)
    const cupProfile = [[0, 0], [0.5, 0], [0.5, 0.08], [0.16, 0.18], [0.1, 0.55], [0.18, 0.65], [0.55, 0.85], [0.66, 1.35], [0.6, 1.38], [0.48, 0.92], [0, 0.82]]
    const cup = mesh(
        new THREE.LatheGeometry(cupProfile.map(([x, y]) => new THREE.Vector2(x, y)), 14),
        new THREE.MeshStandardMaterial({ color: C.gold, metalness: 1, roughness: 0.25, emissive: '#7a4a00', emissiveIntensity: 0.6, flatShading: true }),
        [0, 2.25, 0], vault,
    )
    const beam = mesh(new THREE.CylinderGeometry(0.9, 1.6, 16, 20, 1, true), new THREE.MeshBasicMaterial({
        color: '#ffd77a', transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }), [0, 9, 0], vault)
    const shards = new THREE.Group()
    shards.position.set(0, 3, 0)
    vault.add(shards)
    ;['#b49bff', '#5aacff', '#4fd99c', '#ff6b6f', '#f5c542'].forEach((c, i) => {
        const a = (i / 5) * Math.PI * 2
        const s = mesh(new THREE.OctahedronGeometry(0.2, 0), glowMat(c, 3), [Math.cos(a) * 1.6, Math.sin(a * 2) * 0.3, Math.sin(a) * 1.6], shards)
        s.scale.y = 1.8
    })
    const vaultLight = new THREE.PointLight('#ffd77a', 8, 9, 2)
    vaultLight.position.set(0, 3.5, 0)
    vault.add(vaultLight)
    lamps.push([vaultLight, 8])
    anim.push((t) => {
        cup.rotation.y = t * 0.6
        shards.rotation.y = -t * 0.5
        beam.material.opacity = 0.08 + Math.sin(t * 1.4) * 0.03
    })
    ;[[2.8, 2.3], [-3, -1.8]].forEach(([x, z], i) => makeTree(vault, [x, z], 0.8, i + 1))

    // ---------- Island 4: guild camp — campfire, tent and chest ----------
    const camp = makeIsland(5, 8, 29)
    camp.position.set(10, -9, -42)
    scene.add(camp)
    anim.push((t) => { camp.position.y = -9 + Math.sin(t * 0.33 + 4) * 0.3 })
    for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2
        mesh(new THREE.DodecahedronGeometry(0.22, 0), mat(C.stone), [Math.cos(a) * 0.85, 0.55, Math.sin(a) * 0.85], camp)
    }
    for (let i = 0; i < 3; i++) {
        const log = mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.2, 5), mat(C.wood), [0, 0.6, 0], camp)
        log.rotation.set(Math.PI / 2.4, (i / 3) * Math.PI, 0)
    }
    const flames = [[0.42, 1.0, C.fire], [0.28, 0.75, C.flame], [0.15, 0.5, '#fff4c2']].map(([r, h, c]) => {
        const f = mesh(new THREE.ConeGeometry(r, h, 6), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }), [0, 0.6 + h / 2, 0], camp)
        f.userData.h = h
        return f
    })
    const fireLight = new THREE.PointLight(C.fire, 14, 12, 1.6)
    fireLight.position.set(0, 1.3, 0)
    camp.add(fireLight)
    lamps.push([fireLight, 14])
    anim.push((t) => {
        flames.forEach((f, i) => {
            const s = 1 + Math.sin(t * (9 + i * 3) + i) * 0.12
            f.scale.set(s, 1 + Math.sin(t * (11 + i * 2)) * 0.18, s)
            f.rotation.y = t * (1 + i)
        })
        fireLight.intensity = fireLight.userData.base * (0.8 + Math.sin(t * 13) * 0.1 + Math.sin(t * 7.3) * 0.1)
    })
    const tent = mesh(new THREE.ConeGeometry(1.5, 2, 4), mat('#3e6db0'), [-2.4, 1.45, -1.2], camp)
    tent.rotation.y = 0.5
    const chest = new THREE.Group()
    chest.position.set(1.9, 0.45, -1.4)
    chest.rotation.y = -0.6
    camp.add(chest)
    mesh(new THREE.BoxGeometry(0.9, 0.5, 0.6), mat(C.wood), [0, 0.25, 0], chest)
    const lid = new THREE.Group()
    lid.position.set(0, 0.5, -0.3)
    chest.add(lid)
    const lidMesh = mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 8, 1, false, 0, Math.PI), mat(C.wood), [0, 0, 0.3], lid)
    lidMesh.rotation.z = Math.PI / 2
    mesh(new THREE.BoxGeometry(0.95, 0.08, 0.65), mat(C.gold, { metalness: 0.7, roughness: 0.3 }), [0, 0.42, 0], chest)
    const loot = mesh(new THREE.IcosahedronGeometry(0.16, 0), glowMat(C.gold, 4), [0, 0.5, 0], chest)
    anim.push((t) => {
        lid.rotation.x = -0.35 - Math.max(0, Math.sin(t * 0.9)) * 0.5
        loot.position.y = 0.55 + Math.max(0, Math.sin(t * 0.9)) * 0.25
        loot.rotation.y = t * 3
    })
    ;[[3.4, 1.6], [-3.2, 2.2], [0.8, -3.6], [3.2, -2.4]].forEach(([x, z], i) => makeTree(camp, [x, z], 0.9 + i * 0.1, i % 3))

    // ---------- Floating debris ----------
    const debrisCount = lowPower ? 26 : 50
    const debris = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), mat(C.rock), debrisCount)
    const debrisData = []
    const m4 = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const e = new THREE.Euler()
    const v = new THREE.Vector3()
    const sc = new THREE.Vector3()
    for (let i = 0; i < debrisCount; i++) {
        debrisData.push({
            p: new THREE.Vector3((Math.random() - 0.5) * 70, -14 + Math.random() * 26, 12 - Math.random() * 64),
            s: 0.2 + Math.random() * 0.7,
            r: Math.random() * 6,
            speed: 0.2 + Math.random() * 0.5,
        })
    }
    scene.add(debris)
    const updateDebris = (t) => {
        debrisData.forEach((d, i) => {
            e.set(d.r + t * d.speed, d.r * 2 + t * d.speed * 0.7, 0)
            q.setFromEuler(e)
            v.copy(d.p)
            v.y += Math.sin(t * d.speed + d.r) * 0.5
            sc.setScalar(d.s)
            debris.setMatrixAt(i, m4.compose(v, q, sc))
        })
        debris.instanceMatrix.needsUpdate = true
    }
    updateDebris(0)
    anim.push(updateDebris)

    // ---------- Sea of clouds ----------
    const cloudCount = lowPower ? 70 : 140
    const clouds = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), mat(C.cloud, { roughness: 1 }), cloudCount)
    for (let i = 0; i < cloudCount; i++) {
        v.set((Math.random() - 0.5) * 140, -22 - Math.random() * 6, 25 - Math.random() * 110)
        e.set(Math.random(), Math.random(), 0)
        q.setFromEuler(e)
        const s = 3 + Math.random() * 6
        sc.set(s * 1.6, s * 0.6, s)
        clouds.setMatrixAt(i, m4.compose(v, q, sc))
    }
    scene.add(clouds)
    anim.push((t) => { clouds.position.x = Math.sin(t * 0.05) * 6 })

    // ---------- Particles ----------
    const fireflies = makeParticles({
        count: lowPower ? 140 : 320,
        spread: [60, 22, 70],
        center: [0, -1, -20],
        colors: ['#ffe28a', '#9fe6ff', '#c9a7ff'],
        size: 9,
    })
    scene.add(fireflies)
    const motes = makeParticles({ count: 60, spread: [7, 6, 7], center: [0, 4.5, 0], colors: ['#c9a7ff', '#ffffff'], size: 6 })
    main.add(motes)
    const embers = makeParticles({ count: 50, spread: [0.6, 0.2, 0.6], center: [0, 1, 0], colors: ['#ff9a3d', '#ffd36b'], size: 5, rise: 3.2 })
    camp.add(embers)
    const particleMats = [fireflies.material, motes.material, embers.material]
    anim.push((t) => particleMats.forEach((m) => { m.uniforms.uTime.value = t }))

    return {
        anim,
        applyPalette(p) {
            skyUniforms.uTop.value.copy(p.skyTop)
            skyUniforms.uMid.value.copy(p.skyMid)
            skyUniforms.uBottom.value.copy(p.skyBottom)
            scene.fog.color.copy(p.fog)
            scene.fog.density = p.fogDensity
            hemi.color.copy(p.hemiSky)
            hemi.groundColor.copy(p.hemiGround)
            hemi.intensity = p.hemi
            sun.color.copy(p.sun)
            sun.intensity = p.sunI
            orbMat.color.copy(p.orb)
            haloMat.color.copy(p.orb)
            starMat.opacity = p.stars
            fireflies.material.uniforms.uOpacity.value = p.glow
            motes.material.uniforms.uOpacity.value = p.glow
            lamps.forEach(([light, base]) => { light.userData.base = base * p.lamps; light.intensity = light.userData.base })
        },
    }
}

const toPalette = (src) =>
    Object.fromEntries(Object.entries(src).map(([k, val]) => [k, typeof val === 'string' ? new THREE.Color(val) : val]))

function lerpPalette(cur, target, k) {
    for (const key in target) {
        if (target[key] instanceof THREE.Color) cur[key].lerp(target[key], k)
        else cur[key] += (target[key] - cur[key]) * k
    }
}

/** Map scroll position to a fractional waypoint index: each section's center is one waypoint. */
function sectionProgress(centers, y) {
    if (y <= centers[0]) return 0
    for (let i = 0; i < centers.length - 1; i++) {
        if (y < centers[i + 1]) return i + (y - centers[i]) / (centers[i + 1] - centers[i])
    }
    return centers.length - 1
}

function WorldScene() {
    const containerRef = useRef(null)
    const { isDark } = useTheme()
    const themeRef = useRef(isDark)
    const invalidateRef = useRef(() => {})
    const [status, setStatus] = useState('loading')

    useEffect(() => {
        themeRef.current = isDark
        invalidateRef.current()
    }, [isDark])

    useEffect(() => {
        const container = containerRef.current
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const lowPower = window.innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4

        let renderer
        try {
            renderer = new THREE.WebGLRenderer({ antialias: !lowPower, powerPreference: 'high-performance' })
        } catch {
            setStatus('failed')
            return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1.25 : 1.75))
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.05
        renderer.domElement.setAttribute('aria-hidden', 'true')
        container.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        scene.fog = new THREE.FogExp2('#000000', 0.018)
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 900)

        const world = buildWorld(scene, lowPower)
        const palette = toPalette(PALETTES[themeRef.current ? 'dark' : 'light'])
        world.applyPalette(palette)

        let composer = null
        if (!lowPower) {
            composer = new EffectComposer(renderer)
            composer.addPass(new RenderPass(scene, camera))
            composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.5, 0.82))
            composer.addPass(new OutputPass())
        }

        const posCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.pos)))
        const lookCurve = new THREE.CatmullRomCurve3(WAYPOINTS.map((w) => new THREE.Vector3(...w.look)))
        const camPos = posCurve.getPoint(0)
        const camLook = lookCurve.getPoint(0)
        const wantPos = new THREE.Vector3()
        const wantLook = new THREE.Vector3()
        const right = new THREE.Vector3()
        const pointer = { x: 0, y: 0, sx: 0, sy: 0 }

        let centers = []
        const measure = () => {
            const maxY = document.documentElement.scrollHeight - window.innerHeight / 2
            centers = SECTION_IDS.map((id) => {
                const el = document.getElementById(id)
                if (!el) return 0
                const r = el.getBoundingClientRect()
                return Math.min(r.top + window.scrollY + r.height / 2, maxY)
            })
        }
        measure()
        const ro = new ResizeObserver(() => { measure(); invalidate() })
        ro.observe(document.body)

        const clock = new THREE.Clock()
        let time = 0
        let frameId = 0
        let first = true

        const frame = () => {
            frameId = 0
            const dt = Math.min(clock.getDelta(), 0.1)
            if (!reduced) time += dt

            const target = PALETTES[themeRef.current ? 'dark' : 'light']
            lerpPalette(palette, toPaletteCache(target), reduced || first ? 1 : 1 - Math.exp(-dt * 3))
            world.applyPalette(palette)
            world.anim.forEach((fn) => fn(time))

            const u = sectionProgress(centers, window.scrollY + window.innerHeight / 2) / (WAYPOINTS.length - 1)
            posCurve.getPoint(u, wantPos)
            lookCurve.getPoint(u, wantLook)
            pointer.sx += (pointer.x - pointer.sx) * 0.05
            pointer.sy += (pointer.y - pointer.sy) * 0.05
            right.subVectors(wantLook, wantPos).cross(camera.up).normalize()
            wantPos.addScaledVector(right, pointer.sx * 0.8).addScaledVector(camera.up, -pointer.sy * 0.5)
            const k = reduced || first ? 1 : 1 - Math.exp(-dt * 4)
            camPos.lerp(wantPos, k)
            camLook.lerp(wantLook, k)
            camera.position.copy(camPos)
            camera.lookAt(camLook)

            if (composer) composer.render()
            else renderer.render(scene, camera)

            if (first) {
                first = false
                setStatus('ready')
            }
            if (!reduced && !document.hidden) frameId = requestAnimationFrame(frame)
        }

        // Reduced motion: render only when something changes.
        function invalidate() {
            if (!frameId) frameId = requestAnimationFrame(frame)
        }
        invalidateRef.current = invalidate

        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
            renderer.setSize(window.innerWidth, window.innerHeight)
            composer?.setSize(window.innerWidth, window.innerHeight)
            measure()
            invalidate()
        }
        const onPointer = (ev) => {
            pointer.x = (ev.clientX / window.innerWidth) * 2 - 1
            pointer.y = (ev.clientY / window.innerHeight) * 2 - 1
        }
        const onVisibility = () => {
            if (!document.hidden) {
                clock.getDelta()
                invalidate()
            }
        }
        window.addEventListener('resize', onResize)
        window.addEventListener('scroll', invalidate, { passive: true })
        document.addEventListener('visibilitychange', onVisibility)
        if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true })
        invalidate()

        return () => {
            cancelAnimationFrame(frameId)
            invalidateRef.current = () => {}
            ro.disconnect()
            window.removeEventListener('resize', onResize)
            window.removeEventListener('scroll', invalidate)
            document.removeEventListener('visibilitychange', onVisibility)
            window.removeEventListener('pointermove', onPointer)
            scene.traverse((obj) => {
                obj.geometry?.dispose()
                const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
                mats.forEach((m) => {
                    m?.map?.dispose()
                    m?.dispose()
                })
            })
            composer?.dispose()
            renderer.dispose()
            renderer.domElement.remove()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 z-0 bg-void transition-opacity duration-1000 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Vignette keeps foreground text readable over the scene */}
            <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.45)_100%)]" />
        </div>
    )
}

const paletteCache = new Map()
function toPaletteCache(src) {
    if (!paletteCache.has(src)) paletteCache.set(src, toPalette(src))
    return paletteCache.get(src)
}

export default WorldScene
