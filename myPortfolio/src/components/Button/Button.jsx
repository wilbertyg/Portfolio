import './Button.css'

function Button({text, enabled=true}) {
    const status = enabled ? 'enabled' : 'disabled';
    return (
        <div>
            <button className={`button ${status}`}>{text}</button>
        </div>
    )
}

export default Button