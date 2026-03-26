import { ZONES } from './data.js';
import { showDialogue, isDialogueActive } from './dialogue.js';
import { getCurrentZoneIndex, isNavigating } from './navigation.js';
import { playTransitionSound } from './audio.js';

const container = document.getElementById('side-quests');

let sideQuestTarget = null;
let lastRenderedZone = -1;
let inSideQuest = false;

// Called every frame from animation loop
export function tickSideQuests() {
  const zoneIndex = getCurrentZoneIndex();
  const zone = ZONES[zoneIndex];
  const quests = zone.sideQuests || [];

  // Hide during dialogue, navigation, side quest visit, or if no quests
  if (quests.length === 0 || isDialogueActive() || isNavigating() || inSideQuest) {
    if (!container.classList.contains('hidden')) {
      container.classList.add('hidden');
    }
    return;
  }

  // Show buttons — only rebuild if zone changed
  if (lastRenderedZone !== zoneIndex) {
    lastRenderedZone = zoneIndex;
    buildButtons(zone, zoneIndex, quests);
  }

  if (container.classList.contains('hidden')) {
    container.classList.remove('hidden');
  }
}

function buildButtons(zone, zoneIndex, quests) {
  container.innerHTML = '';

  quests.forEach((quest, i) => {
    const btn = document.createElement('button');
    btn.className = 'side-quest-btn';
    btn.innerHTML = `<span class="sq-emoji">${quest.emoji}</span><span class="sq-name">${quest.name}</span>`;
    btn.style.animationDelay = `${i * 0.15}s`;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      playTransitionSound();
      inSideQuest = true;

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
          setTimeout(() => {
            inSideQuest = false;
            lastRenderedZone = -1; // force rebuild
          }, 600);
        });
      }, 600);
    });

    container.appendChild(btn);
  });
}

export function hideSideQuests() {
  container.classList.add('hidden');
  sideQuestTarget = null;
  inSideQuest = false;
  lastRenderedZone = -1;
}

export function getSideQuestCameraTarget() {
  return sideQuestTarget;
}
