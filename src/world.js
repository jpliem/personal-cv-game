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

export function buildSideQuestAreas(scene) {
  ZONES.forEach((zone) => {
    if (!zone.sideQuests || zone.sideQuests.length === 0) return;

    zone.sideQuests.forEach((sq) => {
      const wx = zone.position.x + sq.offset.x;
      const wz = zone.position.z + sq.offset.z;

      // Small platform
      const platMat = new THREE.MeshPhongMaterial({ color: sq.color, flatShading: true });
      const plat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.6, 5), platMat);
      plat.position.set(wx, -0.3, wz);
      scene.add(plat);

      // Platform border
      const borderMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(sq.color).multiplyScalar(0.7),
        flatShading: true,
      });
      const border = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.3, 5.6), borderMat);
      border.position.set(wx, -0.8, wz);
      scene.add(border);

      // Small marker block (icon stand)
      const markerMat = new THREE.MeshPhongMaterial({
        color: sq.color,
        emissive: sq.color,
        emissiveIntensity: 0.3,
        flatShading: true,
      });
      const marker = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), markerMat);
      marker.position.set(wx, 1, wz);
      scene.add(marker);

      const topBlock = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.3, 1.3), markerMat);
      topBlock.position.set(wx, 2.15, wz);
      scene.add(topBlock);

      // Connecting path from parent zone to side quest
      const fromX = zone.position.x;
      const fromZ = zone.position.z;
      const dx = wx - fromX;
      const dz = wz - fromZ;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dz, dx);
      const pathMat = new THREE.MeshPhongMaterial({ color: sq.color, flatShading: true, transparent: true, opacity: 0.6 });

      const steps = Math.floor(dist / 1.2);
      for (let s = 2; s < steps - 1; s++) {
        const t = s / steps;
        const px = fromX + dx * t;
        const pz = fromZ + dz * t;
        const block = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.4), pathMat);
        block.position.set(px, 0, pz);
        block.rotation.y = -angle;
        scene.add(block);
      }
    });
  });
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
