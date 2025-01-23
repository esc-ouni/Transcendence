import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'; 
import LoadingScreen from '../components/LoadingScreen';
import './style.css'
import '../game/RemoteScene.css'
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js'
import { Frame } from '../components/Frame';


const LocalChessGame = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const buttonRef = useRef(null);

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



        let canvas = null;
        if (canvasRef.current != null)
            canvas = canvasRef.current
        
        const gui = new GUI()
        
        const scene = new THREE.Scene()
       
        const hit_sound     = new Audio('/chess-assets/sounds/passion.mp3');
        const move_sound    = new Audio('/chess-assets/sounds/move.mp3');
        const illegal_sound = new Audio('/chess-assets/sounds/illegal.mp3');
        const capture_sound = new Audio('/chess-assets/sounds/capture.mp3');

        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 10),
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
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.set(1024, 1024)
        directionalLight.shadow.camera.far = 15
        directionalLight.shadow.camera.left = - 7
        directionalLight.shadow.camera.top = 7
        directionalLight.shadow.camera.right = 7
        directionalLight.shadow.camera.bottom = - 7
        directionalLight.position.set(5, 5, 5)
        scene.add(directionalLight)
        
        //  Sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        
        window.addEventListener('resize', handleResize)

        function handleResize(event) {
            // Update sizes
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
        
            // Update camera
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
        
            // Update renderer
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))     
        }
        
        // Base camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        camera.position.set(-0.71, 1.41, 0.78)
        scene.add(camera)
        
        // Controls
        const controls = new OrbitControls(camera, canvas)
        controls.target.set(0, 0.75, 0)
        controls.enableDamping = true
        
        let objects = []
        
        //  Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas
        })
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
        //
        
        //GLTF Loading
        const GLTFLoaderr = new GLTFLoader(loadingManager);
        
        GLTFLoaderr.load(
            '/chess-assets/models/round_wooden_table_01_4k.gltf/round_wooden_table_01_4k.gltf',
            function ( gltf ) {
                gltf.scene.children[0].position.y = 0;
                // gui.add(gltf.scene.children[0].position, 'y', -50, 1).step(1);
                scene.add( gltf.scene.children[0] ); //Jilali Table
            }
        );
        
        
        
        GLTFLoaderr.load(
            '/chess-assets/models/chess_set_4k.gltf/chess_set_4k.gltf',
            function ( gltf ) {
                let item;
        
                while (gltf.scene.children.length){
                    item = gltf.scene.children[0];
                    // console.log("=> ", item.name);
                    if (item.name === "board"){
                        item.position.y = 1.004;
                    }
                    else{
                        objects.push(item)
                        item.position.y = 1.0215;
                    }
                    scene.add(item)
                }
            }
        );
        
        let dragg = false
        let controls2; 
        
        
        
        //
        // //Enviroment Map
        // const rgbeLoader = new RGBELoader();
        // rgbeLoader.load('/chess-assets/models/envmap/photo_studio_loft_hall_8k.pic', (enviroment_map) => {
        //     enviroment_map.mapping = THREE.EquirectangularReflectionMapping
        //     scene.background  = enviroment_map;
        //     scene.environment = enviroment_map;
        // })
        
        // enviroment map
        const rgbeLoader = new RGBELoader(loadingManager);
        rgbeLoader.load('/chess-assets/models/neon_photostudio_2k.hdr', (enviroment_map) => {
            enviroment_map.mapping = THREE.EquirectangularReflectionMapping
            scene.background  = enviroment_map;
            scene.environment = enviroment_map;
            
            scene.backgroundBlurriness = 0.5; 
            scene.environmentIntensity = 0.01; 
            scene.backgroundIntensity  = 0.007;
        })
        
        let cinm = true;
        
        function setPlayerPov(){
            // camera.position.set(0.011, 1.3785, camera.position.z > 0 ? -0.4220:0.4220)
            camera.position.set(0.011, 1.3785, -0.4220)
            controls.enabled = false
            cinm = false;
        }
        
        const handleKeyDown = (event) => {
            const keyName = event.key;
        
            if (keyName === " "){
                setPlayerPov();
            }
        };
        document.addEventListener("keydown", handleKeyDown)
        controls2 = new DragControls( objects, camera, canvas );
            
        // add event listener to highlight dragged objects
        
        const MAX_HEIGHT = 1.03; // Set your desired maximum height
        let init_pos_x, init_pos_y;
        
        controls2.addEventListener('drag', handleDrag);

        function handleDrag(event) {
            // console.log( event.object.name , ' : hello, I\'m being draged !');
            // Clamp the y position to not exceed MAX_HEIGHT
            if (event.object.position.y > MAX_HEIGHT) {
                event.object.position.y = MAX_HEIGHT;
            }
            if (event.object.position.y <= 1.021) {
                event.object.position.y = 1.021;
            }
        }
        
        ///l
        controls2.addEventListener( 'dragstart', handleDragStart);

        function handleDragStart(event) {
            // controls.enabled = false
            event.object.material.emissive.set( 0xaaaaaa );
            init_pos_x = event.object.position.x;
            init_pos_y = event.object.position.z;
        }
        
        ///Edge Case
        function isNegativeZero(value) {
            return value === 0 && (1 / value) === -Infinity;
        }
        ///
        
        controls2.addEventListener( 'dragend', handleDragEnd);

        function handleDragEnd(event) {
            // controls.enabled = true
            event.object.material.emissive.set( 0x000000 );
            event.object.position.y = 1.0215;
        
            Validator(event.object.name, event.object.position);
        }
        //

        ///Get The position World to matrix
        const RATIO_FACTOR    = 19.74;
        const SQUARE_DIAMETER = 0.058;
        const SQUARE_RADIUS   = 0.029;
        
        
        
        
        ///Using lib
        const engine_validator = new Chess();
        ///
        
        ///cordinnatesToNotation
        function convertCoordinatesToNotation(x, y) {
            const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const columnIndex = x < 0 ? x + 4 : x > 0 ? x + 3 : null;
            const rowNumber = y > 0 ? y + 4 : y + 5;
            
            if (columnIndex === null || columnIndex < 0 || columnIndex > 7 || rowNumber < 1 || rowNumber > 8) {
                return null;
            }
            
            return columns[columnIndex] + rowNumber;
        }
        ///
        
        ///Capturing
        function findCapturedPiece(name, squareNotation) {
            for (const piece of objects) {
                const [x, y] = WorldToMatrix(piece.position.x, piece.position.z);
                if (convertCoordinatesToNotation(x, y) === squareNotation && name !== piece.name){
                    console.log(piece.name, " being Captured !");
                    return piece;
                }
            }
            return null;
        }
        ///
        
        ///Validator
        function Validator(name, pos) {
            let words = WorldToMatrix(init_pos_x, init_pos_y);
            let cords = WorldToMatrix(pos.x, pos.z);
        
        
            const fromNotation = convertCoordinatesToNotation(words[0], words[1]);
            const toNotation   = convertCoordinatesToNotation(cords[0], cords[1]);
        
            console.log('before cordinnates : ', words[0], words[1]);
            console.log('from : ', fromNotation);
            console.log('after  cordinnates : ', cords[0], cords[1]);
            console.log('to   : ', toNotation);
            console.log('\n\n');
        
            if ((cords[0] > 4 || cords[0] < -4) || (cords[1] > 4 || cords[1] < -4) || !fromNotation || !toNotation){
                // illegal_sound.play();
                pos.x = init_pos_x;
                pos.z = init_pos_y;
                return ;
            }
        
            try {
                let result = engine_validator.move({from : fromNotation, to: toNotation});
                console.log('==> Game judgemet : ', result);
                if (result){
                    console.log('Valid Move !')
        
                    ///Capturing
                    if (result.captured){
                        const capturedPiece = findCapturedPiece(name, toNotation);
                        if (capturedPiece) {
                            console.log("Cptured Piece Found : ", capturedPiece.name);
                            scene.remove(capturedPiece);
                            objects = objects.filter(obj => obj !== capturedPiece); // tbu
                            capture_sound.play(); // Sound for capture
                        }
                    }
                    move_sound.play();
                    pos.x =  -((cords[0] > 0 ? cords[0] - 1: cords[0]) * SQUARE_DIAMETER) - SQUARE_RADIUS;
                    pos.z =   ((cords[1] > 0 ? cords[1] - 1: cords[1]) * SQUARE_DIAMETER) + SQUARE_RADIUS;
                    gsap.to(camera.position, {
                        z: camera.position.z > 0 ? -0.4220:0.4220,
                        duration: 1.5,
                        ease: "power3.inOut",
                    });
                }
                else {
                    console.log('InValid Move !')
                    illegal_sound.play();
                    pos.x = init_pos_x;
                    pos.z = init_pos_y;
                    return ;
                }   
            } catch (error) {
                console.log('InValid Move !')
                illegal_sound.play();
                pos.x = init_pos_x;
                pos.z = init_pos_y;
                return ;
            }
        }
        ///
        
        
        function WorldToMatrix(world_x, world_y){
            let x = -Math.round(world_x * RATIO_FACTOR);
            let y =  Math.round(world_y * RATIO_FACTOR);
            
            if (x === 0 && isNegativeZero(x)){
                x = -1
            }
            else if (x === 0 ){
                x = 1
            }
            if (y === 0 && isNegativeZero(y)){
                y = -1
            }
            else if (y === 0){
                y = 1
            }
            // console.log("x : ",  x,", y : ", y);
            return [x, y];
        }
        ///
        
        
        ////BUttona
        let button = null;
        if (buttonRef.current != null){
            button = buttonRef.current
            button.addEventListener('click', setPlayerPov);
        }
        ///
        
        //  Animate
        let cameraAngle  = 0;
        let cameraHeight = 0.9;
        let cameraRadius = 2; // Adjust based on your scene scale
        //
        
        let ah = new THREE.AxesHelper(15);
        const clock = new THREE.Clock()
        let previousTime = 0
        
        const tick = () =>
        {
            if (objects.length && dragg === false){
                hit_sound.play();
                dragg = true;
                // console.log('Drag activated !');
            }
        
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
        
            if (cinm){
                cameraAngle += 0.007;
                cameraHeight += 0.0007;
                camera.position.x = Math.cos(cameraAngle) * (cameraRadius - cameraHeight);
                camera.position.z = Math.sin(cameraAngle) * (cameraRadius - cameraHeight);
                camera.position.y = cameraHeight;
                
                if (cameraHeight > 3) cameraHeight = 0.9;
        
                camera.lookAt(0, 0, 0);
            }
        
            // Update controls
            controls.update()
        
            // console.log(camera.position);
        
            // Render
            renderer.render(scene, camera)
        
            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        
        tick()
        
////=>////

        return() => {

            window.removeEventListener('resize', handleResize)
            document.removeEventListener("keydown", handleKeyDown)
            controls.dispose();
            if (controls2){
                controls2.removeEventListener('drag', handleDrag);
                controls2.removeEventListener( 'dragstart', handleDragStart);
                controls2.removeEventListener( 'dragend', handleDragEnd);
                controls2.dispose();
            }

            renderer.dispose();

            gui.destroy();
            
            while (scene.children.length > 0) {
                const child = scene.children[0];
                scene.remove(child);
            }

            hit_sound.pause();
            hit_sound.src = "";
        };

    }, []);
  
    return (
        <>
            <LoadingScreen show={loading} />
            <canvas ref={canvasRef}></canvas>
            <button className="button" ref={buttonRef}>Press Start To Start</button>
        </>
    )
};

export default LocalChessGame;
