import { Frame } from '../components/Frame';
import './style.css'
import { useNavigate } from "react-router-dom";


function Lobby(){
    const navigate = useNavigate();
    return(<div className="yy">
        <em>Lobby</em>
        <button onClick={() => {navigate('/RemoteGame')}} > <em>Play Now</em></button>
        <button onClick={() => {navigate('/Matchmaking')}} > <em>Matchmaking</em></button>
        <Frame
            text="Start new Game"
            default_icon='/bottouns/default_offline.svg'
            hovered_icon='/bottouns/hovered_offline.svg'
            onClick={()=>{alert('Hello !')}}
        />

    </div>)
}

export default Lobby;