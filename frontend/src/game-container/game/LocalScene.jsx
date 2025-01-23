import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'

import gsap from 'gsap'; 
import LoadingScreen from '../components/LoadingScreen';

import Hud from '../components/Hud'

import './RemoteScene.css'

import Scoreboard from '../components/Scoreboard';
import { useNavigate } from 'react-router-dom';

const LocalGame = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

  
    const [playerScore, setPlayerScore] = useState(0);
    const [aiScore, setAiScore] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

////=>////
        const gravity     = -9.8;
        const friction    = 0.25;
        const restitution = 0.89;

        const loadingManager = new THREE.LoadingManager();

        loadingManager.onLoad = () => {
            // If you want a fade-out effect with GSAP:
            gsap.to('#loading-screen', {
              opacity: 0,
              duration: 1,
              onComplete: () => {
                // Hide the screen entirely
                setLoading(false);
              }
            });
          };

        const gui = new GUI()

        let canvas = null;
        if (canvasRef.current != null)
            canvas = canvasRef.current

        
        const scene = new THREE.Scene()
        
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.MeshStandardMaterial({
                color: '#444444',
                metalness: 0,
                roughness: 0.5,
            })
        )
        floor.receiveShadow = true
        floor.rotation.x = - Math.PI * 0.5
        floor.material.side = THREE.DoubleSide;
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.14)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.far    = 300
        directionalLight.shadow.camera.left   = - 20
        directionalLight.shadow.camera.top    = 20
        directionalLight.shadow.camera.right  = 20
        directionalLight.shadow.camera.bottom = - 20
        directionalLight.position.set(5, 5, 5)
        scene.add(directionalLight)
        
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        
        let Cameras = []
        let New_ball_launched = false;

        const handleResize = () =>  {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            topCamera.aspect = sizes.width / (sizes.height / 2)
            bottomCamera.aspect = sizes.width / (sizes.height / 2)
            topCamera.updateProjectionMatrix()
            bottomCamera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        };
        
        window.addEventListener('resize', handleResize)
        
        const topCamera = new THREE.PerspectiveCamera(75, sizes.width / (sizes.height / 2), 0.1, 100)
        topCamera.position.set(-15, 4, 0)
        scene.add(topCamera)
        
        Cameras.push(topCamera)
        
        const bottomCamera = new THREE.PerspectiveCamera(75, sizes.width / (sizes.height / 2), 0.1, 100)
        bottomCamera.position.set(15, 4, 0)
        scene.add(bottomCamera)
        
        Cameras.push(bottomCamera)
        
        const topControls = new OrbitControls(topCamera, canvas)
        topControls.enableDamping = true
        
        const bottomControls = new OrbitControls(bottomCamera, canvas)
        bottomControls.enableDamping = true
        
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        })
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
        const GLTFLoaderr = new GLTFLoader(loadingManager); 
        GLTFLoaderr.load('/GamePub/models/chinese_tea_table_4k.gltf/tabla_v2.gltf', function (gltf){
            const model = gltf.scene;
            model.scale.set(1.5, 1.5, 1.5)
            model.position.y += 1.7;
            model.position.z = -1.94;
            
            model.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.wireframe = false;
                }
            })
            scene.add(model);
        })
        
        let paddle = null;
        let paddleAi = null;
        
        GLTFLoaderr.load('/GamePub/models/chinese_tea_table_4k.gltf/paddle_test.gltf', function (gltf){
            const model = gltf.scene;
            paddle = model;
            model.scale.set(2.1, 2.1, 2.1)
            model.position.y = 4.0387;
            model.position.z = 10; //-8
            
            model.traverse(function (node) {          
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    // node.material.wireframe = true;
                }
            })
        
            paddleAi = paddle.clone();
            paddleAi.position.z = -10;
        
            scene.add(paddle);
            scene.add(paddleAi);
        })
        
        
        const hit_sound = new Audio("/GamePub/sounds/ping_pong.mp3");
        
        const Pong_Ball_colide = (impact) => {
            hit_sound.volume = Math.min(impact, 1);
            hit_sound.currentTime = 0;
            hit_sound.play();
        }
        
        const TextureLoader = new THREE.TextureLoader(loadingManager);
        const Texture = TextureLoader.load("/GamePub/textures/Models/ball.jpeg");
        
        let Objects  = [];
        
        let ball = null;
        
        const STDGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const STDMaterial = new THREE.MeshStandardMaterial;
        STDMaterial.metalness = 0.1;
        STDMaterial.roughness = 0.1;
        STDMaterial.map       = Texture;
        
        
        const createSphere = (position, status) => {
            const sphere = new THREE.Mesh(
                STDGeometry,
                STDMaterial)
        
                sphere.castShadow = true
                sphere.position.copy(position);
                sphere.position.x = ((Math.random() - 0.5) * 5);
                
                scene.add(sphere)
                
                // BallCreator.reset()
                Objects.push({
                    sphere: sphere,
                    velocity: new THREE.Vector3(1, 1, 1), // Initial velocity
                    mass: 1,
                });
        
                // serve 
                Objects[Objects.length - 1].velocity.set(BallCreator.serve_x, BallCreator.serve_y, BallCreator.serve_z); 
        
            New_ball_launched = true;
        }
        
        
        const BallCreator = {
            PADDLE_SPEED: 0.04,
            serve_x: 0,
            serve_y: -4.65,
            serve_z: 26.5,
        
            hit_x  : 0,
            hit_y  : -4.65,
            hit_z  : 26.5,
        
            cameraFixed: false 
        }
        
        
        BallCreator.serve_x = 0;
        BallCreator.serve_y = 3.4;
        BallCreator.serve_z = 22;
        
        BallCreator.hit_x   = 0;
        BallCreator.hit_y   = 3.2;
        BallCreator.hit_z   = 22;
    
        
        BallCreator.reset = () => {
            for (const object of Objects){
                scene.remove(object.sphere);
            }
            Objects.splice(0, Objects.length)
        }
        
        BallCreator.createBall = () => {
            let x = (Math.random() - 0.5) * 4
            let y = 4.92;
            let z = -10.1;
            
            createSphere(new THREE.Vector3(paddle.position.x, y, -paddle.position.z), true)
        }
        
        gui.add(BallCreator, 'createBall')
        gui.add(BallCreator, 'reset')
        
        //Table 
        const geometry       = new THREE.BoxGeometry( 1, 1, 1 ); 
        const material       = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        material.transparent = true; 
        const Table          = new THREE.Mesh( geometry, material ); 
        
        Table.position.x = -0.01;
        Table.position.y = 4.15;
        Table.position.z = -0.06;
        
        Table.scale.set(8.28, 0.3, 18.51)
        
        //Net
        const Net = new THREE.Mesh( geometry, material ); 
        Net.position.x = 0;
        Net.position.y = 4.66;
        Net.position.z = -0.02;
        Net.scale.set(10.29, 1, 0.05)
        

        let mouseDirection = 0;
        let prevMouseX = 0;

        const handleMouseMove = (info) => {
            mouse.x = (info.clientX/window.innerWidth)*2-1;
            mouse.y = -((info.clientY/window.innerHeight)*2-1);
            
            mouseDirection = mouse.x > prevMouseX ? 1 : -1;
            prevMouseX = mouse.x;
        };

        // mouse event listener
        const mouse = new THREE.Vector2();
            window.addEventListener('mousemove', handleMouseMove
        )
        
        // keyboard event listener
        const keyboard = new THREE.Vector2();
        let Chained_Keys = [
            {w:0},
            {d:0},
            {s:0},
            {a:0},
        ]
        

        const handleKeyDown = (event) => {
            const keyName = event.key;
          
              if ( keyName === "w") {
                  Chained_Keys.w = 1;
              }
              if (keyName === "s"){
                  Chained_Keys.s = 1;
              }
              if (keyName === "d"){
                  Chained_Keys.d = 1;
              }
              if (keyName === "a"){
                  Chained_Keys.a = 1;
              }
              if (keyName === "r"){
                  BallCreator.createBall()
              }}
        ;
        
        
        const handleKeyUp = (event) => {
            const keyName = event.key;
      
          if ( keyName === "w") {
              Chained_Keys.w = 0;
            }
            if (keyName === "s"){
              Chained_Keys.s = 0;
            }
          if (keyName === "d"){
              Chained_Keys.d = 0;
            }
            if (keyName === "a"){
              Chained_Keys.a = 0;
          }}
          

        document.addEventListener(
            "keyup",
            handleKeyUp
        )
        
        
        document.addEventListener("keydown", handleKeyDown)
        document.addEventListener("keyup", handleKeyUp)
        // enviroment map
        const rgbeLoader = new RGBELoader(loadingManager);
        rgbeLoader.load('/GamePub/models/neon_photostudio_2k.hdr', (enviroment_map) => {
            enviroment_map.mapping = THREE.EquirectangularReflectionMapping
            scene.background  = enviroment_map;
            scene.environment = enviroment_map;
            
            scene.backgroundBlurriness = 0.5; 
            scene.environmentIntensity = 0.01; 
            scene.backgroundIntensity  = 0.007;
        })
        
        const BallBoundingBox     = new THREE.Box3();
        const PaddleBoundingBox   = new THREE.Box3();
        const PaddleBoundingAiBox = new THREE.Box3();
        const TableBoundingBox    = new THREE.Box3();
        const NetBoundingBox      = new THREE.Box3();
        
        const PaddleBoxHelper   = new THREE.Box3Helper(PaddleBoundingBox, 0xff0000);
        const PaddleAiBoxHelper = new THREE.Box3Helper(PaddleBoundingAiBox, 0xff0000);
        const BallBoxHelper     = new THREE.Box3Helper(BallBoundingBox, 0xff0000);
        const TableBoxHelper    = new THREE.Box3Helper(TableBoundingBox, 0xff0000);
        const NetHelper         = new THREE.Box3Helper(NetBoundingBox, 0xff0000);
        
        // scene.add(paddleBoxHelper1);
        // scene.add(paddleBoxHelper2);
        // scene.add(paddleBoxHelper3);
        // scene.add(NetHelper3);
        
