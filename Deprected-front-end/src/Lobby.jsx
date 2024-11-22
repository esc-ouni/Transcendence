// import './style.css'
import { useNavigate } from "react-router-dom";

function Lobby(){
    const navigate = useNavigate();
    return(<div className="yy">
        <em>Lobby</em>
        <button onClick={() => {navigate('/Threegame')}} > <em>Play Now</em></button>
    </div>)
}

export default Lobby;