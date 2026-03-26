import { ZONES } from './data.js';
import { showDialogue, isDialogueActive } from './dialogue.js';
import { getCurrentZoneIndex } from './navigation.js';
import { playTransitionSound } from './audio.js';

const container = document.getElementById('side-quests');

// Camera target override for side quest visits
let sideQuestTarget = null;
let returningToParent = false;

export function updateSideQuests() {
  const zoneIndex = getCurrentZoneIndex();
  const zone = ZONES[zoneIndex];
  const quests = zone.sideQuests || [];

  container.innerHTML = '';

  if (quests.length === 0 || isDialogueActive()) {
    container.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');

  quests.forEach((quest, i) => {
    const btn = document.createElement('button');
    btn.className = 'side-quest-btn';
    btn.innerHTML = `<span class="sq-emoji">${quest.emoji}</span><span class="sq-name">${quest.name}</span>`;
    btn.style.animationDelay = `${i * 0.15}s`;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playTransitionSound();

      // Pan camera to the side quest area
      const wx = zone.position.x + quest.offset.x;
      const wz = zone.position.z + quest.offset.z;
      sideQuestTarget = { x: wx, z: wz };

      container.classList.add('hidden');

      // After camera arrives, play dialogue
      setTimeout(() => {
        const originalDialogue = ZONES[zoneIndex].dialogue;
        ZONES[zoneIndex].dialogue = quest.dialogue;
        showDialogue(zoneIndex, () => {
          ZONES[zoneIndex].dialogue = originalDialogue;
          // Return camera to parent zone
          sideQuestTarget = null;
          returningToParent = true;
          setTimeout(() => {
            returningToParent = false;
            updateSideQuests();
          }, 800);
        });
      }, 600);
    });

    container.appendChild(btn);
  });
}

export function hideSideQuests() {
  container.classList.add('hidden');
  sideQuestTarget = null;
}

// Called from animation loop to override camera target
export function getSideQuestCameraTarget() {
  return sideQuestTarget;
}
