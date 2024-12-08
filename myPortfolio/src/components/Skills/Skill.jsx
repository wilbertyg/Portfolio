
function Skill(props) {
    if (props.logo) {
        return (
            <div className="box">
                <img src={props.logo} alt="Icon" style={{ width: '70px', height: 'auto' }} />
                <p>{props.skill}</p>
            </div>
        );
    } else {
        return (
            <div className="box">
                <h3>{props.skill}</h3>
            </div>
        );
    }
}

export default Skill

