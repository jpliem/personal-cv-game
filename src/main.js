import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { ZONES, TOTAL_COLLECTIBLES } from './data.js';
import { buildGround, buildPath, buildSideQuestAreas, buildSkyParticles, updateParticles } from './world.js';
import { buildZones } from './zones.js';
import { navigateToZone, goNext, goPrev, updateNavigation, isNavigating } from './navigation.js';
import { buildCollectibles, updateCollectibles, handleCollectibleClick } from './collectibles.js';
import { initHUD } from './hud.js';
import { showDialogue, advanceDialogue, isDialogueActive } from './dialogue.js';
import { createLabels, updateLabels } from './labels.js';
import { startBgMusic, playCollectSound, playTransitionSound, toggleMute } from './audio.js';
import { updateSideQuests, hideSideQuests } from './sidequests.js';

// --- Renderer ---
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0xdfe6f0);

// --- Scene ---
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xdfe6f0, 40, 80);

// --- Camera ---
const aspect = window.innerWidth / window.innerHeight;
const frustum = 12;
const camera = new THREE.OrthographicCamera(
  -frustum * aspect, frustum * aspect,
  frustum, -frustum,
  0.1, 1000
);
camera.position.set(ZONES[0].position.x + 20, 20, ZONES[0].position.z + 20);
camera.lookAt(ZONES[0].position.x, 0, ZONES[0].position.z);

// --- Lighting ---
const hemiLight = new THREE.HemisphereLight(0x88bbff, 0xffddcc, 0.7);
scene.add(hemiLight);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(15, 25, 15);
scene.add(dirLight);

ZONES.forEach((zone) => {
  const light = new THREE.PointLight(zone.colors.primary, 0.3, 12);
  light.position.set(zone.position.x, 4, zone.position.z);
  scene.add(light);
});

// --- Build World ---
buildGround(scene);
buildPath(scene);
const zoneGroups = buildZones(scene);
buildSideQuestAreas(scene);
const particles = buildSkyParticles(scene);
buildCollectibles(scene);

// --- Player Character ---
const playerGroup = new THREE.Group();
const bodyMat = new THREE.MeshPhongMaterial({
  color: 0xfbbf24, emissive: 0x221100, flatShading: true, shininess: 30,
});
const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), bodyMat);
playerGroup.add(body);

const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1a2e });
const eyeGeo = new THREE.BoxGeometry(0.18, 0.2, 0.06);
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.18, 0.12, 0.46);
playerGroup.add(leftEye);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.18, 0.12, 0.46);
playerGroup.add(rightEye);

const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.06), eyeMat);
mouth.position.set(0, -0.1, 0.46);
playerGroup.add(mouth);

const blushMat = new THREE.MeshBasicMaterial({ color: 0xff8866, transparent: true, opacity: 0.4 });
[-0.3, 0.3].forEach((x) => {
  const blush = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.06), blushMat);
  blush.position.set(x, -0.02, 0.46);
  playerGroup.add(blush);
});

playerGroup.position.set(ZONES[0].position.x, 0.6, ZONES[0].position.z + 4);
scene.add(playerGroup);

// --- HUD ---
initHUD();
createLabels();

// --- Dialogue triggers ---
const dialogueShown = new Set();

function onZoneArrive(index) {
  const zone = ZONES[index];
  document.getElementById('hud-zone-name').textContent =
    `${zone.name} — ${zone.subtitle}`;
  document.querySelectorAll('.nav-zone').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });

  // Show/hide contact card for future zone
  const contactCard = document.getElementById('contact-card');
  if (zone.isContactZone) {
    setTimeout(() => contactCard.classList.remove('hidden'), 1200);
  } else {
    contactCard.classList.add('hidden');
  }

  // Auto-show dialogue on first visit
  if (!dialogueShown.has(index)) {
    dialogueShown.add(index);
    hideSideQuests();
    setTimeout(() => showDialogue(index, () => {
      // Show side quests after main dialogue ends
      updateSideQuests();
    }), 800);
  } else {
    // Already visited — show side quests immediately
    updateSideQuests();
  }
}

// --- Reset button ---
document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('contact-card').classList.add('hidden');
  dialogueShown.clear();
  navigateToZone(0, onZoneArrive);
});

// Show first zone dialogue on load
setTimeout(() => {
  dialogueShown.add(0);
  showDialogue(0);
}, 1000);

// --- Start music on first interaction ---
let musicStarted = false;
function ensureMusic() {
  if (!musicStarted) {
    musicStarted = true;
    startBgMusic();
  }
}

// --- Mute button ---
document.getElementById('mute-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  ensureMusic();
  const muted = toggleMute();
  document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
});

