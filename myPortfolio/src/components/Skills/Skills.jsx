import './Skills.css'
import {SkillList} from './SkillList'
import Skill from './Skill'


function Skills() {
    return (
        <div>
            <section className='skills'>
                <h1>Hard Skills</h1>
                <div className='skills-container'>
                    <div className='skill'>
                        <h2>Programming Languages</h2>
                        <span className='list'>
                            {
                                SkillList.map((skills,) => {
                                    return Skill(skills)
                                })
                            }
                        </span>
                    </div>
                    <div className='skill'>
                        <h2>Frameworks</h2>
                        <span>

                        </span>
                    </div>
                    <div className='skill'>
                        <h2>Tools</h2>
                        <span>
                            
                        </span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Skills