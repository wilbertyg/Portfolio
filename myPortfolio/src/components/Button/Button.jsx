const base =
    'inline-flex items-center justify-center gap-2 whitespace-nowrap border font-medium leading-none transition-all duration-150 ease-out aria-disabled:pointer-events-none aria-disabled:opacity-50'

const variants = {
    primary:
        'border-[#111111] bg-[#111111] text-white hover:bg-[#2A2A2A] active:scale-[0.98]',
    secondary:
        'border-[#EAEAEA] bg-white text-[#111111] hover:border-[#111111] hover:bg-[#F7F6F3] active:scale-[0.98]',
    ghost:
        'border-transparent bg-transparent text-[#787774] hover:bg-[#F7F6F3] hover:text-[#111111] active:scale-[0.98]',
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-[4px]',
    md: 'px-4 py-2.5 text-xs font-semibold rounded-[6px]',
    lg: 'px-5 py-3 text-sm font-semibold rounded-[6px]',
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