import linkedinIcon from '../assets/linkedin.png'
import gmailIcon from '../assets/email.png'
import whatsappIcon from '../assets/whatsapp.png'
import githubIcon from '../assets/github.png'

function Socials() {
    const socialStyle = {
        display: 'flex',
        alignItems: 'start',
        gap: '8px'
    }
    const socialIconsStyle = {
        width: '34px'
    }
    return (
        <div>
            <span style={socialStyle}>
                <a href='https://www.linkedin.com/in/wilbert-yang-bb6515251/' target='_blank'>
                    <img src={linkedinIcon} alt='linkedin' style={socialIconsStyle} />
                </a>
                <a href='https://github.com/wilbertyg' target='_blank'>
                    <img src={githubIcon} alt='github' style={socialIconsStyle} />
                </a>
                <a href='mailto:ywilbert12@gmail.com' target='_blank'>
                    <img src={gmailIcon} alt='gmail' style={socialIconsStyle} />
                </a>
                <a href='https://wa.me/6287883945788' target='_blank'>
                    <img src={whatsappIcon} alt='whatsapp' style={socialIconsStyle} />
                </a>
            </span>
        </div>
    )
}

export default Socials