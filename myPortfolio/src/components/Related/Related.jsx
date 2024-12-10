import Card from '../Card/Card2'
import { RelatedList } from './RelatedList'
import './Related.css'
import Socials from '../Socials'
import { motion } from 'motion/react'

function Related() {
    const variants = { 
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0 },
    }
    return (
        <div className='related' id='others'>
            <section className='related-containers'>
                <h1>RELATED EXPERIENCE</h1>
                <div className='related-container'>
                    {RelatedList.map((related, index) => (
                        <motion.div key={index} variants={variants} initial='initial' transition={{duration: 1, ease: "easeInOut", delay: 0.2 * index + 0.2}} whileInView="animate" viewport={{once:true}}>
                            <Card 
                                title={related.title} 
                                description={related.description} 
                                image={related.image} 
                                url={related.url} 
                            />
                        </motion.div>
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