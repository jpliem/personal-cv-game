import { ZONES } from './data.js';
import { getSideQuestCameraTarget } from './sidequests.js';

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

// Called every frame
export function updateNavigation(camera, playerGroup) {
  const speed = 0.04;

  // Check for side quest camera override
  const sqTarget = getSideQuestCameraTarget();
  let activeCamX = cameraTarget.x;
  let activeCamZ = cameraTarget.z;
  let activeLookX = lookTarget.x;
  let activeLookZ = lookTarget.z;
  let activePlayerX = playerTarget.x;
  let activePlayerZ = playerTarget.z;

  if (sqTarget) {
    activeCamX = sqTarget.x + 20;
    activeCamZ = sqTarget.z + 20;
    activeLookX = sqTarget.x;
    activeLookZ = sqTarget.z;
    activePlayerX = sqTarget.x;
    activePlayerZ = sqTarget.z + 3;
  }

  // Calculate distance to target
  const dx = activePlayerX - playerGroup.position.x;
  const dz = activePlayerZ - playerGroup.position.z;
  const dist = Math.sqrt(dx * dx + dz * dz);

  // Lerp camera
  camera.position.x += (activeCamX - camera.position.x) * speed;
  camera.position.y += (cameraTarget.y - camera.position.y) * speed;
  camera.position.z += (activeCamZ - camera.position.z) * speed;

  // Lerp lookAt
  currentLook.x += (activeLookX - currentLook.x) * speed;
  currentLook.z += (activeLookZ - currentLook.z) * speed;
  camera.lookAt(currentLook.x, currentLook.y, currentLook.z);

  // Lerp player
  playerGroup.position.x += dx * speed;
  playerGroup.position.z += dz * speed;

  if (dist < 0.1 && isMoving) {
    isMoving = false;
  }

  return dist;
}