//
    function checkCollision() {
        if (Objects.length){
            // Update bounding boxes with the current positions of the models
            PaddleBoundingBox.setFromObject(paddle);
            PaddleBoundingAiBox.setFromObject(paddleAi);
            BallBoundingBox.setFromObject(Objects[Objects.length - 1].sphere);
            NetBoundingBox.setFromObject(Net)
            TableBoundingBox.setFromObject(Table)
            
            if (PaddleBoundingBox.intersectsBox(BallBoundingBox) && Objects[Objects.length - 1].velocity.z > 0) {
                

                // console.log('paddle and ball!');
                let intensity = Math.max((3 - (Math.abs(paddle.position.x))), 0);
                if ((paddle.position.x > 2) && (mouseDirection < 0)){
                    intensity = (Math.abs(paddle.position.x) * 0.5) ;
                }
                if ((paddle.position.x < -2) && (mouseDirection > 0)){
                    intensity = (Math.abs(paddle.position.x) * 0.5);
                }    
                let forceX = (intensity * mouseDirection)

                // console.log(forceX > 0 ? "right" : "left");

                //for push Sumilation
                gsap.to(paddle.rotation, {
                    x: paddle.rotation.x - 0.5,
                    duration: 0.1,
                    ease: "power3.out"
                })
                Pong_Ball_colide(0.54);
                
                Objects[Objects.length - 1].velocity.set( forceX,//BallCreator.hit_x,        
                                                        BallCreator.hit_y,        
                                                        -BallCreator.hit_z
                )
            }
            else if (PaddleBoundingAiBox.intersectsBox(BallBoundingBox) && Objects[Objects.length - 1].velocity.z < 0){
                
                // console.log('paddleAi and ball!');
                // let Aidecision = (Math.random() - 0.5) > 0 ? 1:-1;                   
                let intensity = Math.max((3 - (Math.abs(paddleAi.position.x))), 0);
                if ((paddleAi.position.x > 2) && (mouseDirection > 0)){
                    intensity = (Math.abs(paddleAi.position.x) * 0.5) ;
                }
                if ((paddleAi.position.x < -2) && (mouseDirection < 0)){
                    intensity = (Math.abs(paddleAi.position.x) * 0.5);
                }    
                let forceX = -(intensity * mouseDirection)

                //for push Sumilation
                gsap.to(paddleAi.rotation, {
                    x: paddleAi.rotation.x + 0.5,
                    duration: 0.1,
                    ease: "power3.out"
                })
                Pong_Ball_colide(0.54);
                
                Objects[Objects.length - 1].velocity.set( forceX,//BallCreator.hit_x,        
                                                        BallCreator.hit_y,        
                                                        BallCreator.hit_z
                )
            }
            
            else if (NetBoundingBox.intersectsBox(BallBoundingBox)) {
                // console.log('ball collided with the Net!');
                // Objects[Objects.length - 1].sphereBody.velocity.z = -(Objects[Objects.length - 1].sphereBody.velocity.z) * 0.5; //Good !
                // Good just need to get the best velocity values

                // const normalVelocity = Objects[Objects.length - 1].velocity.dot(new THREE.Vector3(0, 0, 1)); // Extract velocity along the normal
                // Objects[Objects.length - 1].velocity.z = ((Objects[Objects.length - 1].velocity.y) > 0 ? 1 : -1 ) * restitution;

                // // Apply friction to X and Y velocity components
                // Objects[Objects.length - 1].velocity.x *= friction;
                // Objects[Objects.length - 1].velocity.y *= friction;

                // // Prevent sinking into the net by repositioning the ball
                // const ballDepth = BallBoundingBox.max.z - BallBoundingBox.min.z;
                // if (Objects[Objects.length - 1].sphere.position.z > NetBoundingBox.max.z) {
                //     Objects[Objects.length - 1].sphere.position.z = NetBoundingBox.max.z + ballDepth / 2; // Ball is on one side of the net
                // } else {
                //     Objects[Objects.length - 1].sphere.position.z = NetBoundingBox.min.z - ballDepth / 2; // Ball is on the other side of the net
                // }
            }
            else if (TableBoundingBox.intersectsBox(BallBoundingBox)) {
                // console.log('ball collided with the Table!');
                // Collision with the table (restitution + friction) tobeadded
                Pong_Ball_colide(0.85);
                
                // Apply friction to X and Z velocity components
                Objects[Objects.length - 1].velocity.x *= friction;
                Objects[Objects.length - 1].velocity.z *= friction;

                // Reverse the Y velocity for bounce and apply restitution
                Objects[Objects.length - 1].velocity.y *= -restitution;

                // Prevent sinking into the table by repositioning the ball
                const ballHeight = BallBoundingBox.max.y - BallBoundingBox.min.y;
                Objects[Objects.length - 1].sphere.position.y = TableBoundingBox.max.y + ballHeight / 2; // Place the ball on the table
            }
        }
    }
