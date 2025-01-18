import { Frame } from '../components/Frame';
import InfoLink from '../components/InfoLink';
import LocalChessGame from './LocalSceneChess';
import { useNavigate } from "react-router-dom";
import './style.css'
import '../game/RemoteScene.css'
import ChessGameBack from './ChessBack';


function ChessLobby(){
    const navigate = useNavigate();
    return(
        <>
            <ChessGameBack/>

            <div className="lktaba">
                <div className="lktaba1">Chess Platform Game</div>
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
                <div className="text-wrapper">SELECT MODE</div>
                <Frame
                    text="Play Locally"
                    default_icon='/bottouns/default_chess.svg'
                    hovered_icon='/bottouns/hovered_chess.svg'
                    onClick={() => {navigate('/ChessPreLocal')}}
                />
                <Frame
                    text="Play Online"
                    default_icon='/bottouns/default_online.svg'
                    hovered_icon='/bottouns/hovered_online.svg'
                    onClick={() => {navigate('/ChessPreRemote')}}
                />
                <Frame
                    text="Vs Ai"
                    default_icon='/bottouns/default_ai.svg'
                    hovered_icon='/bottouns/hovered_ai.svg'
                    onClick={() => {navigate('/ChessLocally')}}
                />
            </div>

            <div>
                <InfoLink />
            </div>
        </>
    )
}

export default ChessLobby;