import Button from '../Button/Button';
import './Card.css';

function Card( props ) {
    return (
        <div className="card">
            <div className='card-image-container'>
                <img src={props.image} alt={props.title} className="card-image" />
            </div>
            <div className="card-text-btn-wrapper">
                <div className="card-content">
                    <h3 className="card-title">{props.title}</h3>
                    <p className="card-description">{props.description}</p>
                </div>
                <a href={props.url} target="_blank" >
                    <Button text={props.btnText} enabled={props.btnEnabled}/>
                </a>
            </div>
        </div>
    );
};

export default Card;