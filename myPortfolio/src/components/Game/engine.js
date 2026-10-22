import { HERO, SAGE, SLIME, CHEST, CHEST_OPEN, TREE, ICONS } from './sprites'
import { playSfx } from './sfx'

// Tiny tile-based overworld rendered at native pixel resolution, then scaled up crisp by CSS.

export const TILE = 16
export const MAP_W = 40
export const MAP_H = 24
const STEP = 0.17 // seconds per tile
const OUT = '#1B1424'
const FONT = '8px "Press Start 2P"'

const GRASS = 0
const FLOWER = 1
const PATH = 2
const PLAZA = 3
const WATER = 4
const BRIDGE = 5
const TREES = 6
const WALL = 7
const DOOR = 8
const SOLID = new Set([WATER, TREES, WALL, DOOR])

const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
const START = { x: 19, y: 11 }

export const BUILDINGS = [
    { id: 'home', label: 'HOME', x: 4, y: 3, w: 6, h: 5, roof: '#C8483C', icon: 'heart', chimney: true },
    { id: 'academy', label: 'ACADEMY', x: 14, y: 2, w: 6, h: 6, roof: '#7A4CC0', icon: 'star' },
    { id: 'guild', label: 'GUILD', x: 25, y: 3, w: 7, h: 5, roof: '#3A6AD0', icon: 'sword' },
    { id: 'hall', label: 'TROPHY', x: 6, y: 13, w: 7, h: 5, roof: '#D89A20', icon: 'trophy', pillars: true },
    { id: 'post', label: 'POST', x: 27, y: 13, w: 6, h: 5, roof: '#3A9A58', icon: 'letter' },
].map((b) => ({ ...b, door: { x: b.x + (b.w >> 1), y: b.y + b.h - 1 } }))

const LAMPS = [[10, 8], [22, 8], [34, 8], [16, 12], [23, 12], [16, 15], [23, 15], [15, 17], [24, 17]]

function seeded(seed) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

export function buildWorld() {
    const tiles = new Uint8Array(MAP_W * MAP_H)
    const at = (x, y) => (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H ? TREES : tiles[y * MAP_W + x])
    const rect = (x, y, w, h, t) => {
        for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) tiles[j * MAP_W + i] = t
    }

    rect(0, 0, MAP_W, 2, TREES)
    rect(0, 2, 2, 18, TREES)
    rect(MAP_W - 2, 2, 2, 18, TREES)
    rect(0, 22, MAP_W, 2, TREES)
    rect(0, 20, MAP_W, 2, WATER)
    rect(34, 3, 3, 3, WATER)
    rect(2, 9, 36, 2, PATH)
    rect(19, 9, 2, 11, PATH)
    rect(4, 18, 32, 2, PATH)
    rect(16, 12, 8, 4, PLAZA)
    rect(19, 20, 2, 2, BRIDGE)
    rect(19, 22, 2, 2, PATH)
    rect(21, 22, 1, 1, GRASS)
    for (const b of BUILDINGS) {
        rect(b.x, b.y, b.w, b.h, WALL)
        tiles[b.door.y * MAP_W + b.door.x] = DOOR
        for (let y = b.door.y + 1; at(b.door.x, y) !== PATH; y++) tiles[y * MAP_W + b.door.x] = PATH
    }

    // Solid props keyed by tile index; the fountain covers four tiles.
    const objects = new Map()
    const place = (o, w = 1, h = 1) => {
        for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) objects.set((o.y + j) * MAP_W + o.x + i, o)
    }
    place({ kind: 'fountain', x: 19, y: 13 }, 2, 2)
    place({ kind: 'sign', id: 'welcome', x: 22, y: 11 })
    place({ kind: 'sign', id: 'bridge', x: 21, y: 22 })
    place({ kind: 'chest', id: 'chest', x: 11, y: 7 })
    LAMPS.forEach(([x, y]) => place({ kind: 'lamp', x, y }))

    const rand = seeded(7)
    const open = (x, y) => [GRASS, TREES, FLOWER].includes(at(x, y)) && !objects.has(y * MAP_W + x)
    for (let y = 2; y < 20; y++) {
        for (let x = 2; x < MAP_W - 2; x++) {
            if (at(x, y) !== GRASS || objects.has(y * MAP_W + x)) continue
            let clear = true
            for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) clear &&= open(x + i, y + j)
            const r = rand()
            if (clear && r < 0.2) tiles[y * MAP_W + x] = TREES
            else if (r > 0.9) tiles[y * MAP_W + x] = FLOWER
        }
    }

    const trees = []
    for (let i = 0; i < tiles.length; i++) if (tiles[i] === TREES) trees.push({ x: i % MAP_W, y: (i / MAP_W) | 0 })

    if (import.meta.env?.DEV) {
        // Self-check: every door and interactable must be reachable from the start tile.
        const seen = new Set([START.y * MAP_W + START.x])
        const q = [...seen]
        for (let k = 0; k < q.length; k++) {
            const x = q[k] % MAP_W
            const y = (q[k] / MAP_W) | 0
            for (const [dx, dy] of Object.values(DIRS)) {
                const n = (y + dy) * MAP_W + x + dx
                if (!seen.has(n) && !SOLID.has(at(x + dx, y + dy)) && !objects.has(n)) seen.add(n) && q.push(n)
            }
        }
        for (const b of BUILDINGS) console.assert(seen.has((b.door.y + 1) * MAP_W + b.door.x), `door ${b.id} unreachable`)
    }

    return { tiles, at, objects, trees }
}

