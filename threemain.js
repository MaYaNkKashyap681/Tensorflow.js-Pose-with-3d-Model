// threemain.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ctr } from './centroid';

let point_x = 0;
let point_y = 0;
let model = null;
const canvas2d = document.getElementById("canvas3d");

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
canvas2d.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener("resize", () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;
  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
});

camera.position.z = 70;

const ambinetLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambinetLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 20, 0);
scene.add(directionalLight);

// Add orbital controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const loader = new GLTFLoader();

loader.load('./assets/tshirt1/scene.gltf', function (gltf) {
  console.log("Model Loaded Sucessfully")
  model = gltf.scene;
  console.log(model);
  model.position.set(point_x / 10, -point_y / 10, 0);
  model.scale.x = 1.4;
  scene.add(model);
}, undefined, function (error) {
  console.error(error);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.setClearColor(0x000000, 0);
  renderer.render(scene, camera);
  let point = ctr.getter();
  console.log(point)
  point_x = point[0];
  point_y = point[1];
  model.position.set(point_x / 25, point_y / 20, 0);
}

animate();
