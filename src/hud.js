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
    <div class="stats-section player-card-section">
      <div class="pc-avatar">JP</div>
      <div class="pc-info">
        <div class="pc-name">${PLAYER_CARD.name}</div>
        <div class="pc-title">${PLAYER_CARD.title}</div>
        ${PLAYER_CARD.subtitle ? `<div class="pc-subtitle">${PLAYER_CARD.subtitle}</div>` : ''}
        <div class="pc-location">${PLAYER_CARD.location}</div>
      </div>
      <div class="pc-links">
        <a href="mailto:${PLAYER_CARD.email}" class="pc-link">${PLAYER_CARD.email}</a>
        <a href="https://${PLAYER_CARD.linkedin}" target="_blank" class="pc-link">${PLAYER_CARD.linkedin}</a>
      </div>
    </div>
  `;
}

function buildSkills() {
  const container = document.getElementById('stats-skills');
  const groups = SKILLS.map((group) => {
    const colorHex = '#' + group.color.toString(16).padStart(6, '0');
    const bars = group.items
      .map((item) => {
        const pct = Math.round(item.level * 100);
        return `
      <div class="skill-row">
        <span class="skill-name">${item.name}</span>
        <div class="skill-track">
          <div class="skill-fill" style="width:${pct}%; background:${colorHex}"></div>
        </div>
        <span class="skill-pct" style="color:${colorHex}">${pct}</span>
      </div>
    `;
      })
      .join('');

    return `
      <div class="skill-category">
        <div class="skill-cat-header">
          <span class="skill-cat-dot" style="background:${colorHex}"></span>
          <span class="skill-cat-name">${group.group}</span>
        </div>
        ${bars}
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="stats-section">
      <h3>ATTRIBUTES</h3>
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
      <div class="badges-grid">${badges}</div>
    </div>
  `;
}

function initStatsToggle() {
  const toggle = document.getElementById('stats-toggle');
  const panel = document.getElementById('stats-panel');
  const closeBtn = document.getElementById('stats-close');

  toggle.addEventListener('click', () => {
    panel.classList.toggle('hidden');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.add('hidden');
  });
}