// --- Navigation Listeners ---
document.getElementById('nav-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  ensureMusic();
  if (isDialogueActive()) return;
  hideSideQuests();
  playTransitionSound();
  goPrev(onZoneArrive);
});

document.getElementById('nav-next').addEventListener('click', (e) => {
  e.stopPropagation();
  ensureMusic();
  if (isDialogueActive()) return;
  hideSideQuests();
  playTransitionSound();
  goNext(onZoneArrive);
});

document.querySelectorAll('.nav-zone').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    ensureMusic();
    if (isDialogueActive()) return;
    hideSideQuests();
    playTransitionSound();
    const idx = parseInt(btn.dataset.zone, 10);
    navigateToZone(idx, onZoneArrive);
  });
});

// --- Click handler (dialogue advance + collectibles) ---
document.getElementById('dialogue-box').addEventListener('click', (e) => {
  e.stopPropagation();
  advanceDialogue();
});

canvas.addEventListener('click', (event) => {
  // Try advancing dialogue first
  if (isDialogueActive()) {
    advanceDialogue();
    return;
  }

  ensureMusic();
  const result = handleCollectibleClick(event, camera, canvas);
  if (!result) return;

  playCollectSound();
  document.getElementById('hud-counter').textContent =
    `${result.collected} / ${result.total} discovered`;

  const tooltip = document.getElementById('tooltip');
  const tooltipText = document.getElementById('tooltip-text');
  tooltipText.textContent = result.label;
  tooltip.classList.remove('hidden');
  tooltip.style.left = `${result.screenPosition.x}px`;
  tooltip.style.top = `${result.screenPosition.y - 60}px`;
  setTimeout(() => tooltip.classList.add('hidden'), 4000);
});

// --- Keyboard ---
window.addEventListener('keydown', (event) => {
  if (event.key === ' ' || event.key === 'Enter') {
    if (isDialogueActive()) {
      advanceDialogue();
      return;
    }
  }
  if (isDialogueActive()) return;
  ensureMusic();

  if (event.key === 'ArrowRight' || event.key === 'd') {
    hideSideQuests();
    playTransitionSound();
    goNext(onZoneArrive);
  } else if (event.key === 'ArrowLeft' || event.key === 'a') {
    hideSideQuests();
    playTransitionSound();
    goPrev(onZoneArrive);
  }
});

// --- Resize ---
window.addEventListener('resize', () => {
  const a = window.innerWidth / window.innerHeight;
  camera.left = -frustum * a;
  camera.right = frustum * a;
  camera.top = frustum;
  camera.bottom = -frustum;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation Loop ---
function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);

  // Navigation + get distance for hop animation
  const moveDist = updateNavigation(camera, playerGroup);

  updateParticles(particles, time);
  updateCollectibles(time);
  updateLabels(camera);

  // Player animation
  if (moveDist > 0.3) {
    // Walking: bouncy hop
    const hopHeight = Math.abs(Math.sin(time * 0.012)) * 1.2;
    playerGroup.position.y = 0.6 + hopHeight;

    // Squash and stretch
    const squash = 1 + Math.sin(time * 0.012) * 0.15;
    body.scale.set(1 / squash, squash, 1 / squash);

    // Tilt forward slightly
    playerGroup.rotation.z = Math.sin(time * 0.008) * 0.1;
  } else {
    // Idle: gentle bob + breathing
    playerGroup.position.y = 0.6 + Math.sin(time * 0.002) * 0.12;
    const breathe = 1 + Math.sin(time * 0.003) * 0.03;
    body.scale.set(breathe, 1 / breathe, breathe);
    playerGroup.rotation.z = 0;
  }

  // Face camera direction (isometric)
  playerGroup.rotation.y = Math.PI / 4 + Math.sin(time * 0.0005) * 0.08;

  // Zone building animations
  zoneGroups.forEach((group) => {
    group.traverse((child) => {
      if (child.userData.blink) {
        child.visible = Math.sin(time * 0.006 + child.position.x) > 0;
      }
      if (child.userData.flicker) {
        child.scale.y = 0.7 + Math.random() * 0.6;
        child.scale.x = 0.85 + Math.random() * 0.3;
      }
      if (child.userData.wave) {
        child.rotation.z = Math.sin(time * 0.003) * 0.15;
      }
      if (child.userData.spin) {
        child.rotation.y += 0.01;
      }
      if (child.userData.codeLine) {
        child.position.x = child.userData.baseX + Math.sin(time * 0.002 + child.position.y * 3) * 0.3;
      }
    });
  });

  renderer.render(scene, camera);
}
animate();
