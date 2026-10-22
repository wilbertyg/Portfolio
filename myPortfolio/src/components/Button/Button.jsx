import { playSfx } from '../Game/sfx'

const base =
    'group/btn inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-sm border-2 border-void font-display uppercase leading-none transition-transform duration-100 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none aria-disabled:pointer-events-none aria-disabled:opacity-50'

// Bevelled 16-bit buttons: light top-left edge, dark bottom-right edge, hard drop shadow.
const variants = {
    primary:
        'bg-gold text-void shadow-[inset_-3px_-3px_0_#C88A18,inset_3px_3px_0_#FFF4C0,0_4px_0_var(--color-void)] focus-visible:outline-white',
    secondary:
        'bg-win text-white shadow-[inset_-3px_-3px_0_var(--color-win-lo),inset_3px_3px_0_var(--color-win-hi),0_4px_0_var(--color-void)]',
    ghost: 'border-transparent bg-transparent text-current hover:bg-white/10',
}

const sizes = {
    sm: 'px-3 py-2 text-[9px]',
    md: 'px-4 py-3 text-[10px]',
    lg: 'px-5 py-4 text-xs',
}

/** Renders an <a> when given href, otherwise a <button>. Never nest it inside a link. */
function Button({
    text,
    children,
    enabled = true,
    variant = 'primary',
    size = 'md',
    icon,
    href,
    type = 'button',
    className = '',
    onClick,
    ...props
}) {
    const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`
    const handleClick = (e) => {
        playSfx('confirm')
        onClick?.(e)
    }
    const content = (
        <>
            {icon && <span className="inline-flex shrink-0 items-center">{icon}</span>}
            <span>{text || children}</span>
        </>
    )

    if (href) {
        return (
            <a href={enabled ? href : undefined} aria-disabled={!enabled || undefined} className={classes} onClick={handleClick} {...props}>
                {content}
            </a>
        )
    }

    return (
        <button type={type} disabled={!enabled} aria-disabled={!enabled || undefined} className={classes} onClick={handleClick} {...props}>
            {content}
        </button>
    )
}

export default Button
