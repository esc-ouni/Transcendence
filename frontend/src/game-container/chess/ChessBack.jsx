import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import gsap from 'gsap'; 
import LoadingScreen from '../components/LoadingScreen';
import '../game/RemoteScene.css'


const ChessGameBack = () => {
    const canvasRef = useRef(null);

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
        
        
        const scene = new THREE.Scene()
       
        const hit_sound     = new Audio('/chess-assets/sounds/passion.mp3');

        
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
            '/chess-assets/models/round_wooden_table_01_2k.gltf/round_wooden_table_01_2k.gltf',
            function ( gltf ) {
                gltf.scene.children[0].position.y = 0;
                scene.add( gltf.scene.children[0] ); //Jilali Table
            }
        );
        
        
        GLTFLoaderr.load(
            '/chess-assets/models/chess_set_2k.gltf/chess_set_2k.gltf',
            function ( gltf ) {
                let item;
        
                while (gltf.scene.children.length){
                    item = gltf.scene.children[0];
                    // console.log("=> ", item.name);
                    if (item.name === "board"){
                        item.position.y = 1.004;
                    }
                    else{
                        item.position.y = 1.0215;
                    }
                    scene.add(item)
                }
            }
        );
        
        
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
        
        
        //  Animate
        let cameraAngle  = 0;
        let cameraHeight = 0.9;
        let cameraRadius = 2; // Adjust based on your scene scale
        //
        
    
        const clock = new THREE.Clock()
        let previousTime = 0
        
        const tick = () =>
        {
        
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
        
            cameraAngle += 0.007;
            cameraHeight += 0.0007;
            camera.position.x = Math.cos(cameraAngle) * (cameraRadius - cameraHeight);
            camera.position.z = Math.sin(cameraAngle) * (cameraRadius - cameraHeight);
            camera.position.y = cameraHeight;
            
            if (cameraHeight > 2.3) cameraHeight = 0.9;
    
            camera.lookAt(0, 0, 0);
        
            // Update controls
            controls.update()
        
            // Render
            renderer.render(scene, camera)
        
            // Call tick again on the next frame
            window.requestAnimationFrame(tick)
        }
        
        tick()
        
////=>////

        return() => {

            window.removeEventListener('resize', handleResize)

            controls.dispose();
            renderer.dispose();

            
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
            <div className="blur-wrapper">
                <canvas ref={canvasRef}></canvas>
            </div>
        </>
    )
};

export default ChessGameBack;
