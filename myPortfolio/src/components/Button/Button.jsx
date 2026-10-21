const base =
    'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium leading-none transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-out active:scale-[0.97] aria-disabled:pointer-events-none aria-disabled:opacity-50'

const variants = {
    primary:
        'bg-[#0B0B0F] text-white shadow-[0_8px_30px_-8px_rgba(124,58,237,0.55)] hover:shadow-[0_12px_40px_-6px_rgba(124,58,237,0.7)] dark:bg-[#F4F4F5] dark:text-[#0B0B0F] dark:shadow-[0_8px_30px_-8px_rgba(167,139,250,0.6)] dark:hover:shadow-[0_12px_44px_-6px_rgba(167,139,250,0.8)]',
    secondary:
        'border border-black/10 bg-white/50 text-[#0B0B0F] backdrop-blur-md hover:border-black/25 hover:bg-white/80 dark:border-white/12 dark:bg-white/[0.04] dark:text-[#F4F4F5] dark:hover:border-white/30 dark:hover:bg-white/[0.08]',
    ghost:
        'text-[#57534E] hover:text-[#0B0B0F] dark:text-[#A1A1AA] dark:hover:text-[#F4F4F5]',
}

const sizes = {
    sm: 'px-3.5 py-2 text-xs',
    md: 'px-5 py-3 text-sm',
    lg: 'px-7 py-4 text-sm font-semibold',
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
            {variant === 'primary' && (
                <span
                    aria-hidden="true"
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full dark:via-[#A78BFA]/30"
                />
            )}
            {icon && <span className="relative inline-flex shrink-0 items-center">{icon}</span>}
            <span className="relative">{text || children}</span>
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
