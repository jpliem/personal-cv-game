import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { ZONES, TOTAL_COLLECTIBLES } from './data.js';

const collectedSet = new Set();
const collectibleMeshes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function makeCollectibleShape(color) {
  const group = new THREE.Group();

  // Outer glow shell
  const glowMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.15,
  });
  const glow = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), glowMat);
  group.add(glow);

  // Core gem
  const coreMat = new THREE.MeshPhongMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.4,
    flatShading: true,
  });
  const core = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.9), coreMat);
  core.rotation.set(Math.PI / 4, Math.PI / 4, 0);
  group.add(core);

  // Inner bright spark
  const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
  const spark = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.25), sparkMat);
  spark.rotation.set(Math.PI / 4, 0, Math.PI / 4);
  group.add(spark);

  return group;
}

export function buildCollectibles(scene) {
  ZONES.forEach((zone) => {
    zone.collectibles.forEach((col, i) => {
      const angle = ((i + 0.5) / zone.collectibles.length) * Math.PI * 2;
      const radius = 4.5;
      const x = zone.position.x + Math.cos(angle) * radius;
      const z = zone.position.z + Math.sin(angle) * radius;

      const group = makeCollectibleShape(zone.colors.primary);
      group.position.set(x, 2.5, z);
      group.userData.collectibleId = col.id;
      group.userData.label = col.label;
      group.userData.baseY = 2.5;
      group.userData.phaseOffset = i * 1.5;
      group.userData.collected = false;

      scene.add(group);
      collectibleMeshes.push(group);
    });
  });

  return collectibleMeshes;
}

export function updateCollectibles(time) {
  collectibleMeshes.forEach((group) => {
    if (group.userData.collected) return;

    // Bob up and down
    group.position.y = group.userData.baseY + Math.sin(time * 0.002 + group.userData.phaseOffset) * 0.5;

    // Slow rotation
    group.rotation.y += 0.015;

    // Pulse the glow
    const glow = group.children[0];
    if (glow && glow.material) {
      glow.material.opacity = 0.1 + Math.sin(time * 0.003 + group.userData.phaseOffset) * 0.08;
    }

    // Rotate inner spark
    const spark = group.children[2];
    if (spark) {
      spark.rotation.y += 0.04;
    }
  });
}

export function handleCollectibleClick(event, camera, canvas) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // Check all children of all collectible groups
  const allChildren = collectibleMeshes
    .filter((m) => !m.userData.collected)
    .flatMap((m) => m.children);

  const intersects = raycaster.intersectObjects(allChildren, false);
  if (intersects.length === 0) return null;

  const hitGroup = intersects[0].object.parent;
  const id = hitGroup.userData.collectibleId;
  if (!id || collectedSet.has(id)) return null;

  // Mark collected
  collectedSet.add(id);
  hitGroup.userData.collected = true;

  // Celebration animation — pop up, spin, then shrink and settle
  new TWEEN.Tween(hitGroup.scale)
    .to({ x: 1.8, y: 1.8, z: 1.8 }, 200)
    .easing(TWEEN.Easing.Back.Out)
    .chain(
      new TWEEN.Tween(hitGroup.scale)
        .to({ x: 0.6, y: 0.6, z: 0.6 }, 400)
        .easing(TWEEN.Easing.Quadratic.Out)
    )
    .start();

  new TWEEN.Tween(hitGroup.position)
    .to({ y: hitGroup.position.y + 2 }, 200)
    .easing(TWEEN.Easing.Quadratic.Out)
    .chain(
      new TWEEN.Tween(hitGroup.position)
        .to({ y: hitGroup.userData.baseY }, 400)
        .easing(TWEEN.Easing.Bounce.Out)
    )
    .start();

  // Dim after collection
  setTimeout(() => {
    hitGroup.children.forEach((child) => {
      if (child.material) {
        if (child.material.transparent) {
          child.material.opacity = 0.05;
        } else {
          child.material.emissiveIntensity = 0;
          child.material.opacity = 0.4;
          child.material.transparent = true;
        }
      }
    });
  }, 700);

  return {
    id,
    label: hitGroup.userData.label,
    screenPosition: getScreenPosition(hitGroup, camera),
    collected: collectedSet.size,
    total: TOTAL_COLLECTIBLES,
  };
}

function getScreenPosition(object, camera) {
  const vector = new THREE.Vector3();
  object.getWorldPosition(vector);
  vector.project(camera);

  return {
    x: ((vector.x + 1) / 2) * window.innerWidth,
    y: ((-vector.y + 1) / 2) * window.innerHeight,
  };
}

export function getCollectedCount() {
  return collectedSet.size;
}
