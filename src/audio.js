let ctx = null;
let bgGain = null;
let bgPlaying = false;
let muted = false;
let melodyTimeout = null;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

// --- Background music: cheerful music-box melody ---
// Simple repeating melody with a warm tone

// Note frequencies
const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23;
const G4 = 392.0, A4 = 440.0, B4 = 493.88, C5 = 523.25;
const D5 = 587.33, E5 = 659.25, G3 = 196.0, C3 = 130.81;
const F3 = 174.61, A3 = 220.0;

// Melody: happy, bouncy, Stardew Valley-ish
const melody = [
  // Phrase 1
  E4, G4, A4, G4, E4, D4, C4, D4,
  E4, G4, A4, B4, C5, B4, A4, G4,
  // Phrase 2
  A4, C5, D5, C5, A4, G4, E4, G4,
  A4, G4, E4, D4, C4, E4, D4, C4,
  // Phrase 3 (higher, cheerful)
  C5, D5, E5, D5, C5, A4, G4, A4,
  C5, B4, A4, G4, E4, G4, A4, G4,
  // Phrase 4 (resolution)
  E4, G4, C5, B4, A4, G4, A4, G4,
  E4, D4, E4, G4, E4, D4, C4, 0,
];

// Bass pattern (root notes, longer)
const bassPattern = [
  C3, C3, G3, G3, A3, A3, F3, F3,
  C3, C3, G3, G3, F3, F3, C3, C3,
];

const NOTE_DURATION = 0.22; // seconds per note
const MELODY_VOLUME = 0.10;
const BASS_VOLUME = 0.04;

function playNote(ac, freq, startTime, duration, volume, type = 'sine') {
  if (freq === 0) return; // rest

  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
  gain.gain.setValueAtTime(volume, startTime + duration * 0.6);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(bgGain);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

function scheduleMelody() {
  const ac = getCtx();
  const now = ac.currentTime + 0.1;

  // Schedule all melody notes
  melody.forEach((freq, i) => {
    const t = now + i * NOTE_DURATION;
    playNote(ac, freq, t, NOTE_DURATION * 0.9, MELODY_VOLUME, 'triangle');
  });

  // Schedule bass notes (each bass note = 4 melody notes)
  bassPattern.forEach((freq, i) => {
    const t = now + i * NOTE_DURATION * 4;
    playNote(ac, freq, t, NOTE_DURATION * 3.8, BASS_VOLUME, 'sine');
  });

  // Loop after the melody finishes
  const totalDuration = melody.length * NOTE_DURATION * 1000;
  melodyTimeout = setTimeout(() => {
    if (bgPlaying && !muted) {
      scheduleMelody();
    }
  }, totalDuration);
}

export function startBgMusic() {
  if (bgPlaying) return;
  const ac = getCtx();

  bgGain = ac.createGain();
  bgGain.gain.value = muted ? 0 : 1.0;
  bgGain.connect(ac.destination);

  bgPlaying = true;
  scheduleMelody();
}

// --- Sound effects ---

export function playCollectSound() {
  if (muted) return;
  const ac = getCtx();
  const now = ac.currentTime;

  // Happy ascending sparkle
  [C5, E5, G4 * 2, C5 * 2].forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, now + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.1, now + i * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.25);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.3);
  });
}

export function playTransitionSound() {
  if (muted) return;
  const ac = getCtx();
  const now = ac.currentTime;

  // Gentle whoosh with rising pitch
  const osc = ac.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

export function playDialogueBlip() {
  if (muted) return;
  const ac = getCtx();
  const now = ac.currentTime;

  // Soft pluck sound
  const osc = ac.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = 800 + Math.random() * 400;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.07);
}

// --- Mute toggle ---

export function toggleMute() {
  muted = !muted;
  if (bgGain) {
    bgGain.gain.setTargetAtTime(muted ? 0 : 1.0, getCtx().currentTime, 0.3);
  }
  if (!muted && bgPlaying) {
    // Restart melody scheduling if it stopped
    if (melodyTimeout) clearTimeout(melodyTimeout);
    scheduleMelody();
  }
  return muted;
}

export function isMuted() {
  return muted;
}
