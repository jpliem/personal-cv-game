let ctx = null;
let bgGain = null;
let bgPlaying = false;
let muted = false;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

// --- Background music: calming ambient loop ---
// Uses layered oscillators with slow LFO modulation

let bgOscillators = [];

export function startBgMusic() {
  if (bgPlaying) return;
  const ac = getCtx();

  bgGain = ac.createGain();
  bgGain.gain.value = muted ? 0 : 0.08;
  bgGain.connect(ac.destination);

  // Chord: soft pad with slow detuning
  const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
  const types = ['sine', 'sine', 'triangle', 'sine'];

  notes.forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = types[i];
    osc.frequency.value = freq;

    // Slow vibrato
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.15 + i * 0.05;
    const lfoGain = ac.createGain();
    lfoGain.gain.value = 2 + i;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    // Per-voice gain (lower for higher notes)
    const voiceGain = ac.createGain();
    voiceGain.gain.value = 0.25 - i * 0.04;
    osc.connect(voiceGain);
    voiceGain.connect(bgGain);

    osc.start();
    bgOscillators.push({ osc, lfo, voiceGain, lfoGain });
  });

  // Add a slow evolving bass note
  const bassOsc = ac.createOscillator();
  bassOsc.type = 'sine';
  bassOsc.frequency.value = 130.81; // C3
  const bassGain = ac.createGain();
  bassGain.gain.value = 0.15;
  bassOsc.connect(bassGain);
  bassGain.connect(bgGain);

  const bassLfo = ac.createOscillator();
  bassLfo.frequency.value = 0.08;
  const bassLfoGain = ac.createGain();
  bassLfoGain.gain.value = 1.5;
  bassLfo.connect(bassLfoGain);
  bassLfoGain.connect(bassOsc.frequency);
  bassLfo.start();
  bassOsc.start();
  bgOscillators.push({ osc: bassOsc, lfo: bassLfo, voiceGain: bassGain, lfoGain: bassLfoGain });

  bgPlaying = true;

  // Chord progression: shift notes every 8 seconds
  scheduleChordChange(ac);
}

function scheduleChordChange(ac) {
  const progressions = [
    [261.63, 329.63, 392.0, 523.25],   // C major
    [220.0, 277.18, 329.63, 440.0],     // A minor
    [246.94, 311.13, 369.99, 493.88],   // B dim-ish (dreamy)
    [196.0, 246.94, 293.66, 392.0],     // G major
  ];

  let chordIdx = 0;

  setInterval(() => {
    chordIdx = (chordIdx + 1) % progressions.length;
    const chord = progressions[chordIdx];

    bgOscillators.forEach((voice, i) => {
      if (i < chord.length && voice.osc) {
        const ac2 = getCtx();
        voice.osc.frequency.setTargetAtTime(chord[i], ac2.currentTime, 2.0);
      }
    });
  }, 8000);
}

// --- Sound effects ---

export function playCollectSound() {
  if (muted) return;
  const ac = getCtx();
  const now = ac.currentTime;

  // Bright sparkle: quick ascending notes
  [800, 1000, 1200, 1600].forEach((freq, i) => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, now + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.2);

    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.3);
  });
}

export function playTransitionSound() {
  if (muted) return;
  const ac = getCtx();
  const now = ac.currentTime;

  // Whoosh: filtered noise sweep
  const osc = ac.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, now);
  osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.6);

  const filter = ac.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.linearRampToValueAtTime(2000, now + 0.3);
  filter.frequency.linearRampToValueAtTime(200, now + 0.6);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.7);
}

export function playDialogueBlip() {
  if (muted) return;
  const ac = getCtx();
  const now = ac.currentTime;

  const osc = ac.createOscillator();
  osc.type = 'square';
  osc.frequency.value = 600 + Math.random() * 200;

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.08);
}

// --- Mute toggle ---

export function toggleMute() {
  muted = !muted;
  if (bgGain) {
    bgGain.gain.setTargetAtTime(muted ? 0 : 0.08, getCtx().currentTime, 0.3);
  }
  return muted;
}

export function isMuted() {
  return muted;
}
