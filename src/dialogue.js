import { ZONES } from './data.js';
import { playDialogueBlip } from './audio.js';

let currentDialogue = null;
let currentLineIndex = 0;
let isShowing = false;
let onDialogueComplete = null;
let typewriterInterval = null;

const box = document.getElementById('dialogue-box');
const speakerEl = document.getElementById('dialogue-speaker');
const textEl = document.getElementById('dialogue-text');
const hintEl = document.getElementById('dialogue-hint');

export function showDialogue(zoneIndex, onComplete) {
  const zone = ZONES[zoneIndex];
  if (!zone.dialogue || zone.dialogue.length === 0) {
    if (onComplete) onComplete();
    return;
  }

  currentDialogue = zone.dialogue;
  currentLineIndex = 0;
  onDialogueComplete = onComplete;
  isShowing = true;

  showLine();
}

function showLine() {
  if (!currentDialogue || currentLineIndex >= currentDialogue.length) {
    hideDialogue();
    return;
  }

  const line = currentDialogue[currentLineIndex];

  // Speaker name and styling
  if (line.speaker === 'narrator') {
    speakerEl.textContent = '';
    speakerEl.style.display = 'none';
    box.className = 'dialogue-narrator';
  } else {
    speakerEl.textContent = 'Jonathan';
    speakerEl.style.display = 'block';
    box.className = 'dialogue-character';
  }

  // Typewriter effect
  textEl.textContent = '';
  hintEl.style.opacity = '0';
  box.classList.remove('hidden');

  let charIndex = 0;
  const fullText = line.text;

  if (typewriterInterval) clearInterval(typewriterInterval);

  let blipCounter = 0;
  typewriterInterval = setInterval(() => {
    if (charIndex < fullText.length) {
      textEl.textContent += fullText[charIndex];
      // Play blip every 3 characters
      if (blipCounter % 3 === 0) playDialogueBlip();
      blipCounter++;
      charIndex++;
    } else {
      clearInterval(typewriterInterval);
      typewriterInterval = null;
      hintEl.style.opacity = '1';
    }
  }, 25);
}

export function advanceDialogue() {
  if (!isShowing) return false;

  // If still typing, complete the line instantly
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
    const line = currentDialogue[currentLineIndex];
    textEl.textContent = line.text;
    hintEl.style.opacity = '1';
    return true;
  }

  // Move to next line
  currentLineIndex++;
  if (currentLineIndex >= currentDialogue.length) {
    hideDialogue();
    return false;
  }

  showLine();
  return true;
}

function hideDialogue() {
  isShowing = false;
  box.classList.add('hidden');
  if (typewriterInterval) {
    clearInterval(typewriterInterval);
    typewriterInterval = null;
  }
  if (onDialogueComplete) {
    onDialogueComplete();
    onDialogueComplete = null;
  }
}

export function isDialogueActive() {
  return isShowing;
}
