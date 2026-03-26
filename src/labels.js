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
  ZONES.forEach((zone, i) => {
    const logo = LOGO_DATA[zone.id] || {};
    const el = document.createElement('div');
    el.className = 'zone-label';
    el.innerHTML = `
      <div class="zone-label-emoji">${logo.emoji || ''}</div>
      ${logo.text ? `<div class="zone-label-text" style="color:${logo.color}">${logo.text}</div>` : ''}
      <div class="zone-label-period">${zone.period || ''}</div>
    `;
    el.style.setProperty('--label-color', logo.color);
    container.appendChild(el);
    labelElements.push({ el, zoneIndex: i });
  });
}

export function updateLabels(camera) {
  const vec = new THREE.Vector3();

  labelElements.forEach(({ el, zoneIndex }) => {
    const zone = ZONES[zoneIndex];
    // Position label above the building
    vec.set(zone.position.x, 8, zone.position.z);
    vec.project(camera);

    const x = ((vec.x + 1) / 2) * window.innerWidth;
    const y = ((-vec.y + 1) / 2) * window.innerHeight;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    // Fade based on distance from center of screen
    const dx = x - window.innerWidth / 2;
    const dy = y - window.innerHeight / 2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    const opacity = Math.max(0, 1 - dist / maxDist);
    el.style.opacity = opacity;
  });
}
