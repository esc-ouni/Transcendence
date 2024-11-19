import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import CannonDebugger from 'cannon-es-debugger';
import { threeToCannon, ShapeType } from 'three-to-cannon';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const ThreeGame = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialization of Three.js, CANNON, and your game setup

    const gui = new GUI();
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5,
      })
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI * 0.5;
    floor.material.side = THREE.DoubleSide;
    scene.add(floor);

    // Lights
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

    // Cameras
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const topCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / (sizes.height / 2),
      0.1,
      100
    );
    topCamera.position.set(-15, 4, 0);
    scene.add(topCamera);

    const bottomCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / (sizes.height / 2),
      0.1,
      100
    );
    bottomCamera.position.set(15, 4, 0);
    scene.add(bottomCamera);

    // Controls
    const topControls = new OrbitControls(topCamera, canvas);
    topControls.enableDamping = true;

    const bottomControls = new OrbitControls(bottomCamera, canvas);
    bottomControls.enableDamping = true;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Physics
    const PhysicWorld = new CANNON.World();
    PhysicWorld.gravity.set(0, -9.82, 0);

    // Add paddle and objects
    const GLTFLoaderr = new GLTFLoader();
    let paddle = null;
    let paddleAi = null;
    let paddleBody = null;
    let paddleBodyAi = null;
    const geometries = [];

    GLTFLoaderr.load('/models/chinese_tea_table_4k.gltf/paddle_test.gltf', function (gltf) {
      const model = gltf.scene;
      paddle = model;
      model.scale.set(2.1, 2.1, 2.1);
      model.position.y = 4.0387;
      model.position.z = 10;
      model.traverse(function (node) {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          geometries.push(node.geometry.clone());
        }
      });

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true);
      const mergedMesh = new THREE.Mesh(mergedGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      mergedMesh.scale.copy(model.scale);
      paddle.rotation.x = 3.04;
      paddle.rotation.y = 3.19;
      paddle.rotation.z = 2.03;

      paddleBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3().copy(paddle.position),
        shape: threeToCannon(mergedMesh, { type: ShapeType.HULL }).shape,
        material: new CANNON.Material('paddle'),
        linearDamping: 0.05,
        angularDamping: 0.05,
      });

      paddleAi = paddle.clone();
      paddleAi.position.z = -10;
      paddleBodyAi = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3().copy(paddleAi.position),
        shape: threeToCannon(mergedMesh, { type: ShapeType.HULL }).shape,
        material: new CANNON.Material('paddle'),
        linearDamping: 0.05,
        angularDamping: 0.05,
      });

      PhysicWorld.addBody(paddleBody);
      paddleBodyAi.position.z = -10;
      PhysicWorld.addBody(paddleBodyAi);
      scene.add(paddle);
      scene.add(paddleAi);
    });

    // Increment/Decrement Logic with Clamping
    let value = 0;

    const incrementValue = () => {
      value = Math.min(value + 0.1, 1);
      console.log('Incremented Value:', value);
    };

    const decrementValue = () => {
      value = Math.max(value - 0.1, -1);
      console.log('Decremented Value:', value);
    };

    // Example usage
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowUp') {
        incrementValue();
      } else if (event.key === 'ArrowDown') {
        decrementValue();
      }
    });

    // Window Resize Event Listener
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      topCamera.aspect = sizes.width / (sizes.height / 2);
      bottomCamera.aspect = sizes.width / (sizes.height / 2);
      topCamera.updateProjectionMatrix();
      bottomCamera.updateProjectionMatrix();
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = clock.getDelta();

      // Update controls
      topControls.update();
      bottomControls.update();

      // Update the physics world
      PhysicWorld.step(1 / 60, deltaTime, 3);

      // Synchronize paddles with physics
      if (paddleBody != null && paddle != null) {
        paddle.position.copy(paddleBody.position);
        paddle.quaternion.copy(paddleBody.quaternion);
        paddleAi.position.copy(paddleBodyAi.position);
        paddleAi.quaternion.copy(paddleBodyAi.quaternion);
      }

      // Render the scene for each camera
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

      // Call tick again on the next frame
      requestAnimationFrame(tick);
    };

    tick();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      gui.destroy();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="webgl" />;
};

export default ThreeGame;
