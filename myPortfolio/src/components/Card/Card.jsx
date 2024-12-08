import Button from '../Button/Button';
import './Card.css';

function Card( props ) {
    return (
        <div className="card">
            <img src={props.imageUrl} alt={props.title} className="card-image" />
            <div className="card-content">
                <h3 className="card-title">{props.title}</h3>
                <p className="card-description">{props.description}</p>
            </div>
            <a href={props.link} target="_blank" rel="noreferrer" className="card-link">
                <Button text={props.btnText} enabled={props.btnEnabled} />
            </a>
            <div style={{ marginBottom: '16px' }} />
        </div>
    );
};

export default Card;