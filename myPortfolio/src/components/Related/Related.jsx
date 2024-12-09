import Card from '../Card/Card2'
import { RelatedList } from './RelatedList'
import './Related.css'
import Socials from '../Socials'

function Related() {
    return (
        <div className='related' id='others'>
            <section className='related-containers'>
                <h1>RELATED EXPERIENCE</h1>
                <div className='related-container'>
                    {RelatedList.map((related, index) => (
                        <div key={index}>
                            <Card 
                                title={related.title} 
                                description={related.description} 
                                image={related.image} 
                                url={related.url} 
                            />
                        </div>
                    ))}
                </div>
            </section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '30px' }}>
                <Socials />
            </div>
        </div>
    )
}

export default Related