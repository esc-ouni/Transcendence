import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as cannon from 'cannon';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import GUI from 'lil-gui';
import gsap from 'gsap';


const ThreeScene = () => {
    const mountRef = useRef(null);
  
    useEffect(() => {
      const gui = new GUI();
      const canvas = mountRef.current;
      const scene = new THREE.Scene();
  
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(30, 30),
        new THREE.MeshStandardMaterial({
          color: '#4444',
          metalness: 0,
          roughness: 0.5,
        })
      );
      floor.receiveShadow = true;
      floor.rotation.x = -Math.PI * 0.5;
      floor.material.side = THREE.DoubleSide;
    //   scene.add(floor);
  
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.14);
      scene.add(ambientLight);
  
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      directionalLight.shadow.camera.far = 300;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.bottom = -20;
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);
  
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
  
      const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
      camera.position.set(-15, 4, 0);
      scene.add(camera);
  
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
  
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
      const GLTFLoaderr = new GLTFLoader();
      GLTFLoaderr.load('/models/chinese_tea_table_4k.gltf/tabla_v2.gltf', function (gltf) {
        const model = gltf.scene;
        model.scale.set(1.12, 1.12, 1.12);
        model.position.y += 1.25;
        model.position.z = -1.4;
  
        model.traverse(function (node) {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
            node.material.wireframe = false;
          }
        });
        scene.add(model);
      });
  
      const clock = new THREE.Clock();
      let previousTime = 0;
  
      const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;
  
        controls.update();
        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
      };
  
      tick();
  
      window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });
  
      return () => {
        gui.destroy();
        window.removeEventListener('resize', () => {});
      };
    }, []);
  
    return <canvas ref={mountRef} className="webgl" />;
  };
  
  export default ThreeScene;