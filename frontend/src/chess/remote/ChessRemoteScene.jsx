import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'; 
import LoadingScreen from '../../components/LoadingScreen';
import './ChessRemoteScene.css'
import { useNavigate } from 'react-router-dom';
import { useMatchContext } from '../../game/MatchContext';



const ChessRemoteGame = () => {
    
    
    // Remote LOgic
    const { matchData } = useMatchContext();
    
    if (!matchData.roomName || !matchData.myId) return;


    // Remote LOgic
    
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);
    
    const [loading, setLoading] = useState(true);


    let Aix        = 0;
    let Aiy        = 0;
    let ball_count = 0;
    let ball_x     = 0;
    let ball_y     = 0;
    let ball_z     = 0;
    let Objects  = [];

    let OppmouseDirection;

    let state = false;

    
    useEffect(() => {
        
        // Connect to the game server using those values
        const gameSocket = new WebSocket(`ws://localhost:8000/ws/chess/room/${matchData.roomName}/?user_id=${matchData.myId}`);
        // const gameSocket = new WebSocket(`ws://10.13.9.18:8000/ws/ping-pong/room/${matchData.roomName}/?user_id=${matchData.myId}`);
        
        gameSocket.onopen = () => {
            console.log("Connected to the game room:", matchData.roomName);
        };
  
        const scene = new THREE.Scene();

//
        const kgeometry = new THREE.SphereGeometry( 0.10, 32, 16 ); 
        const kmaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } ); 
        const sphere = new THREE.Mesh( kgeometry, kmaterial ); scene.add( sphere );
//

        gameSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // console.log("=> Type received :", data['type']);
            
            if (data['type'] == 'Game_State'){
                console.log("=> The brodcaster :", data['my_id']);
                console.log("   => Says        :", data['message'], '\n');
            }
            if (data['type'] == 'paddle_update'){
                
                Aix               = data['paddle']['x'];
                Aiy               = data['paddle']['y'];
    
                ball_count        = data['ball']['c'];
    
                ball_x            = data['ball']['x'];
                ball_y            = data['ball']['y'];
                ball_z            = data['ball']['z'];

                state             = data['ball']['state'];
                OppmouseDirection = data['ball']['mousedirection'];
    

                if (state === true && (Objects.length && Objects[Objects.length - 1].created_by_me === false)){
                    navigate('/Winner');
                    // navigate()
                }

                if(ball_count > Objects.length){
                    console.log('ball should be created here !')
                    createSphere(new THREE.Vector3(ball_x, ball_y, ball_y), false);
                }
                if(Objects.length && Objects[Objects.length - 1].created_by_me === false){
                    Objects[Objects.length - 1].sphere.position.x = -ball_x;
                    Objects[Objects.length - 1].sphere.position.y = ball_y;
                    Objects[Objects.length - 1].sphere.position.z = -ball_z;
                }

                // sphere.position.x = -ball_x;
                // sphere.position.y = ball_y;
                // sphere.position.z = -ball_z;

            };
    
    
        };        
        ////=>////

////=>////

        return() => {
            // window.removeEventListener('resize', handleResize);
            // window.removeEventListener('mousemove', handleMouseMove);
            // document.removeEventListener('keydown', handleKeyDown);

            // while (scene.children.length > 0) {
            //     const child = scene.children[0];
            //     scene.remove(child);
            // }

            // renderer.dispose();

            // gui.destroy();

            // topControls.dispose();

            // hit_sound.pause();
            // hit_sound.src = "";
            // gameSocket.close();
        };

    }, [matchData.roomName]);
  
    return (
        <>
            <LoadingScreen show={loading} />
            <canvas ref={canvasRef}></canvas>
        </>
    )
};

export default ChessRemoteGame;