//
        
        // scene.add(new THREE.GridHelper( 50, 50 ))
        // scene.add(new THREE.AxesHelper(15))

        
        gui.add(BallCreator, 'cameraFixed');
        gui.add(BallCreator, 'PADDLE_SPEED', 0.01 , 0.2).step(0.01)
        
        //  Animate
        const clock = new THREE.Clock()
        let previousTime = 0
        
        const tick = () =>
        {
            //tbr
            if (paddleAi && paddle){
                setTimeout(()=> {BallCreator.cameraFixed = true} , 3800)
            }
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
            
            
            // floor.position.copy(planeBody.position);
            // floor.quaternion.copy(planeBody.quaternion);
        
            Cameras[0].position.y += 0.02;
            Cameras[0].position.z -= 0.02;
            Cameras[0].position.x += 0.02;
        
            Cameras[1].position.y += 0.02;
            Cameras[1].position.z -= 0.02;
            Cameras[1].position.x += 0.02;
        
            
            for (const object of Objects){
                object.velocity.y += gravity * deltaTime;
                
                // Update position
                object.sphere.position.x += object.velocity.x * deltaTime;
                object.sphere.position.y += object.velocity.y * deltaTime;
                object.sphere.position.z += object.velocity.z * deltaTime;       

                //Scoring System
                if (New_ball_launched){
                    if (Objects[Objects.length - 1].sphere.position.z > (paddle.position.z + 1)) {
                        // aiScore += 1;
                        New_ball_launched = false;
                        setAiScore((aiScore) => aiScore + 1)
                    } else if (Objects[Objects.length - 1].sphere.position.z < (paddleAi.position.z - 1)) {
                        // playerScore += 1;
                        New_ball_launched = false;
                        setPlayerScore((playerScore) => playerScore + 1)
                    }
                }
            }
        
            if (BallCreator.cameraFixed & Cameras.length === 2){
                checkCollision();
                
                if ( Chained_Keys.w === 1) {
                    keyboard.y += BallCreator.PADDLE_SPEED;
                }
                if (Chained_Keys.s === 1){
                    keyboard.y -= BallCreator.PADDLE_SPEED;
                }
                if (Chained_Keys.d === 1){
                    keyboard.x -= BallCreator.PADDLE_SPEED;
                }
                if (Chained_Keys.a === 1){
                    keyboard.x += BallCreator.PADDLE_SPEED; 
                }
        
                if (keyboard.x > 0){
                    keyboard.x = Math.min(keyboard.x, 1);
                }
                if (keyboard.x < 0){
                    keyboard.x = Math.max(keyboard.x, -1);
                }
                if (keyboard.y > 0){
                    keyboard.y = Math.min(keyboard.y, 1);
                }
                if (keyboard.y < 0){
                    keyboard.y = Math.max(keyboard.y, -1);
                }
        
                Cameras[0].position.x = 0;
                Cameras[0].position.y = 7.8;
                Cameras[0].position.z = 12.8;
                Cameras[0].position.x = 4 * mouse.x;
                Cameras[0].position.y = 6.8 + ( 1 * mouse.y);
        
        
                Cameras[1].position.x = 0;
                Cameras[1].position.y = 7.8;
                Cameras[1].position.z = -12.8;
                Cameras[1].position.x = 5.5 * keyboard.x;
                Cameras[1].position.y = 6.8 + ( 1 * keyboard.y);
        
                paddle.position.x = 5.5 * mouse.x;
                paddle.position.z = 11 - Math.abs((2 * mouse.x));
                paddle.position.y = 5.03 + (2 * mouse.y);
        
                paddleAi.position.x = 5.5 * keyboard.x;
                paddleAi.position.z = -( 11 - Math.abs((2 * keyboard.x)));
                paddleAi.position.y = 5.03 + (2 * keyboard.y);
        
                if (paddle.position.x >0){
                    gsap.to(paddle.rotation, {
                        x: 2.81,
                        y: 2.96,
                        z: 2.81,
                        duration: 0.095,
                        ease: "power2.inOut",
                    });
                }
                else{
                    gsap.to(paddle.rotation, {
                        x: 2.81,
                        y: 6.28,
                        z: 2.81,
                        duration: 0.095,
                        ease: "power2.inOut",
                    });
                }
        
                if (paddleAi.position.x > 0){
                    gsap.to(paddleAi.rotation, {
                        x: 3.25,
                        y: 2.96,
                        z: 2.81,
                        duration: 0.095,
                        ease: "power2.inOut",
                    });
                }
                else{
                    gsap.to(paddleAi.rotation, {
                        x: 3.25,
                        y: 6.28,
                        z: 2.81,
                        duration: 0.095,
                        ease: "power2.inOut",
                    });
                }
                
            }
        
            topControls.update()
            bottomControls.update()
        
            //renderer
            renderer.setScissorTest(true);
        
            // Top half
            renderer.setViewport(0, sizes.height / 2, sizes.width, sizes.height / 2);
            renderer.setScissor(0, sizes.height / 2, sizes.width, sizes.height / 2);
            renderer.render(scene, topCamera);
            
            // Bottom half
            renderer.setViewport(0, 0, sizes.width, sizes.height / 2);
            renderer.setScissor(0, 0, sizes.width, sizes.height / 2);
            renderer.render(scene, bottomCamera);
            
            renderer.setScissorTest(false);
            
            // stat.update()
            window.requestAnimationFrame(tick)
        }
        
        tick()
