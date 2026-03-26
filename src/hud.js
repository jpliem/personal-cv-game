import { PLAYER_CARD, SKILLS, CERTIFICATIONS } from './data.js';

export function initHUD() {
  buildPlayerCard();
  buildSkills();
  buildBadges();
  initStatsToggle();
}

function buildPlayerCard() {
  const container = document.getElementById('stats-player-card');
  container.innerHTML = `
    <div class="stats-section">
      <h3>PLAYER CARD</h3>
      <div class="player-info">
        <div>${PLAYER_CARD.name}</div>
        <div>${PLAYER_CARD.title}</div>
        <div>${PLAYER_CARD.location}</div>
        <div><a href="mailto:${PLAYER_CARD.email}">${PLAYER_CARD.email}</a></div>
        <div><a href="https://${PLAYER_CARD.linkedin}" target="_blank">${PLAYER_CARD.linkedin}</a></div>
      </div>
    </div>
  `;
}

function buildSkills() {
  const container = document.getElementById('stats-skills');
  const groups = SKILLS.map((group) => {
    const colorHex = '#' + group.color.toString(16).padStart(6, '0');
    const bars = group.items
      .map(
        (item) => `
      <div class="skill-bar">
        <span class="skill-bar-name">${item.name}</span>
        <div class="skill-bar-fill">
          <div class="skill-bar-fill-inner" style="width:${item.level * 100}%; background:${colorHex}"></div>
        </div>
      </div>
    `
      )
      .join('');

    return `
      <div class="skill-group">
        <div class="skill-group-name">${group.group}</div>
        ${bars}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="stats-section">
      <h3>SKILLS</h3>
      ${groups}
    </div>
  `;
}

function buildBadges() {
  const container = document.getElementById('stats-badges');
  const badges = CERTIFICATIONS.map(
    (cert) => `<span class="badge">${cert}</span>`
  ).join('');

  container.innerHTML = `
    <div class="stats-section">
      <h3>BADGES</h3>
      ${badges}
    </div>
  `;
}

function initStatsToggle() {
  const toggle = document.getElementById('stats-toggle');
  const panel = document.getElementById('stats-panel');

  toggle.addEventListener('click', () => {
    panel.classList.toggle('hidden');
  });
}
