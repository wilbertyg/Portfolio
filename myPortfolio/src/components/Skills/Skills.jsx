import './Skills.css'
import { Programming, Frameworks, Tools, softSkills } from './SkillList'
import Skill from './Skill'
import { motion } from "motion/react"

function Skills() {
    const variants = { 
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
    }
    return (
        <div className='skills' id='skills'>
            <section className='container'>
                <h1>SKILLS</h1>
                <div className='skills-container'>
                    <motion.div className='skill' variants={variants} transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }} initial='initial' whileInView="animate" viewport={{once:true}}>
                        <h3>Programming Languages</h3>
                        <span className='list'>
                            {
                                Programming.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </motion.div>
                    <motion.div className='skill' variants={variants} transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }} initial='initial' whileInView="animate" viewport={{once:true}}>
                        <h3>Frameworks and Libraries</h3>
                        <span className='list'>
                            {
                                Frameworks.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </motion.div>
                    <motion.div className='skill' variants={variants} transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }} initial='initial' whileInView="animate" viewport={{once:true}}>
                        <h3>Tools</h3>
                        <span className='list'>
                            {
                                Tools.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </motion.div>
                    <motion.div className='skill' variants={variants} transition={{duration:1, ease: "easeInOut", delay: 0.3}} initial='initial' whileInView="animate" viewport={{once:true}}>
                        <h3>Soft Skills</h3>
                        <span className='list'>
                            {
                                softSkills.map((skills, index) => {
                                    return <Skill key={index} index={index} {...skills} />
                                })
                            }
                        </span>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

export default Skills