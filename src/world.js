import * as THREE from 'three';
import { ZONES } from './data.js';

export function buildGround(scene) {
  ZONES.forEach((zone) => {
    const groundGeo = new THREE.BoxGeometry(10, 0.5, 10);
    const groundMat = new THREE.MeshLambertMaterial({ color: zone.colors.primary });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(zone.position.x, -0.25, zone.position.z);
    scene.add(ground);

    // Darker border ring
    const borderGeo = new THREE.BoxGeometry(11, 0.3, 11);
    const borderMat = new THREE.MeshLambertMaterial({ color: zone.colors.secondary });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.set(zone.position.x, -0.4, zone.position.z);
    scene.add(border);
  });
}

export function buildPath(scene) {
  const pathMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });

  for (let i = 0; i < ZONES.length - 1; i++) {
    const from = ZONES[i].position;
    const to = ZONES[i + 1].position;
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);

    const steps = Math.floor(dist / 1.5);
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const x = from.x + dx * t;
      const z = from.z + dz * t;

      if (s % 2 === 0) {
        const blockGeo = new THREE.BoxGeometry(1, 0.2, 0.6);
        const block = new THREE.Mesh(blockGeo, pathMat);
        block.position.set(x, 0.1, z);
        block.rotation.y = -angle;

        // Path upgrade: dirt(brown) → stone(gray) → glow(gold)
        if (i <= 1) {
          block.material = new THREE.MeshLambertMaterial({ color: 0xa3824a });
        } else if (i === 2) {
          block.material = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
        } else {
          block.material = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });
        }

        scene.add(block);
      }
    }
  }
}

export function buildSkyParticles(scene) {
  const particles = [];
  const colors = [0xfbbf24, 0xa78bfa, 0x4ade80, 0x60a5fa, 0xf472b6];

  for (let i = 0; i < 40; i++) {
    const geo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.5,
    });
    const particle = new THREE.Mesh(geo, mat);
    particle.position.set(
      Math.random() * 60 - 5,
      Math.random() * 15 + 3,
      Math.random() * 40 - 35
    );
    particle.userData.speed = 0.002 + Math.random() * 0.005;
    particle.userData.baseY = particle.position.y;
    scene.add(particle);
    particles.push(particle);
  }

  return particles;
}

export function updateParticles(particles, time) {
  particles.forEach((p) => {
    p.position.y = p.userData.baseY + Math.sin(time * p.userData.speed * 200) * 0.5;
    p.rotation.y += 0.01;
  });
}
