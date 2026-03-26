import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0f172a);

const scene = new THREE.Scene();

// Isometric camera
const aspect = window.innerWidth / window.innerHeight;
const frustum = 20;
const camera = new THREE.OrthographicCamera(
  -frustum * aspect, frustum * aspect,
  frustum, -frustum,
  0.1, 1000
);
camera.position.set(20, 20, 20);
camera.lookAt(0, 0, 0);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Test cube
const geo = new THREE.BoxGeometry(2, 2, 2);
const mat = new THREE.MeshLambertMaterial({ color: 0x4ade80 });
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);

// Resize
window.addEventListener('resize', () => {
  const a = window.innerWidth / window.innerHeight;
  camera.left = -frustum * a;
  camera.right = frustum * a;
  camera.top = frustum;
  camera.bottom = -frustum;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
  renderer.render(scene, camera);
}
animate();
