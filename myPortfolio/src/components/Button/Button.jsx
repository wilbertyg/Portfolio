const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap border-2 font-display font-bold uppercase leading-none tracking-[0.12em] transition-all duration-150 ease-out active:translate-y-px aria-disabled:pointer-events-none aria-disabled:opacity-50'

const variants = {
    primary:
        'border-gold bg-linear-to-b from-[#f9dc8c] to-[#c48a2c] text-[#2a1a05] shadow-[0_0_0_2px_var(--color-void),0_0_28px_-6px_var(--color-gold)] hover:brightness-110',
    secondary:
        'border-gold-dim bg-panel/80 text-ink backdrop-blur-sm hover:border-gold hover:bg-panel-2',
    ghost:
        'border-transparent bg-transparent text-muted hover:bg-panel-2 hover:text-ink',
}

const sizes = {
    sm: 'px-3 py-2 text-[11px] rounded-sm',
    md: 'px-5 py-3 text-xs rounded-sm',
    lg: 'px-6 py-3.5 text-sm rounded-sm',
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
    ...props
}) {
    const classes = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`
    const content = (
        <>
            {icon && <span className="inline-flex items-center shrink-0">{icon}</span>}
            <span>{text || children}</span>
        </>
    )

    if (href) {
        return (
            <a href={enabled ? href : undefined} aria-disabled={!enabled || undefined} className={classes} {...props}>
                {content}
            </a>
        )
    }

    return (
        <button type={type} disabled={!enabled} aria-disabled={!enabled || undefined} className={classes} {...props}>
            {content}
        </button>
    )
}

export default Button