////=>////

        return() => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            renderer.dispose();

            gui.destroy();
            
            while (scene.children.length > 0) {
                const child = scene.children[0];
                scene.remove(child);
            }


            topControls.dispose();
            bottomControls.dispose()

            hit_sound.pause();
            hit_sound.src = "";
        };

    }, []);
  
    useEffect(() => {
        if (playerScore === 7 || aiScore === 7) {
            setPlayerScore(0);
            setAiScore(0);
            // navigate("/Winner")
            const finalScore = {
                p1: playerScore,
                p2: aiScore
              };
<<<<<<< HEAD
              navigate('/Tournament')
=======
              // #region Update the match history with the final score
            //   get the matchId, matches, matches, matches_history from localStorage
              let Matches= JSON.parse(localStorage.getItem('Matches_data'));
            //   const matchId = localStorage.getItem('matchId');
              let Matches_history = JSON.parse(localStorage.getItem('Matches_history'));
              // Update the score of the match
              if (matchId && Matches_history && Matches)
              {
                Matches_history[matchId].Score1 = playerScore;
                Matches_history[matchId].Score2 = aiScore;
                Matches_history[matchId].winner = (playerScore > aiScore) ? Matches[matchId].player1 : Matches[matchId].player2;
                // Update the winner of the match
                Matches[matchId].winner = (playerScore > aiScore) ? Matches[matchId].player1 : Matches[matchId].player2;
                // Update the next match (Final)
                if (matchId != 'Final') {
                    if (Matches['Final'].player1 === null) {
                    Matches['Final'].player1 = Matches[matchId].winner;
                    }
                    else {
                    Matches['Final'].player2 = Matches[matchId].winner;
                    }
                }
                // set the updated matches and matches_history to localStorage
                localStorage.setItem('Matches_data', JSON.stringify(Matches));
                localStorage.setItem('Matches_history', JSON.stringify(Matches_history));
                console.log(Matches, Matches_history, matchId);
              }
            if (matchId && matchId === "FINALY") {
                console.log('Winner is called\n')
                const matchData = JSON.parse(localStorage.getItem('Matches_data'));
                matchData[matchId].Score1 = playerScore;
                matchData[matchId].Score2 = aiScore;
                matchData[matchId].winner = (playerScore > aiScore) ? Matches[matchId].player1 : Matches[matchId].player2;
                localStorage.setItem('Matches_data', JSON.stringify(matchData));
                navigate('/Game/Winner');
            }
            else if (matchId && (matchId === 'Semi_Final_1' || matchId === 'Semi_Final_2' || matchId === 'Final'))
            {
                console.log("Tournament is called : ", matchId)
                navigate('/Game/Tournament')
            }
            else
            {
                console.log("matchId", matchId)
                navigate('/Game/PingPong_Lobby')
            }
>>>>>>> c61dcb11... PAGES
        }
      }, [playerScore, aiScore]);

    return (
        <>
            <LoadingScreen show={loading} />
            <canvas ref={canvasRef}></canvas>
            <Hud/>
            <Scoreboard playerScore={playerScore} aiScore={aiScore}/>
        </>
    )
};

export default LocalGame;
