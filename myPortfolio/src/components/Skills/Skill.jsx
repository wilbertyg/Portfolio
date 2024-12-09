
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
                <p><i>{props.skill}</i></p>
            </div>
        );
    }
}

export default Skill

