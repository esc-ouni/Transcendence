import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as cannon from 'cannon'
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
        
        window.addEventListener('resize', () =>
        {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            topCamera.aspect = sizes.width / (sizes.height / 2)
            bottomCamera.aspect = sizes.width / (sizes.height / 2)
            topCamera.updateProjectionMatrix()
            bottomCamera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
        
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
        GLTFLoaderr.load('/models/chinese_tea_table_4k.gltf/tabla_v2.gltf', function (gltf){
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
        
        GLTFLoaderr.load('/models/chinese_tea_table_4k.gltf/paddle_test.gltf', function (gltf){
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
        
        
        const hit_sound = new Audio("/sounds/ping_pong.mp3");
        
        const Pong_Ball_colide = (impact) => {
            hit_sound.volume = Math.min(impact, 1);
            hit_sound.currentTime = 0;
            hit_sound.play();
        }
        
        const TextureLoader = new THREE.TextureLoader(loadingManager);
        const Texture = TextureLoader.load("/textures/Models/ball.jpeg");
        
        let Objects  = [];
        
        let ball = null;
        
        const STDGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const STDMaterial = new THREE.MeshStandardMaterial;
        STDMaterial.metalness = 0.1;
        STDMaterial.roughness = 0.1;
        STDMaterial.map       = Texture;
        
        const sphereShape = new cannon.Sphere(0.1);
        
        const createSphere = (position, px, py, pz) => {
            const sphere = new THREE.Mesh(
                STDGeometry,
                STDMaterial)
                sphere.castShadow = true
                sphere.position.copy(position);
                
                scene.add(sphere)
                
                const sphereBody  = new cannon.Body({
                    mass: 0.0027,
                    shape: sphereShape,
                    material: plasticMaterial,
                    linearDamping: 0.05,
                    angularDamping:0.05
                });
            
                sphereBody.addEventListener('collide', () => {Pong_Ball_colide(0.5)});
                sphereBody.position.copy(sphere.position);
        
                sphereBody.torque.setZero()
                sphereBody.velocity.setZero();
                sphereBody.angularVelocity.setZero()
                sphereBody.applyForce(new cannon.Vec3(0, 0.5, 3), sphereBody.position)
                PhysicWorld.addBody(sphereBody);
            ball = sphere;
            Objects.push({sphere, sphereBody})
            New_ball_launched = true;
        }
        
        const PhysicWorld = new cannon.World();
        
        PhysicWorld.allowSleep = true;
        PhysicWorld.broadphase = new cannon.SAPBroadphase(PhysicWorld);
        
        PhysicWorld.gravity.set(0, -8.92, 0);
        
        const concreteMaterial = new cannon.Material('concrete');
        const plasticMaterial  = new cannon.Material('plastic');
        const PaddleMaterial   = new cannon.Material('paddle');
        const TableMaterial    = new cannon.Material('table');
        const NetMaterial      = new cannon.Material('net');
        
        const ContactMaterial = new cannon.ContactMaterial(
            plasticMaterial,
            concreteMaterial,
            {
                friction: 0.7,   
                restitution: 0.5
            }
        );
        
        const BallContactMaterial = new cannon.ContactMaterial(
            plasticMaterial,
            plasticMaterial,
            {
                friction: 0.2,   
                restitution: 0.9, 
            }
        );
        
        const BallTableMaterial = new cannon.ContactMaterial(
            plasticMaterial,
            TableMaterial,
            {
                friction: 0.3,   
                restitution: 0.9
            }
        );
        
        const BallNetMaterial = new cannon.ContactMaterial(
            plasticMaterial,
            NetMaterial,
            {
                friction: 0.1,   
                restitution: 0.2
            }
        );
        
        const PaddleBallContact = new cannon.ContactMaterial(
            plasticMaterial,
            PaddleMaterial,
            {
                friction: 0.5,   
                restitution: 0.7
            }
        );
        
        PhysicWorld.addContactMaterial(BallTableMaterial) // ball table
        PhysicWorld.addContactMaterial(ContactMaterial) // floor
        PhysicWorld.addContactMaterial(PaddleBallContact)
        // PhysicWorld.addContactMaterial(BallContactMaterial)
        // PhysicWorld.addContactMaterial(BallNetMaterial)
        
        const planeShape = new cannon.Plane();
        const planeBody  = new cannon.Body({
            mass: 0,
            position: new cannon.Vec3().copy(floor.position),
            shape: planeShape,
            material:concreteMaterial,
            linearDamping: 0.05, // Simulate air resistance
            angularDamping:0.05 // Simulate rotational resistance
        })
        planeBody.quaternion.setFromAxisAngle(
            new cannon.Vec3(-1, 0, 0),
            Math.PI * 0.5
        )
        
        planeBody.position.y = -0.137;
        
        PhysicWorld.addBody(planeBody);
        
        const BallCreator = {
            px: 0,
            py: 0.5,
            pz: 2 ,
            cameraFixed: false,
            PADDLE_SPEED: 0.02
        }
        
        BallCreator.reset = () => {
            for (const object of Objects){
                object.sphereBody.removeEventListener('collide', Pong_Ball_colide);
                PhysicWorld.removeBody(object.sphereBody);
                
                scene.remove(object.sphere);
            }
            Objects.splice(0, Objects.length)
        }
        
        BallCreator.createBall = () => {
            let x = (Math.random() - 0.5) * 4
            let y = 5.0387;
            let z = -8;
            
            createSphere(new THREE.Vector3(x, y, z), BallCreator.px, BallCreator.py, BallCreator.pz)
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
        
        //Table Physic
        const TableShape = new cannon.Box(new cannon.Vec3(Table.scale.x / 2, Table.scale.y / 2, Table.scale.z / 2));
        const TableBody  = new cannon.Body({
            mass: 0,
            position: new cannon.Vec3().copy(Table.position),
            shape: TableShape,
            material:TableMaterial,
            quaternion:Table.quaternion,
            linearDamping: 0.05, // Simulate air resistance
            angularDamping:0.05 // Simulate rotational resistance
        })
        TableBody.position.x = Table.position.x;
        TableBody.position.y = Table.position.y;
        TableBody.position.z = Table.position.z;
        PhysicWorld.addBody(TableBody);
        
        //Net
        const Net = new THREE.Mesh( geometry, material ); 
        Net.position.x = 0;
        Net.position.y = 4.66;
        Net.position.z = -0.02;
        Net.scale.set(10.29, 1, 0.05)
        
        // const cannonDebugger = new CannonDebugger(scene, PhysicWorld, {
        //     color: 0xff0000, // Optional: Color of the debug visuals
        // });
        
        // mouse event listener
        const mouse = new THREE.Vector2();
            window.addEventListener('mousemove', function (info) {
                mouse.x = (info.clientX/window.innerWidth)*2-1;
                mouse.y = -((info.clientY/window.innerHeight)*2-1);
            }
        )
        
        // keyboard event listener
        const keyboard = new THREE.Vector2();
        let Chained_Keys = [
            {w:0},
            {d:0},
            {s:0},
            {a:0},
        ]
        
        document.addEventListener(
            "keydown",
            (event) => {
              const keyName = event.key;
              console.log(keyName);
        
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
        )
        
        document.addEventListener(
            "keyup",
            (event) => {
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
        )
        
        
        // enviroment map
        const rgbeLoader = new RGBELoader(loadingManager);
        rgbeLoader.load('/models/neon_photostudio_2k.hdr', (enviroment_map) => {
            enviroment_map.mapping = THREE.EquirectangularReflectionMapping
            scene.background  = enviroment_map;
            scene.environment = enviroment_map;
            
            scene.backgroundBlurriness = 0.5; 
            scene.environmentIntensity = 0.01; 
            scene.backgroundIntensity  = 0.007;
        })
        
        const paddleBoundingBox   = new THREE.Box3();
        const paddleBoundingAiBox = new THREE.Box3();
        const ballBoundingBox     = new THREE.Box3();
        const NetBoundingBox      = new THREE.Box3();
        
        const paddleBoxHelper1 = new THREE.Box3Helper(paddleBoundingBox, 0xff0000);
        const paddleBoxHelper2 = new THREE.Box3Helper(paddleBoundingAiBox, 0xff0000);
        const paddleBoxHelper3 = new THREE.Box3Helper(ballBoundingBox, 0xff0000);
        const NetHelper3       = new THREE.Box3Helper(NetBoundingBox, 0xff0000);
        
        // scene.add(paddleBoxHelper1);
        // scene.add(paddleBoxHelper2);
        // scene.add(paddleBoxHelper3);
        // scene.add(NetHelper3);
        
        function checkCollision() {
            if (Objects.length){
                // Update bounding boxes with the current positions of the models
                paddleBoundingBox.setFromObject(paddle);
                paddleBoundingAiBox.setFromObject(paddleAi);
                ballBoundingBox.setFromObject(Objects[Objects.length - 1].sphere);
                NetBoundingBox.setFromObject(Net)
                
                if (paddleBoundingBox.intersectsBox(ballBoundingBox)) {
                    console.log('paddle and ball!');
                    
                    const hitDirection = paddle.position.x > 0  ? -1 : 1;
                    let forceX = (0.3 * hitDirection)// + (Math.random() - 0.5);
        
                    //for push Sumilation
                    gsap.to(paddle.rotation, {
                        x: paddle.rotation.x - 0.5,
                        y: paddle.rotation.y + (hitDirection * 0.3),
                        z: paddle.rotation.z + (hitDirection * 0.3),
                        duration: 0.1,
                        ease: "power3.out"
                    })
                    Pong_Ball_colide(0.7);
                    
                    Objects[Objects.length - 1].sphereBody.torque.setZero();
                    Objects[Objects.length - 1].sphereBody.velocity.setZero();
                    Objects[Objects.length - 1].sphereBody.angularVelocity.setZero()
                    Objects[Objects.length - 1].sphereBody.applyForce(new cannon.Vec3(forceX, 0.55, -3.4), Objects[Objects.length - 1].sphereBody.position)
                        
                    }
                    else if (paddleBoundingAiBox.intersectsBox(ballBoundingBox)){
                    console.log('paddleAi and ball!');
                    
                    const hitDirection = paddleAi.position.x > 0  ? -1 : 1;
                    let forceX = (0.3 * hitDirection) + (Math.random() - 0.5);
                    
                    //for push Sumilation
                    gsap.to(paddle.rotation, {
                        x: paddle.rotation.x + 0.5,
                        y: paddle.rotation.y + (hitDirection * 0.3),
                        z: paddle.rotation.z + (hitDirection * 0.3),
                        duration: 0.1,
                        ease: "power3.out"
                    })
                    Pong_Ball_colide(0.7);
                    
                    Objects[Objects.length - 1].sphereBody.torque.setZero();
                    Objects[Objects.length - 1].sphereBody.velocity.setZero();
                    Objects[Objects.length - 1].sphereBody.angularVelocity.setZero()
                    Objects[Objects.length - 1].sphereBody.applyForce(new cannon.Vec3(forceX, 0.55, 3.4), Objects[Objects.length - 1].sphereBody.position)
                    
                }
                else if (NetBoundingBox.intersectsBox(ballBoundingBox)) {
                    console.log('ball collided with the Net!');
                    // Objects[Objects.length - 1].sphereBody.velocity.z = -(Objects[Objects.length - 1].sphereBody.velocity.z) * 0.5; //Good !
                    // Good just need to get the best velocity values
                }
            }
        }
        
        // scene.add(new THREE.GridHelper( 50, 50 ))
        // scene.add(new THREE.AxesHelper(15))

        
        gui.add(BallCreator, 'cameraFixed');
        gui.add(BallCreator, 'PADDLE_SPEED', 0.01 , 0.2).step(0.01)
        
        //  Animate
        const clock = new THREE.Clock()
        let previousTime = 0
        
        const tick = () =>
            {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
            
            PhysicWorld.step(1/60, deltaTime, 3)
            
            TableBody.position.x = Table.position.x;
            TableBody.position.y = Table.position.y;
            TableBody.position.z = Table.position.z;
            
            floor.position.copy(planeBody.position);
            floor.quaternion.copy(planeBody.quaternion);
        
            Cameras[0].position.y += 0.02;
            Cameras[0].position.z -= 0.02;
            Cameras[0].position.x += 0.02;
        
            Cameras[1].position.y += 0.02;
            Cameras[1].position.z -= 0.02;
            Cameras[1].position.x += 0.02;
        
            Table.position.copy(TableBody.position);
            Table.quaternion.copy(TableBody.quaternion);
            
            for (const object of Objects){
                object.sphere.position.copy(object.sphereBody.position);
                object.sphere.quaternion.copy(object.sphereBody.quaternion);

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
            // window.removeEventListener('resize', handleResize);
            // window.removeEventListener('mousemove', handleMouseMove);
            // document.removeEventListener('keydown', handleKeyDown);
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
            navigate("/Winner")
            //   alert(`${playerScore === 7 ? 'Player' : 'Ai'} Wins!`);
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
