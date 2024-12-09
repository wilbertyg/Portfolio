import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <a href="#about" className='navbar-element'>About</a>
                <a href="#skills" className='navbar-element'>Skills</a>
                <a href="#projects" className='navbar-element'>Projects</a>
                <a href="#others" className='navbar-element'>Others</a>
            </div>
        </nav>
    )
}

export default Navbar