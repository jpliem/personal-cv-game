import * as THREE from 'three';
import { ZONES } from './data.js';

const labelElements = [];
const container = document.getElementById('zone-labels');

const LOGO_DATA = {
  childhood: { emoji: '🧒', color: '#fca5a5' },
  binus: { text: 'BINUS', emoji: '🎓', color: '#4ade80' },
  bca: { text: 'BCA', emoji: '🏦', color: '#60a5fa' },
  ey: { text: 'EY', emoji: '🧭', color: '#fbbf24' },
  blibli: { text: 'Blibli', emoji: '🛡️', color: '#a78bfa' },
  gspe: { text: 'GSPE', emoji: '🚀', color: '#f472b6' },
  future: { emoji: '✨', color: '#38bdf8' },
};

export function createLabels() {
  // Main zone labels
  ZONES.forEach((zone, i) => {
    const logo = LOGO_DATA[zone.id] || {};
    const el = document.createElement('div');
    el.className = 'zone-label';
    el.innerHTML = `
      <div class="zone-label-emoji">${logo.emoji || ''}</div>
      ${logo.text ? `<div class="zone-label-text" style="--label-color:${logo.color}; border-color:${logo.color}">${logo.text}</div>` : ''}
      ${zone.period ? `<div class="zone-label-period">${zone.period}</div>` : ''}
    `;
    container.appendChild(el);
    labelElements.push({ el, worldX: zone.position.x, worldZ: zone.position.z, height: 9 });
  });

  // Side quest labels (smaller)
  ZONES.forEach((zone) => {
    if (!zone.sideQuests) return;
    zone.sideQuests.forEach((sq) => {
      const el = document.createElement('div');
      el.className = 'zone-label sq-label';
      el.innerHTML = `
        <div class="zone-label-emoji" style="font-size:22px">${sq.emoji}</div>
        <div class="sq-label-name">${sq.name}</div>
      `;
      container.appendChild(el);
      labelElements.push({
        el,
        worldX: zone.position.x + sq.offset.x,
        worldZ: zone.position.z + sq.offset.z,
        height: 4,
      });
    });
  });
}

export function updateLabels(camera) {
  const vec = new THREE.Vector3();

  labelElements.forEach(({ el, worldX, worldZ, height }) => {
    vec.set(worldX, height, worldZ);
    vec.project(camera);

    const x = ((vec.x + 1) / 2) * window.innerWidth;
    const y = ((-vec.y + 1) / 2) * window.innerHeight;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // Fade based on distance from screen center
    const dx = x - window.innerWidth / 2;
    const dy = y - window.innerHeight / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    const opacity = Math.max(0, 1 - dist / maxDist);
    el.style.opacity = opacity;
  });
}
