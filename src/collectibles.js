import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { ZONES, TOTAL_COLLECTIBLES } from './data.js';

const collectedSet = new Set();
const collectibleMeshes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function makeCollectibleShape(icon, color) {
  const group = new THREE.Group();
  const mat = new THREE.MeshLambertMaterial({ color });
  const glowMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 });

  const core = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), mat);
  group.add(core);

  const glow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 0.6), glowMat);
  group.add(glow);

  const accent = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.2, 0.15),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  accent.position.y = 0.3;
  group.add(accent);

  return group;
}

export function buildCollectibles(scene) {
  ZONES.forEach((zone) => {
    zone.collectibles.forEach((col, i) => {
      const angle = (i / zone.collectibles.length) * Math.PI * 2;
      const radius = 3.5;
      const x = zone.position.x + Math.cos(angle) * radius;
      const z = zone.position.z + Math.sin(angle) * radius;

      const mesh = makeCollectibleShape(col.icon, zone.colors.primary);
      mesh.position.set(x, 2, z);
      mesh.userData.collectibleId = col.id;
      mesh.userData.label = col.label;
      mesh.userData.baseY = 2;
      mesh.userData.phaseOffset = i * 1.2;

      scene.add(mesh);
      collectibleMeshes.push(mesh);
    });
  });

  return collectibleMeshes;
}

export function updateCollectibles(time) {
  collectibleMeshes.forEach((mesh) => {
    if (collectedSet.has(mesh.userData.collectibleId)) return;
    mesh.position.y =
      mesh.userData.baseY + Math.sin(time * 0.003 + mesh.userData.phaseOffset) * 0.3;
    mesh.rotation.y += 0.02;
  });
}

export function handleCollectibleClick(event, camera, scene) {
  const rect = event.target.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    collectibleMeshes.flatMap((m) => m.children),
    false
  );

  if (intersects.length === 0) return null;

  const hitGroup = intersects[0].object.parent;
  const id = hitGroup.userData.collectibleId;

  if (!id || collectedSet.has(id)) return null;

  collectedSet.add(id);

  new TWEEN.Tween(hitGroup.scale)
    .to({ x: 1.5, y: 1.5, z: 1.5 }, 150)
    .easing(TWEEN.Easing.Back.Out)
    .chain(
      new TWEEN.Tween(hitGroup.scale)
        .to({ x: 0.8, y: 0.8, z: 0.8 }, 200)
        .easing(TWEEN.Easing.Quadratic.Out)
    )
    .start();

  hitGroup.children.forEach((child) => {
    if (child.material && child.material.transparent) {
      child.material.opacity = 0.1;
    }
  });

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
