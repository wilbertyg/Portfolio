
function Skill(props) {
    return (
        <div className="box">
            <img src={props.logo} alt="Skill logo" style={{ width: '70px', height: 'auto' }} />
            <p >{props.skill}</p>
        </div>
    )
}

export default Skill

