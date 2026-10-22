// Hand-drawn pixel art shared by the canvas overworld and the SVG UI icons.
// Each art is { rows, colors }: one string per row, one char per pixel, '.' = transparent.

const OUTLINE = '#1B1424'

const HERO_COLORS = {
    k: OUTLINE,
    h: '#2A2238',
    H: '#4E4268',
    s: '#F6C89F',
    S: '#D9966B',
    e: OUTLINE,
    c: '#3E6FE0',
    C: '#2647A8',
    r: '#D8433A',
    b: '#7A4A24',
    y: '#F8D048',
    p: '#3B3552',
    o: '#5B3A1E',
}

const HERO_FRONT_TOP = [
    '................',
    '.....kkkkkk.....',
    '....khhhhhhk....',
    '...khhHHhhhhk...',
    '...khhhhhhhhk...',
    '...khsssssshk...',
    '...ksessssesk...',
    '...kssssssssk...',
    '....krrrrrrk....',
    '...kcccrrccck...',
    '..kscCccccCcsk..',
    '...kCbbyybbCk...',
    '...kCccccccCk...',
]

const HERO_BACK_TOP = [
    ...HERO_FRONT_TOP.slice(0, 5),
    '...khhhhhhhhk...',
    '...khhhhhhhhk...',
    '...kShhhhhhSk...',
    '....krrrrrrk....',
    '...kcccccccck...',
    '..kscCccccCcsk..',
    '...kCbbbbbbCk...',
    '...kCccccccCk...',
]

const LEGS_STAND = ['....kppkkppk....', '....kookkook....', '....kkkkkkkk....']
const LEGS_STEP = ['....kppkkppk....', '....kookkppk....', '....kkkkkook....']
const mirror = (rows) => rows.map((r) => [...r].reverse().join(''))

const HERO_SIDE_TOP = [
    '................',
    '.....kkkkk......',
    '....khhhhhk.....',
    '...khhHHhhhk....',
    '...khhhhhhhhk...',
    '...khhhhssssk...',
    '...khhhsssesk...',
    '....khsssssk....',
    '.....krrrrk.....',
    '....krrcccck....',
    '....kccCssk.....',
    '....kbbbyk......',
    '....kCcccck.....',
]
const SIDE_STAND = ['.....kppk.......', '.....kook.......', '.....kkkk.......']
const SIDE_STEP = ['....kpkkpk......', '...kok..kok.....', '...kk....kk.....']

const hero = (rows) => ({ rows, colors: HERO_COLORS })

// Walk cycles per facing; 'left' is drawn as 'right' flipped.
export const HERO = {
    down: [
        hero([...HERO_FRONT_TOP, ...LEGS_STAND]),
        hero([...HERO_FRONT_TOP, ...LEGS_STEP]),
        hero([...HERO_FRONT_TOP, ...LEGS_STAND]),
        hero([...HERO_FRONT_TOP, ...mirror(LEGS_STEP)]),
    ],
    up: [
        hero([...HERO_BACK_TOP, ...LEGS_STAND]),
        hero([...HERO_BACK_TOP, ...LEGS_STEP]),
        hero([...HERO_BACK_TOP, ...LEGS_STAND]),
        hero([...HERO_BACK_TOP, ...mirror(LEGS_STEP)]),
    ],
    right: [
        hero([...HERO_SIDE_TOP, ...SIDE_STAND]),
        hero([...HERO_SIDE_TOP, ...SIDE_STEP]),
        hero([...HERO_SIDE_TOP, ...SIDE_STAND]),
        hero([...HERO_SIDE_TOP, ...SIDE_STEP]),
    ],
}

export const SAGE = {
    rows: [
        '.......kk.......',
        '......kppk......',
        '.....kpypPk.....',
        '.....kppPPk.....',
        '....kpppppPk....',
        '..kkkkkkkkkkkk..',
        '....ksesseSk....',
        '....kwwsswwk....',
        '...kwwwwwwwwk...',
        '...kpwwwwwwpk...',
        '..kspPwwwwPpsk..',
        '..kkpPpwwpPpkk..',
        '...kpPppppPpk...',
        '...kpPppppPpk...',
        '...kPPPPPPPPk...',
        '....kkkkkkkk....',
    ],
    colors: { k: OUTLINE, p: '#8A4CD0', P: '#5A2C94', y: '#F8D048', s: '#F6C89F', S: '#D9966B', e: OUTLINE, w: '#F4F0E8' },
}

export const SLIME = {
    rows: [
        '................',
        '................',
        '................',
        '.......kk.......',
        '......kbbk......',
        '.....kbbbbk.....',
        '....kbwbbbbk....',
        '...kbwbbbbbbk...',
        '...kbbbbbbbbk...',
        '..kbbkbbbbkbbk..',
        '..kbbkbbbbkbbk..',
        '..kbbbbbbbbbbk..',
        '..kbbbbkkbbbbk..',
        '..kBbbbbbbbbBk..',
        '...kBBBBBBBBk...',
        '....kkkkkkkk....',
    ],
    colors: { k: OUTLINE, b: '#4CB8F0', B: '#2A78C0', w: '#FFFFFF' },
}

