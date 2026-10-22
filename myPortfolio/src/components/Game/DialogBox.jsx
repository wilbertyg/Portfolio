import { useEffect, useRef, useState } from 'react'
import { Hand } from '../PixelArt'
import { win } from '../styles'
import { playSfx } from './sfx'

// Reveals text a character at a time; `skip` jumps to the end.
export function useTypewriter(text, instant) {
    const [count, setCount] = useState(0)
    const shown = useRef(0)

    useEffect(() => {
        shown.current = instant ? text.length : 0
        setCount(shown.current)
        if (instant) return
        const id = setInterval(() => {
            if (shown.current >= text.length) return clearInterval(id)
            shown.current++
            if (shown.current % 3 === 0) playSfx('text')
            setCount(shown.current)
        }, 22)
        return () => clearInterval(id)
    }, [text, instant])

    const skip = () => {
        shown.current = text.length
        setCount(text.length)
    }
    return [text.slice(0, count), count >= text.length, skip]
}

function DialogBox({ dialog, shown, done, choice, onAdvance, onChoose, onHover }) {
    const text = dialog.pages[dialog.page]
    const lastPage = dialog.page === dialog.pages.length - 1
    const showChoices = done && lastPage && dialog.choices

    return (
        <div className="absolute inset-x-3 bottom-3 z-20 mx-auto flex max-w-3xl flex-col items-end gap-2 sm:inset-x-6 sm:bottom-6">
            {showChoices && (
                <ul className={`${win} min-w-44 p-2`} role="menu" aria-label="Choose">
                    {dialog.choices.map((c, i) => (
                        <li key={c.label} role="none">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => onChoose(i)}
                                onPointerEnter={() => onHover(i)}
                                className="group flex w-full items-center gap-2 px-2 py-1.5 text-left font-display text-[10px] uppercase leading-relaxed"
                            >
                                <Hand active={choice === i} />
                                {c.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className={`${win} relative w-full cursor-pointer px-5 pt-6 pb-5 sm:px-7`} onClick={onAdvance}>
                {dialog.speaker && (
                    <span className={`${win} absolute -top-4 left-4 px-3 py-1 font-display text-[10px] uppercase leading-relaxed text-gold`}>
                        {dialog.speaker}
                    </span>
                )}
                <p className="sr-only" aria-live="polite">
                    {dialog.speaker ? `${dialog.speaker}: ` : ''}
                    {text}
                </p>
                <p className="min-h-[3.5em] text-lg leading-snug sm:text-xl" aria-hidden="true">
                    {shown}
                </p>
                {done && !showChoices && (
                    <span className="absolute right-4 bottom-2 font-display text-[10px] text-gold motion-safe:animate-blink" aria-hidden="true">
                        ▼
                    </span>
                )}
            </div>
        </div>
    )
}

export default DialogBox
