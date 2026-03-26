import * as THREE from 'three';
import { ZONES } from './data.js';

export function buildGround(scene) {
  ZONES.forEach((zone) => {
    // Main platform
    const groundGeo = new THREE.BoxGeometry(12, 1, 12);
    const groundMat = new THREE.MeshPhongMaterial({
      color: zone.colors.primary,
      flatShading: true,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(zone.position.x, -0.5, zone.position.z);
    scene.add(ground);

    // Darker base (gives depth)
    const baseMat = new THREE.MeshPhongMaterial({
      color: zone.colors.secondary,
      flatShading: true,
    });
    const base = new THREE.Mesh(new THREE.BoxGeometry(13, 0.6, 13), baseMat);
    base.position.set(zone.position.x, -1.3, zone.position.z);
    scene.add(base);

    // Corner pillars
    const pillarGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
    const pillarMat = new THREE.MeshPhongMaterial({ color: zone.colors.accent, flatShading: true });
    [[-5.5, -5.5], [5.5, -5.5], [-5.5, 5.5], [5.5, 5.5]].forEach(([ox, oz]) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(zone.position.x + ox, 0.2, zone.position.z + oz);
      scene.add(pillar);
    });

    // Scatter small decoration blocks
    const baseColor = new THREE.Color(zone.colors.primary);
    const tuffColor = new THREE.Color(
      Math.min(baseColor.r * 1.3, 1),
      Math.min(baseColor.g * 1.3, 1),
      Math.min(baseColor.b * 1.3, 1)
    );
    const tuffMat = new THREE.MeshPhongMaterial({
      color: tuffColor,
      flatShading: true,
    });
    for (let j = 0; j < 8; j++) {
      const tuft = new THREE.Mesh(
        new THREE.BoxGeometry(0.3 + Math.random() * 0.3, 0.2 + Math.random() * 0.3, 0.3 + Math.random() * 0.3),
        tuffMat
      );
      const angle = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 2;
      tuft.position.set(
        zone.position.x + Math.cos(angle) * r,
        0.1,
        zone.position.z + Math.sin(angle) * r
      );
      tuft.rotation.y = Math.random() * Math.PI;
      scene.add(tuft);
    }
  });
}

export function buildPath(scene) {
  for (let i = 0; i < ZONES.length - 1; i++) {
    const from = ZONES[i].position;
    const to = ZONES[i + 1].position;
    const dx = to.x - from.x;
    const dz = to.z - from.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dz, dx);

    // Path upgrade colors
    let pathColor;
    if (i === 0) pathColor = 0x8B6914;
    else if (i === 1) pathColor = 0x7a7a7a;
    else if (i === 2) pathColor = 0xa0a0a0;
    else pathColor = 0xfbbf24;

    const pathMat = new THREE.MeshPhongMaterial({ color: pathColor, flatShading: true });

    const steps = Math.floor(dist / 1.2);
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const x = from.x + dx * t;
      const z = from.z + dz * t;

      const w = s % 3 === 0 ? 0.8 : 1.0;
      const h = 0.25 + Math.random() * 0.1;
      const d = s % 2 === 0 ? 0.5 : 0.7;

      const block = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pathMat);
      block.position.set(x, 0, z);
      block.rotation.y = -angle + (Math.random() - 0.5) * 0.2;
      scene.add(block);
    }
  }
}

export function buildSkyParticles(scene) {
  const particles = [];
  const colors = [0xfbbf24, 0xa78bfa, 0x4ade80, 0x60a5fa, 0xf472b6, 0xffffff];

  for (let i = 0; i < 60; i++) {
    const size = 0.08 + Math.random() * 0.15;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: 0.3 + Math.random() * 0.4,
    });
    const particle = new THREE.Mesh(geo, mat);
    particle.position.set(
      Math.random() * 70 - 10,
      Math.random() * 20 + 2,
      Math.random() * 50 - 40
    );
    particle.userData.speed = 0.3 + Math.random() * 0.8;
    particle.userData.baseY = particle.position.y;
    particle.userData.rotSpeed = (Math.random() - 0.5) * 0.03;
    particle.userData.driftX = (Math.random() - 0.5) * 0.003;
    scene.add(particle);
    particles.push(particle);
  }

  return particles;
}

export function updateParticles(particles, time) {
  particles.forEach((p) => {
    p.position.y = p.userData.baseY + Math.sin(time * 0.001 * p.userData.speed) * 1.0;
    p.position.x += p.userData.driftX;
    p.rotation.x += p.userData.rotSpeed;
    p.rotation.y += p.userData.rotSpeed * 0.7;
    if (p.position.x > 65) p.position.x = -10;
    if (p.position.x < -15) p.position.x = 60;
  });
}
