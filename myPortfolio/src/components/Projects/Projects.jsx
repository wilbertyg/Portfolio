import Card from '../Card/Card'
import './Projects.css'

function Projects() {
    return (
        <div className='projects'>
            <section className='container'>
                <h1>Projects</h1>
                <div className='projects-container'>
                    <div className='project'>
                        <Card title='P' description='he' imageUrl='https://via.placeholder.com/150' projectUrl='' btnText="View P" btnEnabled={false} />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Projects