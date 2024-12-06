import './About.css'
import Profile from '../../assets/Profile.jpg'
import Button from '../Button/Button'
import CV from '../../assets/CV - Wilbert Yang.pdf'

function About() {
    return (
        <div className='about'>
            <section className='container'>
                <div className='image-container'>
                    <img src={Profile} className='profile' alt='profile' />
                </div>
                <div className='text'>
                    <h1>WILBERT YANG</h1>
                    <h2>Data Scientist</h2>
                    <p className='description'>
                        I am an undergraduate Computer Science student, specializing in Artificial Intelligence field. An enthusiastic individual who is committed in creating a meaningful impact while learning and collaborating with diverse teams to deliver innovative solutions in the field.
                    </p>
                    <a href={CV} download>
                        <Button text='Download CV'/>
                    </a>
                </div>
            </section>
        </div>
    )
}

export default About