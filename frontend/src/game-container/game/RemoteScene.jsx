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
import { useMatchContext } from './MatchContext';

const RemoteGame = () => {
    
    
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
        const gameSocket = new WebSocket(`ws://localhost:8000/ws/ping-pong/room/${matchData.roomName}/?user_id=${matchData.myId}`);
        // const gameSocket = new WebSocket(`ws://10.11.5.2:8000/ws/ping-pong/room/${matchData.roomName}/?user_id=${matchData.myId}`);
        
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
                    navigate('/Game/Winner');
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

        // Physics properties (perfect values)
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
        
        
        // const scene = new THREE.Scene()
        
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
        
        //event listeners
        const handleResize = () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        };
        
        window.addEventListener('resize', handleResize)
        
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.set(-22, 6, 0)
        scene.add(camera)
        
        const topControls = new OrbitControls(camera, canvas)
        topControls.enableDamping = true
        
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
            paddleAi.rotation.set(0, 0, 0);
        
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
        
        
        const STDGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const STDMaterial = new THREE.MeshStandardMaterial;
        STDMaterial.metalness = 0.1;
        STDMaterial.roughness = 0.1;
        STDMaterial.map       = Texture;
        
        
        function applyForce(obj, Velocity){
            obj.velocity.copy(Velocity)
        }
        
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
                    created_by_me: status
                });
        
                // serve 
                Objects[Objects.length - 1].velocity.set(BallCreator.serve_x, BallCreator.serve_y, BallCreator.serve_z); 
        
            New_ball_launched = true;
        }
        
        const BallCreator = {
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
        
        gui.add(BallCreator, 'serve_x',  -20,  70).step(0.05)
        gui.add(BallCreator, 'serve_y',  -20,  70).step(0.05)
        gui.add(BallCreator, 'serve_z',  -20,  70).step(0.05)
        
        gui.add(BallCreator, 'hit_x', -20,  70).step(0.05)
        gui.add(BallCreator, 'hit_y', -20,  70).step(0.05)
        gui.add(BallCreator, 'hit_z', -20,  70).step(0.05)
        
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
        
        // mouse event listener
        
        let mouseDirection = 0;
        let prevMouseX = 0;
        
        
        //event listeners
        
        const handleMouseMove = (info) => {
            mouse.x = (info.clientX/window.innerWidth)*2-1;
            mouse.y = -((info.clientY/window.innerHeight)*2-1);
            
            mouseDirection = mouse.x > prevMouseX ? 1 : -1;
            prevMouseX = mouse.x;
        };
        
        const handleKeyDown = (event) => {
            const keyName = event.key;
          
              if (keyName === "r"){
                  BallCreator.createBall()
              }
              if (keyName === "t"){
                  BallCreator.reset()
              }
              if (keyName === "v"){
                  BallCreator.cameraFixed = true;
              }
              if (keyName === "b"){
                  BallCreator.cameraFixed = false;
              }
        };
        document.addEventListener("keydown", handleKeyDown)
        //
        
        
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', handleMouseMove)
        
        
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
        
        // scene.add(PaddleBoxHelper);
        // scene.add(PaddleAiBoxHelper);
        // scene.add(BallBoxHelper);
        // scene.add(TableBoxHelper);
        // scene.add(NetHelper);
        
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
                    // let intensity = Math.max((3 - (Math.abs(paddleAi.position.x))), 0);
                    // if ((paddleAi.position.x > 2) && (OppmouseDirection < 0)){
                    //     intensity = (Math.abs(paddleAi.position.x) * 0.5) ;
                    // }
                    // if ((paddleAi.position.x < -2) && (OppmouseDirection > 0)){
                    //     intensity = (Math.abs(paddleAi.position.x) * 0.5);
                    // }    
                    // let forceX = (intensity * OppmouseDirection)
                    // console.log(forceX > 0 ? "right" : "left");

                    let intensity = Math.max((3 - (Math.abs(paddleAi.position.x))), 0);
                    if ((paddleAi.position.x > 2) && (OppmouseDirection > 0)){
                        intensity = (Math.abs(paddleAi.position.x) * 0.5) ;
                    }
                    if ((paddleAi.position.x < -2) && (OppmouseDirection < 0)){
                        intensity = (Math.abs(paddleAi.position.x) * 0.5);
                    }    
                    let forceX = -(intensity * OppmouseDirection)
                    
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
        
        // scene.add(new THREE.GridHelper( 50, 50 ))
        // scene.add(new THREE.AxesHelper( 50 ))
        
        gui.add(BallCreator, 'cameraFixed');
        
        //Scoring System
        let PlayerScore = 0;
        let AiScore     = 0;
        let New_ball_launched = false;
        
        //  Animate
        const clock = new THREE.Clock()
        let   deltaTime    = 0;
        
        let   angle = 0; // Start angle for rotation
        const radius = 20; // Distance from the center of the object
        const target = new THREE.Vector3(0, 0, 0);

////==>////
        const sendPaddleUpdate = (end_state) => {
            // console.log("=======>", Objects.length);
            const message = {
                type: 'paddle_update',
                my_id: matchData.myId,
                paddle: {
                    x: mouse.x,
                    y: mouse.y,      
                },
                ball: {
                    c:  Objects.length,
                    
                    x:  Objects[Objects.length - 1]?.sphere?.position?.x,
                    y:  Objects[Objects.length - 1]?.sphere?.position?.y,
                    z:  Objects[Objects.length - 1]?.sphere?.position?.z,

                    mousedirection: mouseDirection,

                    status: Objects[Objects.length - 1]?.created_by_me ?? false,
                    state : end_state
                }
            };
            if (gameSocket.readyState === 1)
                gameSocket.send(JSON.stringify(message));
        };

        let   accumulator = 0;
        const targetInterval = 1/60; // ~0.0333 seconds = 33ms
        ////==>////
        
        const tick = () =>
        {
            //tbr
            if (paddleAi && paddle){
                setTimeout(()=> {BallCreator.cameraFixed = true} , 3800)
            }
            
            deltaTime = clock.getDelta();
            
            accumulator += deltaTime;
            
            angle += 0.005;
            
            camera.position.x += deltaTime/10 * (target.x + radius * Math.cos(angle));
            camera.position.z += deltaTime/10 * (target.z + radius * Math.sin(angle));
            camera.position.y = 9;
            
            
        if (BallCreator.cameraFixed){
            if (accumulator >= targetInterval) {
                // console.log('Updater triggered !');
                // if (O)
                sendPaddleUpdate(false);  // your function that does socket.send(...)
                accumulator -= targetInterval;
            }
            for (const obj of Objects) {
                // Apply Gravity
                // if (obj.created_by_me === true){
                    obj.velocity.y += gravity * deltaTime;
                    
                    // Update position
                    obj.sphere.position.x += obj.velocity.x * deltaTime;
                    obj.sphere.position.y += obj.velocity.y * deltaTime;
                    obj.sphere.position.z += obj.velocity.z * deltaTime;       
                // }
            }
            
            if (Objects.length && paddleAi){
                // paddleAi.position.x = Objects[Objects.length - 1].sphere.position.x; 
                // paddleAi.position.y = Objects[Objects.length - 1].sphere.position.y - 0.4;
                
                //Scoring System
                if (New_ball_launched){
                    if (Objects[Objects.length - 1].sphere.position.z > (paddle.position.z + 1)) {
                        // aiScore += 1;
                        New_ball_launched = false;
                        if (aiScore === 6){
                            sendPaddleUpdate(true);
                        }
                        setAiScore((aiScore) => aiScore + 1)
                    } else if (Objects[Objects.length - 1].sphere.position.z < (paddleAi.position.z - 1)) {
                        // playerScore += 1;
                        New_ball_launched = false;
                        if (playerScore === 6){
                            sendPaddleUpdate(true);
                        }
                        setPlayerScore((playerScore) => playerScore + 1)
                    }
                }
                
                // if (PlayerScore === 7 || AiScore === 7) {
                    //     updateScoreboard()
                    //     alert(`${PlayerScore === 7 ? 'Player' : 'Ai'} Wins!`);
                    //     PlayerScore = 0;
                    //     AiScore = 0;
                    //     updateScoreboard()
                    // }
                }
                
        
                camera.position.x = 0;
                camera.position.y = 7.8;
                camera.position.z = 12.8;
                camera.position.x = (4 * mouse.x);
                camera.position.y = (6.8 + ( 1 * mouse.y));
                
                paddle.position.x = (5.5 * mouse.x);
                // paddle.position.z = (11 - Math.abs((2 * mouse.x))); // edge effect
                paddle.position.y = (5.03 + (2 * mouse.y));

                paddleAi.position.x = (5.5 * (-Aix));
                // paddleAi.position.z = (11 - Math.abs((2 * mouse.x))); // edge effect
                paddleAi.position.y = (5.03 + (2 * Aiy));
                
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
                        x: 2.81,
                        y: 2.96,
                        z: 2.81,
                        duration: 0.095,
                        ease: "power2.inOut",
                    });
                }
                else{
                    gsap.to(paddleAi.rotation, {
                        x: 2.81,
                        y: 6.28,
                        z: 2.81,
                        duration: 0.095,
                        ease: "power2.inOut",
                    });
                }
                
            }
            // if (Objects.length && (Objects[Objects.length - 1].created_by_me === true)){
            checkCollision();
            // }
        
            topControls.update()
            // stat.update()
            
            renderer.render(scene, camera)
        
            renderer.setAnimationLoop(tick);
        }
        
        tick()
////=>////

        return() => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('keydown', handleKeyDown);

            while (scene.children.length > 0) {
                const child = scene.children[0];
                scene.remove(child);
            }

            renderer.dispose();

            gui.destroy();

            topControls.dispose();

            hit_sound.pause();
            hit_sound.src = "";
            gameSocket.close();
        };

    }, [matchData.roomName]);
  
    useEffect(() => {
    if (playerScore === 7 || aiScore === 7) {
        // sendPaddleUpdate(true);
        setPlayerScore(0);
        setAiScore(0);
        navigate('/Game/Winner');
        // alert(`${playerScore === 7 ? 'Player' : 'Ai'} Wins!`);
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

export default RemoteGame;
