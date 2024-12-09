import './Card2.css';

function Card2( props ) {
    return (
        <div className="card2">
            <div className='card2-image-container'>
                <img src={props.image} alt={props.title} className="card2-image" />
            </div>
            <div className="card2-content">
                <h3 className="card2-title">{props.title}</h3>
                <p className="card2-description">{props.description}</p>
            </div>
        </div>
    );
};

export default Card2;