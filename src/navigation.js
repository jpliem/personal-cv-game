import TWEEN from '@tweenjs/tween.js';
import { ZONES } from './data.js';

let currentZoneIndex = 0;
let isTransitioning = false;

export function getCurrentZoneIndex() {
  return currentZoneIndex;
}

export function navigateToZone(index, camera, playerGroup, onArrive) {
  if (index < 0 || index >= ZONES.length || isTransitioning) return;
  if (index === currentZoneIndex) return;

  isTransitioning = true;
  const target = ZONES[index].position;

  const camTarget = {
    x: target.x + 20,
    y: 20,
    z: target.z + 20,
  };

  const lookTarget = {
    x: target.x,
    y: 0,
    z: target.z,
  };

  new TWEEN.Tween(playerGroup.position)
    .to({ x: target.x, z: target.z + 4 }, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  new TWEEN.Tween(camera.position)
    .to(camTarget, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  const currentLook = {
    x: ZONES[currentZoneIndex].position.x,
    y: 0,
    z: ZONES[currentZoneIndex].position.z,
  };

  new TWEEN.Tween(currentLook)
    .to(lookTarget, 800)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      camera.lookAt(currentLook.x, currentLook.y, currentLook.z);
      camera.updateProjectionMatrix();
    })
    .onComplete(() => {
      currentZoneIndex = index;
      isTransitioning = false;
      if (onArrive) onArrive(index);
    })
    .start();
}

export function goNext(camera, playerGroup, onArrive) {
  navigateToZone(currentZoneIndex + 1, camera, playerGroup, onArrive);
}

export function goPrev(camera, playerGroup, onArrive) {
  navigateToZone(currentZoneIndex - 1, camera, playerGroup, onArrive);
}
