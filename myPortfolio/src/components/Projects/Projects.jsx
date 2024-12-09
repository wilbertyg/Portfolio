import Card from '../Card/Card'
import { ProjectList } from './ProjectList'
import './Projects.css'

function Projects() {
    return (
        <div className='projects' id='projects'>
            <section className='projects-containers'>
                <h1>PROJECTS</h1>
                <div className='projects-container'>
                    {ProjectList.map((project, index) => (
                        <div key={index}>
                            <Card 
                                title={project.title} 
                                description={project.description} 
                                image={project.image} 
                                url={project.url} 
                                btnText={project.btnText} 
                                btnEnabled={project.btnEnabled} 
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Projects