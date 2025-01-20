import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'

import gsap from 'gsap'; 
import LoadingScreen from '../components/LoadingScreen';

import '../game/RemoteScene.css'


const PingPongBack = () => {
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
            
            paddleAi = paddle.clone();
            paddleAi.position.z = -10;
            paddleAi.rotation.set(0, 0, 0);
        
            scene.add(paddle);
            scene.add(paddleAi);
        })
        

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
        
        //  Animate
        const clock = new THREE.Clock()
        let   deltaTime    = 0;
        
        let   angle = 0; // Start angle for rotation
        const radius = 12; // Distance from the center of the object
        
        const tick = () =>
        {
            deltaTime = clock.getDelta();
        
            angle += 0.25 * deltaTime;
        
            camera.position.x = radius * Math.cos(angle) ;
            camera.position.z = radius * Math.sin(angle);
            camera.position.y = (radius * (Math.abs(Math.sin(angle)) / 2)) + 5;
            
        
            topControls.update()
            
            renderer.render(scene, camera)
        
            renderer.setAnimationLoop(tick);
        }
        
        tick()
////=>////

        return() => {
            window.removeEventListener('resize', handleResize);

            while (scene.children.length > 0) {
                const child = scene.children[0];
                scene.remove(child);
            }

            renderer.dispose();

            topControls.dispose();
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

export default PingPongBack;