const canvasOf = (w, h) => Object.assign(document.createElement('canvas'), { width: w, height: h })
const lerp = (a, b, t) => a + (b - a) * t

function shade(hex, f) {
    const n = parseInt(hex.slice(1), 16)
    const ch = (s) => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f)))
    return `rgb(${ch(16)},${ch(8)},${ch(0)})`
}

// Rounded-corner rect drawn with hard pixels instead of anti-aliased arcs.
function chamfer(ctx, x, y, w, h, color) {
    ctx.fillStyle = color
    ctx.fillRect(x + 2, y, w - 4, h)
    ctx.fillRect(x + 1, y + 1, w - 2, h - 2)
    ctx.fillRect(x, y + 2, w, h - 4)
}

const spriteCache = new Map()
function sprite(art) {
    let c = spriteCache.get(art)
    if (!c) {
        c = canvasOf(art.rows[0].length, art.rows.length)
        const g = c.getContext('2d')
        art.rows.forEach((row, y) =>
            [...row].forEach((ch, x) => {
                if (ch === '.') return
                g.fillStyle = art.colors[ch]
                g.fillRect(x, y, 1, 1)
            }),
        )
        spriteCache.set(art, c)
    }
    return c
}

function drawSprite(ctx, art, x, y, flip = false) {
    const img = sprite(art)
    if (!flip) return ctx.drawImage(img, x, y)
    ctx.save()
    ctx.translate(x + img.width, y)
    ctx.scale(-1, 1)
    ctx.drawImage(img, 0, 0)
    ctx.restore()
}

function renderGround({ at }) {
    const c = canvasOf(MAP_W * TILE, MAP_H * TILE)
    const ctx = c.getContext('2d')
    const rand = seeded(42)
    const dot = (color, x, y, w = 1, h = 1) => {
        ctx.fillStyle = color
        ctx.fillRect(x, y, w, h)
    }
    const walkway = (t) => t === PATH || t === PLAZA || t === BRIDGE || t === DOOR

    for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
            const t = at(x, y)
            const px = x * TILE
            const py = y * TILE
            if (t === PATH) {
                dot('#D9B77A', px, py, TILE, TILE)
                for (let i = 0; i < 5; i++) dot(i % 2 ? '#C49A5C' : '#E8CC94', px + ((rand() * 15) | 0), py + ((rand() * 15) | 0))
                if (!walkway(at(x, y - 1))) dot('#B08850', px, py, TILE, 1)
                if (!walkway(at(x, y + 1))) dot('#B08850', px, py + 15, TILE, 1)
                if (!walkway(at(x - 1, y))) dot('#B08850', px, py, 1, TILE)
                if (!walkway(at(x + 1, y))) dot('#B08850', px + 15, py, 1, TILE)
            } else if (t === PLAZA) {
                dot('#CFC6B4', px, py, TILE, TILE)
                dot('#A9A08E', px, py + 7, TILE, 1)
                dot('#A9A08E', px, py + 15, TILE, 1)
                dot('#A9A08E', px + 7, py, 1, 7)
                dot('#A9A08E', px + 15, py + 8, 1, 7)
                dot('#E2DACA', px, py, 7, 1)
                dot('#E2DACA', px + 8, py + 8, 7, 1)
            } else if (t === WATER || t === BRIDGE) {
                dot('#3A88D8', px, py, TILE, TILE)
                if (at(x, y - 1) !== WATER && at(x, y - 1) !== BRIDGE) {
                    dot('#E8D8A0', px, py, TILE, 1)
                    dot('#2A68B0', px, py + 1, TILE, 3)
                }
                if (t === BRIDGE) {
                    dot('#A8743C', px, py, TILE, TILE)
                    for (let i = 0; i < TILE; i += 4) dot('#7A4E24', px, py + i, TILE, 1)
                    if (at(x - 1, y) !== BRIDGE) dot('#5E3A1E', px, py, 2, TILE)
                    if (at(x + 1, y) !== BRIDGE) dot('#5E3A1E', px + 14, py, 2, TILE)
                }
            } else {
                dot('#5CB848', px, py, TILE, TILE)
                for (let i = 0; i < 3; i++) {
                    const gx = px + 1 + ((rand() * 12) | 0)
                    const gy = py + 1 + ((rand() * 12) | 0)
                    dot('#4A9E3C', gx, gy + 1)
                    dot('#4A9E3C', gx + 1, gy)
                    dot('#4A9E3C', gx + 2, gy + 1)
                }
                dot('#78CC5A', px + ((rand() * 15) | 0), py + ((rand() * 15) | 0))
                if (t === FLOWER) {
                    const petal = ['#F8F8F8', '#F8D048', '#E86890', '#B868F8'][(rand() * 4) | 0]
                    const fx = px + 4 + ((rand() * 7) | 0)
                    const fy = py + 4 + ((rand() * 7) | 0)
                    dot(petal, fx - 1, fy)
                    dot(petal, fx + 1, fy)
                    dot(petal, fx, fy - 1)
                    dot(petal, fx, fy + 1)
                    dot('#F8B830', fx, fy)
                }
            }
        }
    }
    return c
}

