import './Skills.css'
import {Programming, Frameworks, Tools, softSkills} from './SkillList'
import Skill from './Skill'


function Skills() {
    return (
        <div className='skills'>
            <section className='container'>
                <h1>SKILLS</h1>
                <div className='skills-container'>
                    <div className='skill'>
                        <h3>Programming Languages</h3>
                        <span className='list'>
                            {
                                Programming.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </div>
                    <div className='skill'>
                        <h3>Frameworks and Libraries</h3>
                        <span className='list'>
                            {
                                Frameworks.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </div>
                    <div className='skill'>
                        <h3>Tools</h3>
                        <span className='list'>
                            {
                                Tools.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </div>
                    <div className='skill'>
                        <h3>Soft Skills</h3>
                    <span className='list'>
                            {
                                softSkills.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </div>
                </div>
        
            </section>
        </div>
    )
}

export default Skills