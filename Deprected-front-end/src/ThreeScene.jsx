import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import * as cannon from 'cannon';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import stats from 'stats.js'

import './ThreeScene.css'




const ThreeGame = () => {
  const canvasRef = useRef(null);
  
  const [isLoading, setisLoding] = useState(true);

  useEffect(() => {
    
    const stat = new stats()
    stat.showPanel(0)
    document.body.appendChild(stat.dom)
    
    
    const loadingManager = new THREE.LoadingManager();
    
    loadingManager.onLoad = function () {
      setisLoding(false);
    };
    
    const gui = new GUI()
    
    const canvas = document.querySelector('canvas.webgl')
    // canvas = canvasRef.current;
    canvasRef.current = canvas;

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
    
    // scene.add(floor)
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.14)
    scene.add(ambientLight)
    
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    // directionalLight.shadow.camera.far    = 300
    // directionalLight.shadow.camera.left   = - 20
    // directionalLight.shadow.camera.top    = 20
    // directionalLight.shadow.camera.right  = 20
    // directionalLight.shadow.camera.bottom = - 20
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)
    
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    
    
    window.addEventListener('resize', () =>
        {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        })
        
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.set(-15, 4, 0)
        // camera.position.set(0, 5.81, 11.77)
        // {x: -0.006796629480714592, y: 5.816349904903697, z: 11.774813465294566}
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
    
    //GLTF Loading
    // const GLTFLoaderr = new GLTFLoader(loadingManager); 
    const GLTFLoaderr = new GLTFLoader(); 
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
    
    //paddle
    const geometries = []
    
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
                
                geometries.push(node.geometry.clone());
            }
        })
    
        paddleAi = paddle.clone();
    
        paddleAi.position.z = -10;
        
        paddleAi.rotation.set(0, 0, 0);
    
        scene.add(paddle);
    
        scene.add(paddleAi);
    })
    
    const hit_sound = new Audio("/sounds/ping_pong.mp3");
    
    const Pong_Ball_colide = (impact) => {
        
        hit_sound.volume = Math.min(impact, 1);
        hit_sound.currentTime = 0;
        hit_sound.play();
    }
    
    const TextureLoader = new THREE.TextureLoader();
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
    
            sphereBody.applyForce(new cannon.Vec3(0, 0.4, 3), sphereBody.position)
            PhysicWorld.addBody(sphereBody);
        ball = sphere;
        Objects.push({sphere, sphereBody})
    }
    
    const PhysicWorld = new cannon.World();
    
    
    PhysicWorld.allowSleep = true;
    
    //Collision detction better than Naive
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
    // PhysicWorld.addContactMaterial(BallContactMaterial)
    PhysicWorld.addContactMaterial(PaddleBallContact)
    // PhysicWorld.addContactMaterial(BallNetMaterial)
    
    //plane
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
    //
    
    //To Add it To Dat Gui It has to be inside of an Object
    const BallCreator = {
        px: 0,
        py: 0.5,
        pz: 2 ,
        cameraFixed: false 
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
    // gui.add(BallCreator, 'px', -5, 5).step(0.1)
    // gui.add(BallCreator, 'py', -5, 5).step(0.1)
    // gui.add(BallCreator, 'pz', -5, 5).step(0.1)
    
    gui.add(BallCreator, 'createBall')
    gui.add(BallCreator, 'reset')
    //
    
    //Table Plane
    const geometry       = new THREE.BoxGeometry( 1, 1, 1 ); 
    const material       = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    material.transparent = true; 
    const Table          = new THREE.Mesh( geometry, material ); 
    Table.scale.set(3.3, 0.1, 3.3)
    
    Table.position.x = -0.01;
    Table.position.y = 4.15;
    Table.position.z = -0.06;
    
    Table.scale.x    = 8.28;
    Table.scale.y    = 0.3;
    Table.scale.z    = 18.51;
    
    // gui.add(Table.position, 'x', -10, 20).step(0.01)
    // gui.add(Table.position, 'y', -10, 20).step(0.01)
    // gui.add(Table.position, 'z', -10, 20).step(0.01)
    
    // scene.add(Table);
    
    // add the table to Physic world 
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
    
    // scene.add(Net);
    
    // const cannonDebugger = new CannonDebugger(scene, PhysicWorld, {
    //     color: 0xff0000, // Optional: Color of the debug visuals
    // });
    
    //  Animate
    const clock = new THREE.Clock()
    let previousTime = 0
    
    var rotationOffset = new cannon.Quaternion();
       rotationOffset.setFromEuler(-(Math.PI / 2), 0, 0);
    
    let paddleQuat = new cannon.Quaternion();
    
    
    //mouse event listener
    const mouse = new THREE.Vector2();
    const keyboard = new THREE.Vector2();
    keyboard.x = 0;
    keyboard.y = 0;
    
    
    window.addEventListener('mousemove', function (info) {
        // console.log('Mouse Moved', (info.clientX/window.innerWidth)*2-1 , -((info.clientY/window.innerHeight)*2-1));
        mouse.x = (info.clientX/window.innerWidth)*2-1;
        mouse.y = -((info.clientY/window.innerHeight)*2-1);
        // console.log(mouse.x, mouse.y);
    }
    )
    
    
    
    
    // enviroment map
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/models/neon_photostudio_2k.hdr', (enviroment_map) => {
        enviroment_map.mapping = THREE.EquirectangularReflectionMapping
        scene.background  = enviroment_map;
        scene.environment = enviroment_map;
    
        scene.backgroundBlurriness = 0.5; // Adjust this value between 0 (sharp) and 1 (very blurry)
        scene.environmentIntensity = 0.01;
    
    
        // Optionally, adjust the background intensity
        scene.backgroundIntensity = 0.007; // Adjust the brightne
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
    
    
    
    // Function to update BoxHelper every frame
    const updateHelper = () => {
        
        paddleBoxHelper1.update(); // Update the BoxHelper to match the object's bounding box
        paddleBoxHelper2.update(); // Update the BoxHelper to match the object's bounding box
        paddleBoxHelper3.update(); // Update the BoxHelper to match the object's bounding box
    };
    
    function checkCollision() {
        if (Objects.length){
            // Update bounding boxes with the current positions of the models
            paddleBoundingBox.setFromObject(paddle);
            paddleBoundingAiBox.setFromObject(paddleAi);
            ballBoundingBox.setFromObject(Objects[Objects.length - 1].sphere);
            NetBoundingBox.setFromObject(Net)
            
            // Check for intersection between paddle and ball
            if (paddleBoundingBox.intersectsBox(ballBoundingBox)) {
                Pong_Ball_colide(0.7);
                console.log('paddle and ball!');
    
                const hitDirection = paddle.position.x > 0  ? -1 : 1;
                let forceX = (0.3 * hitDirection)// + (Math.random() - 0.5);
                
                Objects[Objects.length - 1].sphereBody.torque.setZero();
                Objects[Objects.length - 1].sphereBody.velocity.set(0, 0, 0);
                Objects[Objects.length - 1].sphereBody.applyForce(new cannon.Vec3(forceX, 0.55, -3.5), Objects[Objects.length - 1].sphereBody.position)
                
                // const paddlePushbackDistance = 0.3; // How much the paddle moves back upon impact
                // gsap.to(paddle.position, {
                //     x: paddle.position.x + (hitDirection * -paddlePushbackDistance),
                //     duration: 0.1,
                //     ease: "power1.out"
                // }); // to be added in latter
                
            }
            else if (paddleBoundingAiBox.intersectsBox(ballBoundingBox)){
                Pong_Ball_colide(0.7);
                console.log('paddleAi and ball!');
                
                const hitDirection = paddleAi.position.x > 0  ? -1 : 1;
                let forceX = (0.3 * hitDirection) + (Math.random() - 0.5);
    
                Objects[Objects.length - 1].sphereBody.torque.setZero();
                Objects[Objects.length - 1].sphereBody.velocity.set(0, 0, 0);
                Objects[Objects.length - 1].sphereBody.applyForce(new cannon.Vec3(forceX, 0.55, 3.5), Objects[Objects.length - 1].sphereBody.position)
                
            }
            else if (NetBoundingBox.intersectsBox(ballBoundingBox)) {
                console.log('ball collided with the Net!');
                // Objects[Objects.length - 1].sphereBody.velocity.set(0, 0, -((Objects[Objects.length - 1].sphereBody.velocity.z))); //to be rechecked !
            }
        }
    }
    
    // scene.add(new THREE.GridHelper( 50, 50 ))
    // scene.add(new THREE.AxesHelper(15))
    
    gui.add(BallCreator, 'cameraFixed');
    
    // scene.backgroundBlurriness = 0.8
    // gui.add(scene, 'backgroundBlurriness', 0, 1);
    
    const tick = () =>
    {
        // stat.begin()
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime
        previousTime = elapsedTime
    
        PhysicWorld.step(1/60, deltaTime, 3)
        
    
        TableBody.position.x = Table.position.x;
        TableBody.position.y = Table.position.y;
        TableBody.position.z = Table.position.z;
    
    
        
        floor.position.copy(planeBody.position);
    
        floor.quaternion.copy(planeBody.quaternion);
    
    
    
        camera.position.y += 0.02;
        camera.position.z -= 0.02;
        camera.position.x += 0.02;
        // Table.position.copy(TableBody.position);
        Table.quaternion.copy(TableBody.quaternion);
        
        for (const object of Objects){
            
            object.sphere.position.copy(object.sphereBody.position);
            object.sphere.quaternion.copy(object.sphereBody.quaternion);
        }
        
        if (Objects.length && paddleAi){
            paddleAi.position.x = Objects[Objects.length - 1].sphere.position.x; 
            paddleAi.position.y = Objects[Objects.length - 1].sphere.position.y - 0.4;
        }
        
        if (BallCreator.cameraFixed){
            checkCollision();
            
            camera.position.x = 0;
            camera.position.y = 7.8;
            camera.position.z = 12.8;
            camera.position.x = 4 * mouse.x;
            camera.position.y = 6.8 + ( 1 * mouse.y);
            
            
            paddle.position.x = 5.5 * mouse.x;
            paddle.position.z = 11 - Math.abs((2 * mouse.x));
            paddle.position.y = 5.03 + (2 * mouse.y);
            
            // paddleAi.position.x = 5.5 * keyboard.x;
            // paddleAi.position.z = -( 11 - Math.abs((2 * keyboard.x)));
            // paddleAi.position.y = 5.03 + (2 * keyboard.y);
            
            // paddleBodyAi.position.copy(paddle.position);
            
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
    
        topControls.update()
        
        renderer.render(scene, camera)
        // stat.end()
        stat.update()
    
        window.requestAnimationFrame(tick)
    }
    
    tick()

    // Cleanup on unmount
    return () => {
      gui.destroy();
      renderer.dispose();
    };
  }, []);

  {/* <div id="loading-screen">
    <div id="loading-spinner"></div>
  </div> */}
    return (
      <>
      {<div className="three-scene">
        <canvas ref={canvasRef} className="webgl" />
      </div> }
      {<div className="blurring-layer" />}
      {<div className="ui-overlay">
         <button className="overlay-button">PLAY NOW</button>
         <button className="overlay-button">CUSTOMIZE</button>
       </div> }
    </>
    )
};

export default ThreeGame;