const PAD = 4
const TOP = 12

function renderBuilding(b) {
    const W = b.w * TILE
    const H = b.h * TILE
    b.canvas = canvasOf(W + PAD * 2, H + TOP)
    const ctx = b.canvas.getContext('2d')
    ctx.translate(PAD, TOP)
    const wallTop = H - 30
    const doorX = (b.door.x - b.x) * TILE + 3

    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.fillRect(-2, H - 3, W + 6, 4)

    // Walls
    ctx.fillStyle = OUT
    ctx.fillRect(0, wallTop, W, 30)
    ctx.fillStyle = '#EADBB4'
    ctx.fillRect(1, wallTop + 1, W - 2, 28)
    ctx.fillStyle = '#8A5A30'
    ctx.fillRect(1, wallTop + 1, 2, 28)
    ctx.fillRect(W - 3, wallTop + 1, 2, 28)
    ctx.fillRect(1, wallTop + 1, W - 2, 2)
    ctx.fillStyle = '#8E8676'
    ctx.fillRect(1, H - 5, W - 2, 4)
    ctx.fillStyle = '#6E6858'
    for (let i = 4; i < W; i += 8) ctx.fillRect(i, H - 5, 1, 4)

    b.windows = []
    for (let i = 1; i < b.w - 1; i++) {
        const wx = i * TILE + 3
        if (Math.abs(wx - doorX) < 12) continue
        if (b.pillars) {
            ctx.fillStyle = OUT
            ctx.fillRect(wx + 2, wallTop + 3, 7, 22)
            ctx.fillStyle = '#F4F0E4'
            ctx.fillRect(wx + 3, wallTop + 4, 5, 20)
            ctx.fillStyle = '#C8C0B0'
            ctx.fillRect(wx + 6, wallTop + 4, 2, 20)
            continue
        }
        ctx.fillStyle = '#6A4428'
        ctx.fillRect(wx, wallTop + 7, 10, 10)
        ctx.fillStyle = '#6A90C8'
        ctx.fillRect(wx + 1, wallTop + 8, 8, 8)
        ctx.fillStyle = '#A8C8F0'
        ctx.fillRect(wx + 2, wallTop + 9, 2, 2)
        ctx.fillStyle = '#6A4428'
        ctx.fillRect(wx + 4, wallTop + 8, 1, 8)
        ctx.fillRect(wx + 1, wallTop + 11, 8, 1)
        ctx.fillStyle = '#5CB848'
        ctx.fillRect(wx - 1, wallTop + 17, 12, 3)
        ctx.fillStyle = '#E86890'
        ctx.fillRect(wx + 1, wallTop + 17, 1, 1)
        ctx.fillRect(wx + 5, wallTop + 18, 1, 1)
        ctx.fillRect(wx + 8, wallTop + 17, 1, 1)
        b.windows.push([b.x * TILE + wx + 1, b.y * TILE + wallTop + 8])
    }

    // Door
    chamfer(ctx, doorX - 1, H - 22, 12, 21, OUT)
    chamfer(ctx, doorX, H - 21, 10, 21, '#6A3E1E')
    ctx.fillStyle = '#4E2C14'
    ctx.fillRect(doorX + 3, H - 20, 1, 19)
    ctx.fillRect(doorX + 6, H - 20, 1, 19)
    ctx.fillStyle = '#F8D048'
    ctx.fillRect(doorX + 7, H - 11, 2, 2)
    ctx.fillStyle = '#A8A090'
    ctx.fillRect(doorX - 2, H - 2, 14, 2)

    // Roof: a trapezoid that overhangs the walls, with shingle rows.
    const r0 = -8
    const r1 = wallTop + 5
    for (let y = r0; y < r1; y++) {
        const k = (y - r0) / (r1 - r0)
        const inset = Math.round(8 - k * 11)
        const row = y - r0
        let color = row % 5 === 4 ? shade(b.roof, 0.72) : b.roof
        if (row < 2) color = shade(b.roof, 1.3)
        if (y >= r1 - 3) color = shade(b.roof, 0.55)
        ctx.fillStyle = OUT
        ctx.fillRect(inset, y, W - inset * 2, 1)
        ctx.fillStyle = color
        ctx.fillRect(inset + 1, y, W - inset * 2 - 2, 1)
        if (row % 5 > 0 && row % 5 < 4 && row > 1) {
            ctx.fillStyle = shade(b.roof, 0.82)
            for (let x = inset + 3 + ((row / 5) | 0) % 2 * 3; x < W - inset - 2; x += 6) ctx.fillRect(x, y, 1, 1)
        }
    }
    ctx.fillStyle = OUT
    ctx.fillRect(-3, r1 - 1, W + 6, 1)

    if (b.chimney) {
        ctx.fillStyle = OUT
        ctx.fillRect(W - 22, r0 - 4, 9, 14)
        ctx.fillStyle = '#9A4A3A'
        ctx.fillRect(W - 21, r0 - 3, 7, 12)
        ctx.fillStyle = '#7A3A2A'
        ctx.fillRect(W - 21, r0 + 1, 7, 1)
        b.smoke = [b.x * TILE + W - 18, b.y * TILE + r0 - 4]
    }

    // Emblem medallion on the roof
    const icon = ICONS[b.icon]
    const mx = (W >> 1) - 8
    const my = ((r0 + r1) >> 1) - 9
    chamfer(ctx, mx, my, 16, 14, OUT)
    chamfer(ctx, mx + 1, my + 1, 14, 12, '#F4E8C8')
    ctx.drawImage(sprite(icon), mx + 8 - (icon.rows[0].length >> 1), my + 7 - (icon.rows.length >> 1))

    // Name plate over the door
    ctx.font = FONT
    const tw = Math.ceil(ctx.measureText(b.label).width)
    const plateX = Math.round(doorX + 5 - tw / 2 - 4)
    const plateY = wallTop - 6
    ctx.fillStyle = OUT
    ctx.fillRect(plateX, plateY, tw + 8, 12)
    ctx.fillStyle = '#6A3E1E'
    ctx.fillRect(plateX + 1, plateY + 1, tw + 6, 10)
    ctx.fillStyle = '#FFE8B0'
    ctx.textBaseline = 'top'
    ctx.fillText(b.label, plateX + 4, plateY + 2)
}

