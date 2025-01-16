import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'; 
import LoadingScreen from '../../components/LoadingScreen';
import './../style.css'
import '../../game/RemoteScene.css'
import { useNavigate } from 'react-router-dom';
import { Chess } from 'chess.js'
import { Frame } from '../../components/Frame';
import { useMatchContext } from './../../game/MatchContext';


const sendGameUpdate = (is_capture, name, from, to) => {
    // console.log("=======>", Objects.length);
    const message = {
        type      : 'game_update',
        my_id     : matchData.myId,
        move      : {
            from  : from,
            to    : to,      
        },
        name      : name,
        is_capture: is_capture,
    };
    if (gameSocket.readyState === 1)
        gameSocket.send(JSON.stringify(message));
};


const ChessRemoteGame = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const [loading, setLoading] = useState(true);


    // Remote LOgic
    const { matchData } = useMatchContext();
        
    // console.log(matchData.roomName);
    // console.log(matchData.myId);
    if (!matchData.roomName || !matchData.myId || !matchData.color) return;
    let cinm = true;
    // console.log(matchData.color);

    let z;
    if (matchData.color === 'white'){
        z = -0.4220
    }
    else{
        z = 0.4220
    }

    // Remote LOgic
    
    let from ;
    let to   ;





    useEffect(() => {

        // Connect to the game server using those values
        const gameSocket = new WebSocket(`ws://localhost:8000/ws/chess/room/${matchData.roomName}/?user_id=${matchData.myId}`);
        // const gameSocket = new WebSocket(`ws://10.13.9.18:8000/ws/ping-pong/room/${matchData.roomName}/?user_id=${matchData.myId}`);
        
        gameSocket.onopen = () => {
            console.log("Connected to the game room:", matchData.roomName);
            setPlayerPov();
        };


        gameSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            // console.log("=> Type received :", data['type']);
            
            if (data['type'] == 'Game_State'){
                console.log("=> The brodcaster :", data['my_id']);
                console.log("   => Says        :", data['message'], '\n');
            }
            if (data['type'] == 'game_update'){
                Executor(data['is_capture'], data['name'], data['from'], data['to'])


            };


        };        



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
        
        // GLTFLoaderr.load(
        //     '/chess-assets/models/round_wooden_table_01_4k.gltf/round_wooden_table_01_4k.gltf',
        //     function ( gltf ) {
        //         gltf.scene.children[0].position.y = 0;
        //         // gui.add(gltf.scene.children[0].position, 'y', -50, 1).step(1);
        //         scene.add( gltf.scene.children[0] ); //Jilali Table
        //     }
        // );
        
        
        
        GLTFLoaderr.load(
            '/chess-assets/models/chess_set_4k.gltf/untitled.gltf',
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
            camera.position.set(0.011, 1.3785, z)
            controls.enabled = false
            cinm = false;
        }
        

        // document.addEventListener("keydown", handleKeyDown)
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
                    //Sending Packing
                    sendGameUpdate(result.captured, name, fromNotation, toNotation);

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

        /////
        function convertNotationToCoordinates(notation) {
            const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            
            // Basic validation on the input
            if (!notation || notation.length < 2) {
                return null;
            }
        
            // Extract column letter (e.g., 'a' from 'a4') and row number (e.g., '4' from 'a4')
            const col = notation[0];
            const rowStr = notation.substring(1);
            const row = parseInt(rowStr, 10);
        
            // Validate row is an integer
            if (isNaN(row)) {
                return null;
            }
        
            // Find the column index in [0..7], corresponding to [a..h]
            const columnIndex = columns.indexOf(col);
            if (columnIndex === -1) {
                return null;
            }
        
            // Reverse the logic from your original convertCoordinatesToNotation
        
            // Original:
            //   if (x < 0) columnIndex = x + 4
            //   else if (x > 0) columnIndex = x + 3
            //
            // So to invert:
            //   if (columnIndex < 4) x = columnIndex - 4
            //   else x = columnIndex - 3
            let x;
            if (columnIndex < 4) {
                x = columnIndex - 4;
            } else {
                x = columnIndex - 3;
            }
        
            // Original:
            //   if (y > 0) rowNumber = y + 4
            //   else rowNumber = y + 5
            //
            // So to invert:
            //   if (row >= 5) y = row - 4
            //   else y = row - 5
            let y;
            if (row >= 5) {
                y = row - 4;
            } else {
                y = row - 5;
            }
        
            // If x=0 was invalid in your original function, handle that:
            if (x === 0) {
                return null;
            }
        
            // Check if the computed coordinates remain within expected bounds 
            // (optional, depending on if you want to enforce the same validity checks)
            if (row < 1 || row > 8) {
                return null;
            }
        
            return { x, y };
        }
        
        function Executor(is_capture, name, from, to){
            if (is_capture){
                const capturedPiece = findCapturedPiece(name, toNotation);
                if (capturedPiece) {
                    console.log("Cptured Piece Found : ", capturedPiece.name);
                    scene.remove(capturedPiece);
                    objects = objects.filter(obj => obj !== capturedPiece); // tbu
                    capture_sound.play(); // Sound for capture
                }
            }
            cords = convertNotationToCoordinates({from, to})
            move_sound.play();
            pos.x =  -((cords[0] > 0 ? cords[0] - 1: cords[0]) * SQUARE_DIAMETER) - SQUARE_RADIUS;
            pos.z =   ((cords[1] > 0 ? cords[1] - 1: cords[1]) * SQUARE_DIAMETER) + SQUARE_RADIUS;
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

        let ah = new THREE.AxesHelper(15);
        const clock = new THREE.Clock()
        let previousTime = 0
        
        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
        
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
        </>
    )
};

export default ChessRemoteGame;