const CHEST_COLORS = { k: OUTLINE, b: '#A8642C', B: '#7A4420', y: '#F8D048', d: '#2A1A14' }
const CHEST_BASE = [
    '.kkkkkkyykkkkkk.',
    '.kbbbbkyykbbbbk.',
    '.kbbbbbkkbbbbbk.',
    '.kbBBBBBBBBBBbk.',
    '.kyyyyyyyyyyyyk.',
    '.kbbbbbbbbbbbbk.',
    '.kkkkkkkkkkkkkk.',
    '................',
]
export const CHEST = {
    rows: [
        '................',
        '................',
        '................',
        '..kkkkkkkkkkkk..',
        '.kbbbbbbbbbbbbk.',
        '.kbBBBBBBBBBBbk.',
        '.kyyyyyyyyyyyyk.',
        '.kbbbbbkkbbbbbk.',
        ...CHEST_BASE,
    ],
    colors: CHEST_COLORS,
}
export const CHEST_OPEN = {
    rows: [
        '..kkkkkkkkkkkk..',
        '.kbBBBBBBBBBBbk.',
        '.kyyyyyyyyyyyyk.',
        '.kkkkkkkkkkkkkk.',
        '.kddddddddddddk.',
        '.kddyddddddyddk.',
        '.kddddddddddddk.',
        '.kbbbbbkkbbbbbk.',
        ...CHEST_BASE,
    ],
    colors: CHEST_COLORS,
}

export const TREE = {
    rows: [
        '.....kkkkkk.....',
        '...kkllggggGkk..',
        '..kllggggggGGk..',
        '.kllgggggggGGGk.',
        '.klggggggggGGGk.',
        'kgggggggggGGGGGk',
        'kggggggggGGGGGGk',
        'kGgggggggGGGGGdk',
        'kGGgggggGGGGGddk',
        '.kGGGGGGGGGGddk.',
        '.kdGGGGGGGGdddk.',
        '..kddGGGGdddkk..',
        '...kkddddkkk....',
        '......ktTk......',
        '......ktTk......',
        '.....kttTTk.....',
    ],
    colors: { k: '#16301C', l: '#9BE070', g: '#5CB848', G: '#3A8A3A', d: '#24602C', t: '#8A5A30', T: '#5E3A1E' },
}

// --- UI icons (no outline, read well at small sizes) ---

export const ICONS = {
    heart: {
        rows: ['.rr.rr.', 'rwrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'],
        colors: { r: '#E84848', w: '#FFC8C8' },
    },
    star: {
        rows: ['....y....', '...yyy...', 'yyyyyyyyy', '.yyyyyyy.', '..yyyyy..', '.yyy.yyy.', '.yy...yy.'],
        colors: { y: '#F8D048' },
    },
    sword: {
        rows: ['......ww', '.....wwg', '....wwg.', '.y.wwg..', '..ywg...', '..by....', '.b..y...', 'b.......'],
        colors: { w: '#E8EEF8', g: '#9AA8C0', y: '#F8D048', b: '#B07830' },
    },
    trophy: {
        rows: ['y.yyyyy.y', 'y.ywyyy.y', '.yywyyyy.', '..yyyyy..', '...yyy...', '....y....', '....y....', '..bbbbb..', '..bbbbb..'],
        colors: { y: '#F8D048', w: '#FFF4C0', b: '#8A5A2B' },
    },
    letter: {
        rows: ['wwwwwwwww', 'gwwwwwwwg', 'wgwwwwwgw', 'wwgwwwgww', 'wwwgrgwww', 'wwwwwwwww', 'wwwwwwwww'],
        colors: { w: '#F4F0E0', g: '#8A7A6A', r: '#E84848' },
    },
    scroll: {
        rows: ['bwwwwwwb', '.wggggw.', '.wwwwww.', '.wggggw.', '.wwwwww.', '.wgggw..', 'bwwwwwwb'],
        colors: { w: '#F4E4C0', g: '#8A6A4A', b: '#A8642C' },
    },
    sun: {
        rows: ['....y....', '.y.....y.', '...yyy...', '..yyyyy..', 'y.yyyyy.y', '..yyyyy..', '...yyy...', '.y.....y.', '....y....'],
        colors: { y: '#F8D048' },
    },
    moon: {
        rows: ['...yyyy..', '..yyy....', '.yyy.....', '.yyy.....', '.yyy.....', '.yyyy....', '..yyyyyy.', '...yyyy..'],
        colors: { y: '#FFF0A8' },
    },
    soundOn: {
        rows: ['...w.....', '..ww...w.', 'wwww.w..w', 'wwww.w..w', 'wwww.w..w', 'wwww.w..w', '..ww...w.', '...w.....'],
        colors: { w: '#FFFFFF' },
    },
    soundOff: {
        rows: ['...w.....', '..ww.....', 'wwww.w.w.', 'wwww..w..', 'wwww.w.w.', 'wwww.....', '..ww.....', '...w.....'],
        colors: { w: '#FFFFFF' },
    },
    hand: {
        rows: [
            '.kkkkk......',
            'kwwwwwkkkkkk',
            'kwwwwwwwwwwk',
            'kwwwwwkkkkk.',
            'kwwwwwwwk...',
            'kwwggwwwk...',
            '.kwwgwwk....',
            '..kkkkk.....',
        ],
        colors: { k: OUTLINE, w: '#FFFFFF', g: '#B8C0D8' },
    },
    gem: {
        rows: [
            '....k....',
            '...kwk...',
            '..kwcck..',
            '.kwccCCk.',
            'kwcccCCCk',
            'kwcccCCCk',
            'kccccCCCk',
            'kccccCCCk',
            '.kcccCCk.',
            '..kccCk..',
            '...kCk...',
            '....k....',
        ],
        colors: { k: OUTLINE, w: '#FFFFFF', c: '#6AD8F8', C: '#2A90D0' },
    },
    potion: {
        rows: ['...kk...', '...bb...', '..kwwk..', '.krwrrk.', 'krrrrrrk', 'krrrrrrk', 'kRrrrrRk', '.kkkkkk.'],
        colors: { k: OUTLINE, b: '#A8642C', w: '#FFC8C8', r: '#E84848', R: '#A82828' },
    },
}
