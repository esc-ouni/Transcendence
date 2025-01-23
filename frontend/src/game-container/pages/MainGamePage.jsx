import { useNavigate } from "react-router-dom";
import InfoLink from "../components/InfoLink";
import PingPongBack from "../components/PingPongBack";
import './MainGamePage.css'
import './style.css'


function MainGamePage(){
    const navigate = useNavigate();


    return(
        <>
            <PingPongBack/>

            <div className="lktaba">
                <div className="lktaba1">THE PLATFORM</div>
                <div className="lktaba2">PLATFORM DESCIEPTION :</div>
                <p className="lktaba3">
                    Lorem Ipsum is simply dummy text of the printing
                    and&nbsp;&nbsp;typesetting industry. Lorem Ipsum has been the
                    industry&#39;s standard dumm y text ever since the 1500s, when
                    an unknown. Have Fun !
                </p>
            </div>

            <div className="teams-container" >
                <div className="team" onClick={() => {navigate('/Chess_Lobby')}}>
                </div>
                <div className="team" onClick={() => {navigate('/PingPong_Lobby')}}>
                </div>
            </div>

            <InfoLink />
        </>
    )
};

export default MainGamePage;
