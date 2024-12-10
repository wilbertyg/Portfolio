import Card from '../Card/Card'
import { ProjectList } from './ProjectList'
import './Projects.css'
import { motion } from 'motion/react'

function Projects() {
    const variants = { 
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
    }
    return (
        <div className='projects' id='projects'>
            <section className='projects-containers'>
                <h1>PROJECTS</h1>
                <div className='projects-container'>
                    {ProjectList.map((project, index) => (
                        <motion.div key={index} variants={variants} initial="initial" transition={{duration: 1, ease: "easeInOut", delay: 0.2 * index + 0.2}} whileInView="animate" viewport={{once:true}}>
                            <Card 
                                title={project.title} 
                                description={project.description} 
                                image={project.image} 
                                url={project.url} 
                                btnText={project.btnText} 
                                btnEnabled={project.btnEnabled} 
                            />
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Projects