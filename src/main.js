import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { ZONES, TOTAL_COLLECTIBLES } from './data.js';
import { buildGround, buildPath, buildSkyParticles, updateParticles } from './world.js';
import { buildZones } from './zones.js';
import { navigateToZone, goNext, goPrev, getCurrentZoneIndex } from './navigation.js';
import { buildCollectibles, updateCollectibles, handleCollectibleClick } from './collectibles.js';
import { initHUD } from './hud.js';

const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x0f172a);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f172a, 0.012);

// Isometric camera
const aspect = window.innerWidth / window.innerHeight;
const frustum = 14;
const camera = new THREE.OrthographicCamera(
  -frustum * aspect, frustum * aspect,
  frustum, -frustum,
  0.1, 1000
);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// Build world
buildGround(scene);
buildPath(scene);
const zoneGroups = buildZones(scene);
const particles = buildSkyParticles(scene);
buildCollectibles(scene);

// Player character — cute voxel cube with eyes
const playerGroup = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 0.8, 0.8),
  new THREE.MeshLambertMaterial({ color: 0xfbbf24 })
);
playerGroup.add(body);

const eyeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.05);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.15, 0.1, 0.41);
playerGroup.add(leftEye);

const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.15, 0.1, 0.41);
playerGroup.add(rightEye);

const mouth = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.08, 0.05),
  new THREE.MeshBasicMaterial({ color: 0x0f172a })
);
mouth.position.set(0, -0.1, 0.41);
playerGroup.add(mouth);

playerGroup.position.set(ZONES[0].position.x, 0.6, ZONES[0].position.z + 4);
scene.add(playerGroup);

// Set initial camera to zone 0
camera.position.set(
  ZONES[0].position.x + 20,
  20,
  ZONES[0].position.z + 20
);
camera.lookAt(ZONES[0].position.x, 0, ZONES[0].position.z);

// HUD
initHUD();

function onZoneArrive(index) {
  const zone = ZONES[index];
  document.getElementById('hud-zone-name').textContent =
    `${zone.name} — ${zone.subtitle}`;

  document.querySelectorAll('.nav-zone').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

// Nav button listeners
document.getElementById('nav-prev').addEventListener('click', () => {
  goPrev(camera, playerGroup, onZoneArrive);
});

document.getElementById('nav-next').addEventListener('click', () => {
  goNext(camera, playerGroup, onZoneArrive);
});

document.querySelectorAll('.nav-zone').forEach((btn) => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.zone, 10);
    navigateToZone(idx, camera, playerGroup, onZoneArrive);
  });
});

// Collectible click handler
canvas.addEventListener('click', (event) => {
  const result = handleCollectibleClick(event, camera, scene);
  if (!result) return;

  document.getElementById('hud-counter').textContent =
    `${result.collected} / ${result.total} discovered`;

  const tooltip = document.getElementById('tooltip');
  const tooltipText = document.getElementById('tooltip-text');
  tooltipText.textContent = result.label;
  tooltip.classList.remove('hidden');
  tooltip.style.left = `${result.screenPosition.x}px`;
  tooltip.style.top = `${result.screenPosition.y - 60}px`;

  setTimeout(() => {
    tooltip.classList.add('hidden');
  }, 3000);
});

// Keyboard navigation
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'd') {
    goNext(camera, playerGroup, onZoneArrive);
  } else if (event.key === 'ArrowLeft' || event.key === 'a') {
    goPrev(camera, playerGroup, onZoneArrive);
  }
});

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
  updateParticles(particles, time);
  updateCollectibles(time);

  // Player idle bob
  playerGroup.position.y = 0.6 + Math.sin(time * 0.003) * 0.15;
  playerGroup.rotation.y += 0.005;

  // Zone building animations
  zoneGroups.forEach((group) => {
    group.traverse((child) => {
      if (child.userData.blink) {
        child.visible = Math.sin(time * 0.005) > 0;
      }
      if (child.userData.flicker) {
        child.scale.y = 0.8 + Math.random() * 0.4;
      }
    });
  });

  renderer.render(scene, camera);
}
animate();

// Welcome message
const tooltip = document.getElementById('tooltip');
const tooltipText = document.getElementById('tooltip-text');
tooltipText.textContent = 'Welcome! Click the arrows or zones below to explore my journey. Click the glowing gems to discover achievements!';
tooltip.classList.remove('hidden');
tooltip.style.left = '50%';
tooltip.style.top = '40%';
tooltip.style.transform = 'translate(-50%, -50%)';
setTimeout(() => {
  tooltip.classList.add('hidden');
  tooltip.style.transform = '';
}, 5000);