export function createGame({ canvas, container, onEvent, reduceMotion, night: startNight }) {
    const ctx = canvas.getContext('2d')
    const world = buildWorld()
    const { at, objects, trees } = world
    const ground = renderGround(world)
    BUILDINGS.forEach(renderBuilding)
    document.fonts?.load(FONT).then(() => {
        BUILDINGS.forEach(renderBuilding)
        if (!active) render()
    })

    const hero = { x: START.x, y: START.y, fx: START.x, fy: START.y, t: 1, dir: 'down', steps: 0, path: null, goal: null }
    const npcs = [
        { id: 'sage', art: SAGE, x: 17, y: 13, fx: 17, fy: 13, t: 1 },
        { id: 'slime', art: SLIME, x: 33, y: 11, fx: 33, fy: 11, t: 1, wait: 1, flip: false, area: [24, 11, 37, 12] },
    ]
    const rnd = Math.random
    const fireflies = Array.from({ length: 30 }, () => ({ x: rnd() * MAP_W * TILE, y: rnd() * 20 * TILE, p: rnd() * 10 }))
    const particles = []
    const light = canvasOf(1, 1)
    const lctx = light.getContext('2d')

    let held = []
    let paused = false
    let night = startNight ? 1 : 0
    let nightTarget = night
    let time = 0
    let party = 0
    let lastBump = 0
    let smokeTimer = 0
    let camX = 0
    let camY = 0
    let scale = 3
    let viewW = 1
    let viewH = 1
    let snap = true
    let active = false
    let raf = 0
    let last = 0

    const npcAt = (x, y) => npcs.find((n) => n.x === x && n.y === y)
    const blocked = (x, y) => SOLID.has(at(x, y)) || objects.has(y * MAP_W + x) || !!npcAt(x, y)
    const facing = () => [hero.x + DIRS[hero.dir][0], hero.y + DIRS[hero.dir][1]]

    function thingAt(x, y) {
        if (at(x, y) === DOOR) return { type: 'door', id: BUILDINGS.find((b) => b.door.x === x && b.door.y === y).id, x, y }
        const n = npcAt(x, y)
        if (n) return { type: 'npc', id: n.id, ref: n, x, y }
        const o = objects.get(y * MAP_W + x)
        if (o?.id) return { type: o.kind, id: o.id, ref: o, x, y }
        return null
    }

    function interact(thing) {
        if (thing.id === 'sage') thing.ref.talked = true
        let first = false
        if (thing.type === 'chest') {
            first = !thing.ref.open
            thing.ref.open = true
            if (first) burst(thing.x * TILE + 8, thing.y * TILE + 4, 24, ['#F8D048', '#FFFFFF', '#FFF4C0'])
        }
        held = []
        hero.path = null
        onEvent({ type: thing.type, id: thing.id, first })
    }

    function startStep(dir) {
        hero.dir = dir
        const nx = hero.x + DIRS[dir][0]
        const ny = hero.y + DIRS[dir][1]
        if (at(nx, ny) === DOOR) {
            interact(thingAt(nx, ny))
            return false
        }
        if (blocked(nx, ny)) {
            if (time - lastBump > 0.35) playSfx('bump')
            lastBump = time
            return false
        }
        hero.fx = hero.x
        hero.fy = hero.y
        hero.x = nx
        hero.y = ny
        hero.t = 0
        hero.steps++
        return true
    }

    function nextStep() {
        if (held.length) {
            hero.path = null
            hero.goal = null
            return startStep(held[held.length - 1])
        }
        if (hero.path?.length) {
            const n = hero.path.shift()
            const dir = n.x > hero.x ? 'right' : n.x < hero.x ? 'left' : n.y > hero.y ? 'down' : 'up'
            if (startStep(dir)) return true
            hero.path = null
            hero.goal = null
            return false
        }
        if (hero.goal) {
            const g = hero.goal
            hero.goal = null
            hero.dir = g.x > hero.x ? 'right' : g.x < hero.x ? 'left' : g.y > hero.y ? 'down' : 'up'
            const thing = thingAt(g.x, g.y)
            if (thing) interact(thing)
        }
        return false
    }

    function findPath(goals) {
        const start = hero.y * MAP_W + hero.x
        const prev = new Int32Array(MAP_W * MAP_H).fill(-2)
        prev[start] = -1
        const q = [start]
        for (let i = 0; i < q.length; i++) {
            const cur = q[i]
            if (goals.has(cur)) {
                const path = []
                for (let c = cur; c !== start; c = prev[c]) path.unshift({ x: c % MAP_W, y: (c / MAP_W) | 0 })
                return path
            }
            const x = cur % MAP_W
            const y = (cur / MAP_W) | 0
            for (const [dx, dy] of Object.values(DIRS)) {
                const nx = x + dx
                const ny = y + dy
                const ni = ny * MAP_W + nx
                if (nx < 0 || ny < 0 || nx >= MAP_W || ny >= MAP_H || prev[ni] !== -2 || blocked(nx, ny)) continue
                prev[ni] = cur
                q.push(ni)
            }
        }
        return null
    }

    function burst(x, y, n, colors, spread = 60) {
        if (reduceMotion) return
        for (let i = 0; i < n; i++) {
            const a = rnd() * Math.PI * 2
            const s = spread * (0.4 + rnd() * 0.6)
            particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - spread * 0.6, g: 140, life: 0.8 + rnd() * 0.8, max: 1.6, color: colors[i % colors.length], size: 1 + (rnd() * 2) | 0 })
        }
    }

    function update(dt) {
        time += dt
        night += (nightTarget - night) * Math.min(1, dt * 2.5)
        if (party > 0) party -= dt

        if (hero.t < 1) {
            hero.t += dt / STEP
            if (hero.t >= 1) {
                const extra = hero.t - 1
                hero.t = 1
                if (!reduceMotion && hero.steps % 2) {
                    const c = at(hero.x, hero.y) === GRASS || at(hero.x, hero.y) === FLOWER ? '#9AD880' : '#EADCB8'
                    particles.push({ x: hero.x * TILE + 4, y: hero.y * TILE + 14, vx: -8, vy: -6, g: 0, life: 0.3, max: 0.3, color: c, size: 2 })
                    particles.push({ x: hero.x * TILE + 11, y: hero.y * TILE + 14, vx: 8, vy: -6, g: 0, life: 0.3, max: 0.3, color: c, size: 2 })
                }
                if (!paused && nextStep()) hero.t = Math.min(extra, 0.9)
            }
        } else if (!paused) nextStep()

        if (!paused) {
            for (const n of npcs) {
                if (n.t < 1) n.t = Math.min(1, n.t + dt / (STEP * 2.4))
                else if (n.area && !reduceMotion && (n.wait -= dt) <= 0) {
                    n.wait = 1 + rnd() * 2
                    const [dx, dy] = Object.values(DIRS)[(rnd() * 4) | 0]
                    const nx = n.x + dx
                    const ny = n.y + dy
                    const [x0, y0, x1, y1] = n.area
                    const heroThere = (nx === hero.x && ny === hero.y) || (nx === hero.fx && ny === hero.fy)
                    if (nx >= x0 && nx <= x1 && ny >= y0 && ny <= y1 && !blocked(nx, ny) && !heroThere) {
                        Object.assign(n, { fx: n.x, fy: n.y, x: nx, y: ny, t: 0 })
                        if (dx) n.flip = dx < 0
                    }
                }
            }
        }

        if (!reduceMotion) {
            const home = BUILDINGS[0]
            if ((smokeTimer -= dt) <= 0 && home.smoke) {
                smokeTimer = 0.45
                particles.push({ x: home.smoke[0] + rnd() * 3, y: home.smoke[1], vx: 3 + rnd() * 3, vy: -9, g: 0, life: 2.4, max: 2.4, color: '#E4E4EC', size: 2 + ((rnd() * 2) | 0) })
            }
            if (party > 0 && rnd() < 0.6) {
                const hx = lerp(hero.fx, hero.x, hero.t) * TILE
                const hy = lerp(hero.fy, hero.y, hero.t) * TILE
                particles.push({ x: hx + rnd() * 16, y: hy + rnd() * 16, vx: 0, vy: -14, g: 0, life: 0.7, max: 0.7, color: `hsl(${(time * 360) % 360} 90% 65%)`, size: 1 })
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i]
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.vy += p.g * dt
            if ((p.life -= dt) <= 0) particles.splice(i, 1)
        }

        const hx = lerp(hero.fx, hero.x, hero.t) * TILE + 8
        const hy = lerp(hero.fy, hero.y, hero.t) * TILE + 8
        const clamp = (v, max) => (max < 0 ? max / 2 : Math.max(0, Math.min(max, v)))
        const tx = clamp(hx - viewW / 2, MAP_W * TILE - viewW)
        const ty = clamp(hy - viewH / 2, MAP_H * TILE - viewH)
        const k = snap || reduceMotion ? 1 : Math.min(1, dt * 6)
        camX += (tx - camX) * k
        camY += (ty - camY) * k
        snap = false
    }

    function render() {
        const cx = Math.round(camX)
        const cy = Math.round(camY)
        const t = reduceMotion ? 0 : time
        const vis = (x, y, w, h) => x + w > cx && x < cx + viewW && y + h > cy && y < cy + viewH
        const px = (x, y, w, h, color) => {
            ctx.fillStyle = color
            ctx.fillRect(Math.round(x), Math.round(y), w, h)
        }

        ctx.fillStyle = '#24502A'
        ctx.fillRect(0, 0, viewW, viewH)
        ctx.save()
        ctx.translate(-cx, -cy)
        ctx.drawImage(ground, 0, 0)

        // Water shimmer
        const x0 = Math.max(0, Math.floor(cx / TILE))
        const y0 = Math.max(0, Math.floor(cy / TILE))
        for (let y = y0; y <= Math.min(MAP_H - 1, y0 + viewH / TILE + 1); y++) {
            for (let x = x0; x <= Math.min(MAP_W - 1, x0 + viewW / TILE + 1); x++) {
                if (at(x, y) !== WATER) continue
                const off = Math.round(Math.sin(t * 1.6 + x * 1.3 + y * 0.7) * 3)
                px(x * TILE + 5 + off, y * TILE + 6, 4, 1, '#8AC8F8')
                px(x * TILE + 9 - off, y * TILE + 12, 3, 1, '#6AB0F0')
            }
        }

        const items = []
        for (const tr of trees) {
            if (vis(tr.x * TILE, tr.y * TILE - 6, TILE, 22)) items.push([(tr.y + 1) * TILE, () => ctx.drawImage(sprite(TREE), tr.x * TILE, tr.y * TILE - 6)])
        }
        for (const b of BUILDINGS) {
            items.push([
                (b.y + b.h) * TILE,
                () => {
                    ctx.drawImage(b.canvas, b.x * TILE - PAD, b.y * TILE - TOP)
                    if (night > 0.05) {
                        ctx.globalAlpha = night
                        for (const [wx, wy] of b.windows) {
                            px(wx, wy, 8, 8, '#FFD860')
                            px(wx + 3, wy, 1, 8, '#C89A40')
                            px(wx, wy + 3, 8, 1, '#C89A40')
                        }
                        ctx.globalAlpha = 1
                    }
                },
            ])
        }
        const seenObj = new Set()
        for (const o of objects.values()) {
            if (seenObj.has(o)) continue
            seenObj.add(o)
            const ox = o.x * TILE
            const oy = o.y * TILE
            if (!vis(ox - 8, oy - 16, 48, 48)) continue
            if (o.kind === 'fountain') {
                items.push([
                    oy + 32,
                    () => {
                        chamfer(ctx, ox, oy + 3, 32, 28, OUT)
                        chamfer(ctx, ox + 1, oy + 4, 30, 26, '#C8C0B0')
                        chamfer(ctx, ox + 4, oy + 8, 24, 19, '#4A98E0')
                        px(ox + 5, oy + 8, 22, 2, '#2A68B0')
                        for (let i = 0; i < 3; i++) {
                            const r = ((t * 6 + i * 4) % 12) | 0
                            px(ox + 16 - r, oy + 19 + (i % 2) * 3, 2, 1, '#9AD0FF')
                            px(ox + 14 + r, oy + 21 - (i % 2) * 3, 2, 1, '#9AD0FF')
                        }
                        chamfer(ctx, ox + 12, oy + 4, 8, 17, OUT)
                        px(ox + 13, oy + 5, 6, 15, '#E0D8C8')
                        px(ox + 17, oy + 5, 2, 15, '#B8B0A0')
                        for (let i = 0; i < 8; i++) {
                            const k = (t * 1.4 + i / 8) % 1
                            const side = i % 2 ? 1 : -1
                            px(ox + 16 + side * k * 9, oy + 2 - Math.sin(k * Math.PI) * 7 + k * 12, 1, 2, '#CFEAFF')
                        }
                    },
                ])
            } else if (o.kind === 'lamp') {
                items.push([
                    oy + 16,
                    () => {
                        px(ox + 4, oy + 13, 8, 3, OUT)
                        px(ox + 7, oy - 6, 3, 20, OUT)
                        px(ox + 8, oy - 5, 1, 18, '#5A5468')
                        px(ox + 4, oy - 14, 9, 2, OUT)
                        px(ox + 5, oy - 12, 7, 8, OUT)
                        px(ox + 6, oy - 11, 5, 6, night > 0.3 ? '#FFE890' : '#C8D4DC')
                    },
                ])
            } else if (o.kind === 'sign') {
                items.push([
                    oy + 16,
                    () => {
                        px(ox + 7, oy + 6, 2, 10, OUT)
                        px(ox + 1, oy + 1, 14, 9, OUT)
                        px(ox + 2, oy + 2, 12, 7, '#C08A4A')
                        px(ox + 4, oy + 4, 8, 1, '#8A5A2A')
                        px(ox + 4, oy + 6, 6, 1, '#8A5A2A')
                    },
                ])
            } else if (o.kind === 'chest') {
                items.push([
                    oy + 16,
                    () => {
                        drawSprite(ctx, o.open ? CHEST_OPEN : CHEST, ox, oy)
                        if (!o.open && (t * 1.2) % 2 < 0.3) {
                            px(ox + 12, oy + 2, 1, 5, '#FFFFFF')
                            px(ox + 10, oy + 4, 5, 1, '#FFFFFF')
                        }
                    },
                ])
            }
        }
        for (const n of npcs) {
            const nx = lerp(n.fx, n.x, n.t) * TILE
            const ny = lerp(n.fy, n.y, n.t) * TILE
            items.push([
                ny + 16,
                () => {
                    ctx.fillStyle = 'rgba(0,0,0,0.25)'
                    ctx.fillRect(Math.round(nx) + 3, Math.round(ny) + 13, 10, 3)
                    if (n.id === 'slime') {
                        const hop = n.t < 1 ? Math.sin(n.t * Math.PI) * 5 : 0
                        const squash = n.t >= 1 && Math.floor(t * 2.5) % 2
                        const img = sprite(n.art)
                        ctx.save()
                        ctx.translate(Math.round(nx) + (n.flip ? 16 : 0), Math.round(ny - hop))
                        if (n.flip) ctx.scale(-1, 1)
                        if (squash) ctx.drawImage(img, -1, 2, 18, 14)
                        else ctx.drawImage(img, 0, 0)
                        ctx.restore()
                    } else {
                        const bob = Math.floor(t * 1.6) % 2
                        drawSprite(ctx, n.art, Math.round(nx), Math.round(ny) - 3 - bob)
                        if (!n.talked) {
                            const by = Math.round(ny) - 16 - (Math.floor(t * 3) % 2)
                            chamfer(ctx, nx + 4, by, 8, 10, OUT)
                            chamfer(ctx, nx + 5, by + 1, 6, 8, '#FFFFFF')
                            px(nx + 7, by + 2, 2, 4, '#E84848')
                            px(nx + 7, by + 7, 2, 1, '#E84848')
                        }
                    }
                },
            ])
        }
        const hx = Math.round(lerp(hero.fx, hero.x, hero.t) * TILE)
        const hy = Math.round(lerp(hero.fy, hero.y, hero.t) * TILE)
        items.push([
            hy + 16,
            () => {
                ctx.fillStyle = 'rgba(0,0,0,0.28)'
                ctx.fillRect(hx + 3, hy + 13, 10, 3)
                ctx.fillRect(hx + 4, hy + 12, 8, 5)
                const frames = HERO[hero.dir === 'left' ? 'right' : hero.dir]
                const frame = hero.t < 1 && hero.t < 0.6 ? (hero.steps % 2 ? 3 : 1) : 0
                drawSprite(ctx, frames[frame], hx, hy - 3, hero.dir === 'left')
            },
        ])
        items.sort((a, b) => a[0] - b[0])
        items.forEach(([, draw]) => draw())

        // "Press A" marker over whatever the hero faces
        if (hero.t >= 1 && !paused) {
            const [fx, fy] = facing()
            const thing = thingAt(fx, fy)
            if (thing) {
                const bx = fx * TILE + 5
                const by = fy * TILE - (thing.type === 'door' ? 8 : 14) - (Math.floor(t * 3) % 2)
                px(bx - 1, by - 1, 8, 5, OUT)
                px(bx, by, 6, 1, '#F8D048')
                px(bx + 1, by + 1, 4, 1, '#F8D048')
                px(bx + 2, by + 2, 2, 1, '#F8D048')
            }
        }

        for (const p of particles) {
            ctx.globalAlpha = Math.min(1, p.life / p.max + 0.2)
            px(p.x, p.y, p.size, p.size, p.color)
        }
        ctx.globalAlpha = 1

        // Day: drifting cloud shadows and butterflies
        if (night < 0.95) {
            ctx.globalAlpha = 1 - night
            ctx.fillStyle = 'rgba(10,40,20,0.12)'
            for (let i = 0; i < 3; i++) {
                const span = MAP_W * TILE + 260
                const x = ((i * 260 + t * 7) % span) - 130
                const y = 50 + i * 120
                ctx.beginPath()
                ctx.ellipse(x, y, 46, 16, 0, 0, Math.PI * 2)
                ctx.ellipse(x + 30, y - 8, 30, 14, 0, 0, Math.PI * 2)
                ctx.ellipse(x - 28, y + 4, 26, 11, 0, 0, Math.PI * 2)
                ctx.fill()
            }
            for (let i = 0; i < 5; i++) {
                const bx = 80 + i * 110 + Math.sin(t * 0.6 + i) * 34
                const by = 60 + ((i * 70) % 260) + Math.cos(t * 0.8 + i * 2) * 22
                const open = Math.floor(t * 8 + i) % 2
                const color = ['#F8F8F8', '#F8D048', '#F890B8'][i % 3]
                px(bx, by, 1, 2, OUT)
                px(bx - (open ? 2 : 1), by - 1, open ? 2 : 1, 2, color)
                px(bx + 1, by - 1, open ? 2 : 1, 2, color)
            }
            ctx.globalAlpha = 1
        }
        ctx.restore()

        // Night: darken everything, then punch holes for lights.
        if (night > 0.02) {
            const lights = [[hx + 8, hy + 8, party > 0 ? 70 : 46]]
            LAMPS.forEach(([x, y]) => lights.push([x * TILE + 8, y * TILE - 8, 50 + Math.sin(t * 7 + x) * 1.5]))
            BUILDINGS.forEach((b) => b.windows.forEach(([x, y]) => lights.push([x + 4, y + 4, 20])))
            lights.push([20 * TILE, 14 * TILE, 26])
            const flies = fireflies.map((f) => [
                f.x + Math.sin(t * 0.5 + f.p) * 14,
                f.y + Math.cos(t * 0.4 + f.p * 2) * 10,
                (Math.sin(t * 3 + f.p) + 1) / 2,
            ])
            flies.forEach(([x, y, a]) => a > 0.5 && lights.push([x, y, 8]))

            lctx.globalCompositeOperation = 'source-over'
            lctx.clearRect(0, 0, viewW, viewH)
            lctx.fillStyle = `rgba(6,10,42,${0.74 * night})`
            lctx.fillRect(0, 0, viewW, viewH)
            lctx.globalCompositeOperation = 'destination-out'
            for (const [x, y, r] of lights) {
                const lx = x - cx
                const ly = y - cy
                if (lx < -r || ly < -r || lx > viewW + r || ly > viewH + r) continue
                const g = lctx.createRadialGradient(lx, ly, 0, lx, ly, r)
                g.addColorStop(0, 'rgba(0,0,0,0.95)')
                g.addColorStop(0.5, 'rgba(0,0,0,0.6)')
                g.addColorStop(1, 'rgba(0,0,0,0)')
                lctx.fillStyle = g
                lctx.fillRect(lx - r, ly - r, r * 2, r * 2)
            }
            ctx.drawImage(light, 0, 0)

            ctx.globalCompositeOperation = 'lighter'
            for (const [x, y] of LAMPS) {
                const lx = x * TILE + 8 - cx
                const ly = y * TILE - 8 - cy
                const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 36)
                g.addColorStop(0, `rgba(255,190,90,${0.28 * night})`)
                g.addColorStop(1, 'rgba(255,190,90,0)')
                ctx.fillStyle = g
                ctx.fillRect(lx - 36, ly - 36, 72, 72)
            }
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle = '#FFF8A0'
            for (const [x, y, a] of flies) {
                ctx.globalAlpha = a * night
                ctx.fillRect(Math.round(x - cx), Math.round(y - cy), 1, 1)
            }
            ctx.globalAlpha = 1
        }
    }

    function frame(now) {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        update(dt)
        render()
        raf = requestAnimationFrame(frame)
    }

    function resize() {
        const w = container.clientWidth
        const h = container.clientHeight
        scale = Math.max(2, Math.ceil(Math.max(w / (MAP_W * TILE), h / (MAP_H * TILE))))
        viewW = Math.ceil(w / scale)
        viewH = Math.ceil(h / scale)
        canvas.width = light.width = viewW
        canvas.height = light.height = viewH
        canvas.style.width = `${viewW * scale}px`
        canvas.style.height = `${viewH * scale}px`
        ctx.imageSmoothingEnabled = false
        snap = true
        update(0)
        render()
    }

    resize()

    return {
        resize,
        setActive(on) {
            if (on === active) return
            active = on
            if (on) {
                last = performance.now()
                raf = requestAnimationFrame(frame)
            } else cancelAnimationFrame(raf)
        },
        setNight(on) {
            nightTarget = on ? 1 : 0
            if (!active) {
                night = nightTarget
                render()
            }
        },
        setPaused(on) {
            paused = on
            held = []
        },
        press(dir, down) {
            held = held.filter((d) => d !== dir)
            if (down) held.push(dir)
        },
        release() {
            held = []
        },
        action() {
            if (paused || hero.t < 1) return
            const thing = thingAt(...facing())
            if (thing) interact(thing)
        },
        tap(clientX, clientY) {
            if (paused) return
            const r = canvas.getBoundingClientRect()
            const tx = Math.floor(((clientX - r.left) / scale + Math.round(camX)) / TILE)
            const ty = Math.floor(((clientY - r.top) / scale + Math.round(camY)) / TILE)
            const b = BUILDINGS.find((b) => tx >= b.x && tx < b.x + b.w && ty >= b.y - 1 && ty < b.y + b.h)
            const target = b ? b.door : thingAt(tx, ty) ? { x: tx, y: ty } : null
            const goals = new Set()
            if (target) {
                const sides = b ? [[0, 1]] : Object.values(DIRS)
                sides.forEach(([dx, dy]) => goals.add((target.y + dy) * MAP_W + target.x + dx))
            } else if (!blocked(tx, ty)) goals.add(ty * MAP_W + tx)
            const path = goals.size && findPath(goals)
            if (!path) return playSfx('bump')
            held = []
            hero.path = path
            hero.goal = target
            if (!reduceMotion) burst(tx * TILE + 8, ty * TILE + 8, 6, ['#F8D048'], 30)
        },
        party() {
            party = 10
            burst(hero.x * TILE + 8, hero.y * TILE, 90, ['#E84848', '#F8D048', '#58D868', '#48A8F8', '#B868F8'], 110)
        },
        destroy() {
            cancelAnimationFrame(raf)
            active = false
        },
    }
}
