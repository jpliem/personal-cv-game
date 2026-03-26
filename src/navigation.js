import { ZONES } from './data.js';

let currentZoneIndex = 0;
let targetZoneIndex = 0;
let isMoving = false;

// Targets for smooth lerp
const cameraTarget = { x: 0, y: 20, z: 0 };
const lookTarget = { x: 0, y: 0, z: 0 };
const playerTarget = { x: 0, z: 0 };
const currentLook = { x: 0, y: 0, z: 0 };

function setTargets(index) {
  const pos = ZONES[index].position;
  cameraTarget.x = pos.x + 20;
  cameraTarget.y = 20;
  cameraTarget.z = pos.z + 20;
  lookTarget.x = pos.x;
  lookTarget.z = pos.z;
  playerTarget.x = pos.x;
  playerTarget.z = pos.z + 4;
}

// Initialize to zone 0
setTargets(0);
currentLook.x = ZONES[0].position.x;
currentLook.z = ZONES[0].position.z;

export function getCurrentZoneIndex() {
  return currentZoneIndex;
}

export function isNavigating() {
  return isMoving;
}

export function navigateToZone(index, onArrive) {
  if (index < 0 || index >= ZONES.length) return;
  if (index === targetZoneIndex) return;
  targetZoneIndex = index;
  currentZoneIndex = index;
  isMoving = true;
  setTargets(index);
  if (onArrive) onArrive(index);
}

export function goNext(onArrive) {
  navigateToZone(currentZoneIndex + 1, onArrive);
}

export function goPrev(onArrive) {
  navigateToZone(currentZoneIndex - 1, onArrive);
}

// Called every frame — returns hop height for player Y
export function updateNavigation(camera, playerGroup) {
  const speed = 0.04;

  // Calculate distance to target
  const dx = playerTarget.x - playerGroup.position.x;
  const dz = playerTarget.z - playerGroup.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  // Lerp camera
  camera.position.x += (cameraTarget.x - camera.position.x) * speed;
  camera.position.y += (cameraTarget.y - camera.position.y) * speed;
  camera.position.z += (cameraTarget.z - camera.position.z) * speed;

  // Lerp lookAt
  currentLook.x += (lookTarget.x - currentLook.x) * speed;
  currentLook.z += (lookTarget.z - currentLook.z) * speed;
  camera.lookAt(currentLook.x, currentLook.y, currentLook.z);

  // Lerp player X/Z
  playerGroup.position.x += dx * speed;
  playerGroup.position.z += dz * speed;

  // Check if arrived
  if (dist < 0.1 && isMoving) {
    isMoving = false;
  }

  // Return movement distance for hop animation
  return dist;
}
