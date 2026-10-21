const gem = 'pointer-events-none absolute size-2.5 rotate-45 border border-void bg-gold'

/** RPG menu window: gold double border with gem corners. */
function Panel({ as: Tag = 'div', className = '', children, ...props }) {
    return (
        <Tag
            className={`relative rounded-md border-2 border-gold-dim bg-panel/85 shadow-[0_0_0_1px_var(--color-void),0_18px_50px_-18px_rgb(0_0_0/0.7)] backdrop-blur-md ${className}`}
            {...props}
        >
            <span aria-hidden="true" className="pointer-events-none absolute inset-1 rounded-sm border border-gold/20" />
            <span aria-hidden="true" className={`${gem} -top-1.5 -left-1.5`} />
            <span aria-hidden="true" className={`${gem} -top-1.5 -right-1.5`} />
            <span aria-hidden="true" className={`${gem} -bottom-1.5 -left-1.5`} />
            <span aria-hidden="true" className={`${gem} -right-1.5 -bottom-1.5`} />
            {children}
        </Tag>
    )
}

export default Panel
