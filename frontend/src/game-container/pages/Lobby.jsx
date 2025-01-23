import { Frame } from '../components/Frame';
import InfoLink from '../components/InfoLink';
import PingPongBack from '../components/PingPongBack';
// import RemoteGame from '../game/RemoteScene';
import './style.css'
import { useNavigate } from "react-router-dom";


function Lobby(){
    const navigate = useNavigate();
    return(
        <>

            {/* <PingPongBack/> */}

            <div className="lktaba">
                <div className="lktaba1">Ping Pong Game</div>
                <div className="lktaba2">GAME DESCIEPTION :</div>
                <p className="lktaba3">
                    Lorem Ipsum is simply dummy text of the printing
                    and&nbsp;&nbsp;typesetting industry. Lorem Ipsum has been the
                    industry&#39;s standard dumm y text ever since the 1500s, when
                    an unknown printer took a galley of&nbsp;&nbsp;type and
                    scrambled it to make a type specimen book. It has survived
                    not&nbsp;&nbsp;only five centuries, but also the leap into
                    electronic typesetting,&nbsp;&nbsp;remaining essentially
                    unchanged. It was popularised in the 1960s with&nbsp;&nbsp;the
                    release of Letraset sheets containing Lorem Ipsum passages, and
                    more recently with desktop publishing software like Aldus
                    PageMaker&nbsp;&nbsp;including versions of Lorem Ipsum
                </p>
            </div>


            <div className="yy">
                {/* <em>Lobby</em>
                <button onClick={() => {navigate('/Game/RemoteGame')}} > <em>Play Now</em></button>
            <button onClick={() => {navigate('/Game/Matchmaking')}} > <em>Matchmaking</em></button> */}
                <div className="text-wrapper">SELECT MODE</div>
                <Frame
                    text="Play Locally"
                    default_icon='/GamePub/bottouns/default_offline.svg'
                    hovered_icon='/GamePub/bottouns/hovered_offline.svg'
                    onClick={() => {navigate('/Game/PlayLocally_1v1')}}
                    />
                <Frame
                    text="Play Online"
                    default_icon='/GamePub/bottouns/default_online.svg'
                    hovered_icon='/GamePub/bottouns/hovered_online.svg'
                    onClick={() => {navigate('/Game/PreRemote')}}
                    />
                <Frame
                    text="Multiplayer Game"
                    default_icon='/GamePub/bottouns/default_multiplayer.svg'
                    hovered_icon='/GamePub/bottouns/hovered_multiplayer.svg'
                    onClick={() => {navigate('/Game/PreMultiplayer')}}
                    />
                <Frame
                    text="Start Tournament"
                    default_icon='/GamePub/bottouns/default_tournament.svg'
                    hovered_icon='/GamePub/bottouns/hovered_tournament.svg'
                    onClick={() => {navigate('/Game/PreTournament')}}
                    />
                    {/* <Frame
                        text="Chess Game Test"
                        default_icon='/GamePub/bottouns/default_online.svg'
                        hovered_icon='/GamePub/bottouns/hovered_online.svg'
                        onClick={() => {navigate('/Game/Chess_Lobby')}}
                    /> */}
            </div>

            <div>
                <InfoLink />
            </div>
        </>
    )
}

export default Lobby;