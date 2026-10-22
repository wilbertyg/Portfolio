import { ICONS } from './Game/sprites'

// Renders a sprite from Game/sprites.js as crisp SVG; horizontal runs merge into one rect.
function PixelArt({ art, colors, className = 'h-4 w-auto' }) {
    const palette = { ...art.colors, ...colors }
    const rects = []
    art.rows.forEach((row, y) => {
        for (let x = 0; x < row.length; ) {
            const c = row[x]
            let end = x + 1
            while (row[end] === c) end++
            if (c !== '.') rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={palette[c]} />)
            x = end
        }
    })
    return (
        <svg
            viewBox={`0 0 ${art.rows[0].length} ${art.rows.length}`}
            className={className}
            shapeRendering="crispEdges"
            aria-hidden="true"
        >
            {rects}
        </svg>
    )
}

// The pointing-glove menu cursor. Visible when `active`, or on hover/focus of the parent `group`.
export function Hand({ active = false, className = '' }) {
    return (
        <span
            className={`shrink-0 transition-opacity motion-safe:animate-nudge ${
                active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
            } ${className}`}
        >
            <PixelArt art={ICONS.hand} className="h-3 w-auto" />
        </span>
    )
}

export default PixelArt
