import * as THREE from 'three';
import { ZONES } from './data.js';

function mat(color, emissive = 0x000000) {
  return new THREE.MeshPhongMaterial({ color, emissive, flatShading: true });
}

function box(w, h, d) {
  return new THREE.BoxGeometry(w, h, d);
}

function mesh(geo, color, emissive) {
  return new THREE.Mesh(geo, mat(color, emissive));
}

function buildBinus(group, colors) {
  // Tiered university — 3 stacked blocks with slight offsets
  const base = mesh(box(5, 2.5, 4), colors.primary);
  base.position.y = 1.25;
  group.add(base);

  const mid = mesh(box(4, 2, 3.5), colors.secondary);
  mid.position.set(0.3, 3.5, -0.2);
  group.add(mid);

  const top = mesh(box(2.5, 1.5, 2.5), colors.accent);
  top.position.set(0, 5.25, 0);
  group.add(top);

  // Clock face on front
  const clock = mesh(box(0.8, 0.8, 0.1), 0xfef3c7);
  clock.position.set(0, 5.2, 1.3);
  group.add(clock);
  const hand = mesh(box(0.05, 0.3, 0.05), 0x1e293b);
  hand.position.set(0, 5.3, 1.38);
  hand.userData.spin = true;
  group.add(hand);

  // Flag pole + flag
  const pole = mesh(box(0.12, 2.5, 0.12), 0xd4d4d8);
  pole.position.set(0, 7, 0);
  group.add(pole);
  const flag = mesh(box(1.2, 0.7, 0.08), 0xfbbf24, 0x332200);
  flag.position.set(0.65, 7.8, 0);
  flag.userData.wave = true;
  group.add(flag);

  // Trees with rounder canopy (stacked cubes)
  [-4, 4].forEach((xOff) => {
    const trunk = mesh(box(0.4, 1.5, 0.4), 0x8B6914);
    trunk.position.set(xOff, 0.75, 3);
    group.add(trunk);

    // Layered canopy
    [0, 0.6, 1.2].forEach((yOff, idx) => {
      const size = 1.6 - idx * 0.4;
      const leaf = mesh(box(size, 0.6, size), 0x22c55e);
      leaf.position.set(xOff, 1.8 + yOff, 3);
      leaf.rotation.y = idx * 0.3;
      group.add(leaf);
    });
  });

  // Stacked books (colorful)
  const bookColors = [0xef4444, 0x3b82f6, 0xfbbf24, 0x8b5cf6, 0x22c55e];
  [{ x: -2.5, z: -2.5 }, { x: 3, z: -2 }, { x: -1, z: 3.5 }].forEach((pos) => {
    for (let b = 0; b < 3; b++) {
      const book = mesh(box(0.9, 0.2, 0.7), bookColors[(b + pos.x) % bookColors.length | 0]);
      book.position.set(pos.x + (Math.random() - 0.5) * 0.2, 0.1 + b * 0.22, pos.z);
      book.rotation.y = Math.random() * 0.3;
      group.add(book);
    }
  });

  // Bench
  const benchSeat = mesh(box(2, 0.2, 0.6), 0x8B6914);
  benchSeat.position.set(0, 0.6, 4.5);
  group.add(benchSeat);
  [-0.8, 0.8].forEach((x) => {
    const leg = mesh(box(0.15, 0.5, 0.15), 0x6b4f12);
    leg.position.set(x, 0.25, 4.5);
    group.add(leg);
  });
}

function buildBCA(group, colors) {
  // Giant monitor
  const frame = mesh(box(5, 3.5, 0.6), 0x334155);
  frame.position.set(0, 2, 0);
  group.add(frame);

  // Screen with glow
  const screen = mesh(box(4.2, 2.8, 0.1), 0x0a0f1a, 0x0a1628);
  screen.position.set(0, 2.1, 0.36);
  group.add(screen);

  // Animated code lines
  const lineColors = [0x4ade80, 0x60a5fa, 0xfbbf24, 0xf472b6, 0x4ade80, 0x94a3b8];
  lineColors.forEach((c, i) => {
    const w = 1.0 + Math.random() * 1.5;
    const line = mesh(box(w, 0.12, 0.04), c, c);
    line.position.set(-0.5 + (i % 2) * 0.5, 3.0 - i * 0.35, 0.43);
    line.userData.codeLine = true;
    line.userData.baseX = line.position.x;
    group.add(line);
  });

  // Monitor stand
  const neck = mesh(box(0.6, 1.2, 0.6), 0x475569);
  neck.position.set(0, -0.3, 0);
  group.add(neck);
  const base = mesh(box(2.5, 0.25, 1.5), 0x475569);
  base.position.set(0, -0.8, 0);
  group.add(base);

  // Antenna with blinking light
  const antenna = mesh(box(0.12, 2, 0.12), 0xd4d4d8);
  antenna.position.set(2.2, 4.5, 0);
  group.add(antenna);
  const blink = mesh(box(0.35, 0.35, 0.35), 0xf472b6, 0xf472b6);
  blink.position.set(2.2, 5.7, 0);
  blink.userData.blink = true;
  group.add(blink);

  // Server racks with blinking LEDs
  [-3, 3].forEach((x) => {
    const rack = mesh(box(1, 2.5, 0.8), 0x1e293b);
    rack.position.set(x, 1.25, -2);
    group.add(rack);

    // LED rows
    for (let i = 0; i < 4; i++) {
      const led = mesh(box(0.12, 0.08, 0.05), i % 2 === 0 ? 0x4ade80 : 0x60a5fa, 0x4ade80);
      led.position.set(x - 0.25, 0.4 + i * 0.5, -1.57);
      led.userData.blink = true;
      group.add(led);
    }
  });

  // Keyboard
  const keyboard = mesh(box(2, 0.12, 0.6), 0x334155);
  keyboard.position.set(0, 0.06, 2);
  group.add(keyboard);
  // Keys
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 6; c++) {
      const key = mesh(box(0.22, 0.06, 0.18), 0x1e293b);
      key.position.set(-0.65 + c * 0.28, 0.15, 1.8 + r * 0.25);
      group.add(key);
    }
  }
}

function buildEY(group, colors) {
  // Main tent — A-frame
  const tentLeft = mesh(box(0.25, 4, 4), colors.primary);
  tentLeft.position.set(-2, 2, 0);
  tentLeft.rotation.z = 0.35;
  group.add(tentLeft);

  const tentRight = mesh(box(0.25, 4, 4), colors.primary);
  tentRight.position.set(2, 2, 0);
  tentRight.rotation.z = -0.35;
  group.add(tentRight);

  const ridge = mesh(box(0.5, 0.4, 4.5), colors.accent, 0x221100);
  ridge.position.set(0, 3.8, 0);
  group.add(ridge);

  // Tent floor
  const floor = mesh(box(5, 0.2, 4), 0x8B6914);
  floor.position.y = 0.1;
  group.add(floor);

  // Entrance opening (dark)
  const entrance = mesh(box(1.5, 2, 0.1), 0x1a1a2e);
  entrance.position.set(0, 1.2, 2.05);
  group.add(entrance);

  // Flag on ridge
  const flagPole = mesh(box(0.1, 2.5, 0.1), 0xef4444);
  flagPole.position.set(0, 5, 0);
  group.add(flagPole);
  const flag = mesh(box(1.3, 0.8, 0.08), 0xef4444, 0x330000);
  flag.position.set(0.7, 5.8, 0);
  flag.userData.wave = true;
  group.add(flag);

  // Compass rose on ground (bigger, more detailed)
  const compass = mesh(box(2, 0.08, 2), colors.secondary);
  compass.position.set(4, 0.04, 3);
  group.add(compass);
  const needle = mesh(box(0.12, 0.35, 1.2), 0xef4444);
  needle.position.set(4, 0.25, 3);
  needle.userData.spin = true;
  group.add(needle);
  const compassCenter = mesh(box(0.3, 0.15, 0.3), 0xfef3c7);
  compassCenter.position.set(4, 0.15, 3);
  group.add(compassCenter);

  // Quest board with papers
  const boardPole = mesh(box(0.2, 2.5, 0.2), 0x8B6914);
  boardPole.position.set(-4, 1.25, 1);
  group.add(boardPole);
  const board = mesh(box(2, 1.5, 0.2), 0x8B6914);
  board.position.set(-4, 2.8, 1);
  group.add(board);
  // Colorful quest papers
  [0xfef3c7, 0xdbeafe, 0xfce7f3, 0xd1fae5].forEach((c, i) => {
    const note = mesh(box(0.5, 0.6, 0.06), c);
    note.position.set(-4.3 + (i % 2) * 0.6, 2.6 + Math.floor(i / 2) * 0.6, 1.14);
    group.add(note);
  });

  // Campfire
  const logs = mesh(box(1, 0.3, 0.3), 0x6b4f12);
  logs.position.set(3, 0.15, -2);
  logs.rotation.y = 0.4;
  group.add(logs);
  const logs2 = mesh(box(1, 0.3, 0.3), 0x5a3e0e);
  logs2.position.set(3, 0.15, -2);
  logs2.rotation.y = -0.4;
  group.add(logs2);
  // Fire
  const fire1 = mesh(box(0.4, 0.6, 0.4), 0xff6b00, 0xff6b00);
  fire1.position.set(3, 0.6, -2);
  fire1.userData.flicker = true;
  group.add(fire1);
  const fire2 = mesh(box(0.25, 0.4, 0.25), 0xfbbf24, 0xfbbf24);
  fire2.position.set(3, 0.9, -2);
  fire2.userData.flicker = true;
  group.add(fire2);
}

function buildBlibli(group, colors) {
  // Castle main body
  const body = mesh(box(6, 3, 5), colors.primary);
  body.position.y = 1.5;
  group.add(body);

  // Battlements (crenellations)
  for (let i = -2.5; i <= 2.5; i += 1.25) {
    const merlon = mesh(box(0.7, 1, 0.7), colors.secondary);
    merlon.position.set(i, 3.5, 2.5);
    group.add(merlon);
    const merlonBack = mesh(box(0.7, 1, 0.7), colors.secondary);
    merlonBack.position.set(i, 3.5, -2.5);
    group.add(merlonBack);
  }

  // Main gate
  const gate = mesh(box(1.8, 2.2, 0.2), 0x1e293b);
  gate.position.set(0, 1.1, 2.55);
  group.add(gate);
  const gateArch = mesh(box(2, 0.4, 0.25), colors.accent, 0x1a0030);
  gateArch.position.set(0, 2.3, 2.55);
  group.add(gateArch);

  // Shield emblem above gate
  const shield = mesh(box(1.2, 1.4, 0.2), colors.accent, 0x2a0050);
  shield.position.set(0, 2, 2.65);
  group.add(shield);
  const shieldMark = mesh(box(0.3, 0.5, 0.1), 0xfbbf24, 0xfbbf24);
  shieldMark.position.set(0, 2.1, 2.8);
  group.add(shieldMark);

  // Watchtower (taller, with lookout)
  const tower = mesh(box(1.5, 5.5, 1.5), colors.secondary);
  tower.position.set(3, 2.75, -2);
  group.add(tower);
  const lookout = mesh(box(2, 0.3, 2), colors.accent, 0x1a0030);
  lookout.position.set(3, 5.65, -2);
  group.add(lookout);
  // Tower window
  const window1 = mesh(box(0.3, 0.5, 0.1), 0xfbbf24, 0xfbbf24);
  window1.position.set(3, 4, -1.2);
  group.add(window1);

  // Torches with animated flames
  [-3.5, 3.5].forEach((x) => {
    const torchPole = mesh(box(0.15, 2, 0.15), 0x8B6914);
    torchPole.position.set(x, 1, 3);
    group.add(torchPole);
    const flame1 = mesh(box(0.35, 0.5, 0.35), 0xff6b00, 0xff6b00);
    flame1.position.set(x, 2.3, 3);
    flame1.userData.flicker = true;
    group.add(flame1);
    const flame2 = mesh(box(0.2, 0.35, 0.2), 0xfbbf24, 0xfbbf24);
    flame2.position.set(x, 2.6, 3);
    flame2.userData.flicker = true;
    group.add(flame2);
  });

  // Stone walls flanking
  [-4, 4].forEach((x) => {
    const wall = mesh(box(0.8, 1.5, 3), 0x6b6b6b);
    wall.position.set(x, 0.75, 0);
    group.add(wall);
  });
}

function buildGSPE(group, colors) {
  // Main tower — tallest structure
  const tower = mesh(box(3.5, 6, 3.5), colors.primary);
  tower.position.y = 3;
  group.add(tower);

  // Upper command deck
  const deck = mesh(box(4, 1.5, 4), colors.secondary);
  deck.position.y = 7;
  group.add(deck);

  // Antenna array
  const mast = mesh(box(0.15, 2.5, 0.15), 0xd4d4d8);
  mast.position.set(0, 9, 0);
  group.add(mast);

  // Satellite dish
  const dish = mesh(box(2.5, 0.15, 2.5), colors.accent);
  dish.position.set(0, 10, 0);
  dish.rotation.x = 0.3;
  dish.userData.spin = true;
  group.add(dish);
  const dishTip = mesh(box(0.2, 1, 0.2), 0xfbbf24, 0xfbbf24);
  dishTip.position.set(0, 10.6, -0.3);
  group.add(dishTip);

  // Windows (glowing)
  for (let floor = 0; floor < 3; floor++) {
    [-1, 0, 1].forEach((x) => {
      const win = mesh(box(0.5, 0.4, 0.08), 0x60a5fa, 0x1a3a5c);
      win.position.set(x, 1.5 + floor * 1.8, 1.8);
      group.add(win);
    });
  }

  // Dual monitor screens at base
  [{ x: -3, z: 1 }, { x: 3, z: 1 }].forEach((pos, idx) => {
    const screenFrame = mesh(box(1.8, 1.4, 0.3), 0x334155);
    screenFrame.position.set(pos.x, 1.2, pos.z);
    group.add(screenFrame);
    const face = mesh(box(1.4, 1, 0.06), 0x0a0f1a, 0x0a1628);
    face.position.set(pos.x, 1.25, pos.z + 0.19);
    group.add(face);
    // Screen content
    const scanColor = idx === 0 ? 0x4ade80 : 0x60a5fa;
    for (let i = 0; i < 3; i++) {
      const line = mesh(box(0.8 + Math.random() * 0.4, 0.08, 0.02), scanColor, scanColor);
      line.position.set(pos.x, 1.5 - i * 0.25, pos.z + 0.24);
      group.add(line);
    }
  });

  // AI bot figure (cute)
  const botBody = mesh(box(1, 1.2, 0.8), 0x60a5fa);
  botBody.position.set(-3.5, 0.6, -2.5);
  group.add(botBody);
  const botHead = mesh(box(0.8, 0.7, 0.7), 0x93c5fd);
  botHead.position.set(-3.5, 1.55, -2.5);
  group.add(botHead);
  // Cute eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const eyeGeo = box(0.15, 0.18, 0.06);
  const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
  eye1.position.set(-3.7, 1.6, -2.14);
  group.add(eye1);
  const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
  eye2.position.set(-3.3, 1.6, -2.14);
  group.add(eye2);
  // Antenna on bot
  const botAntenna = mesh(box(0.06, 0.5, 0.06), 0xd4d4d8);
  botAntenna.position.set(-3.5, 2.15, -2.5);
  group.add(botAntenna);
  const botLight = mesh(box(0.2, 0.2, 0.2), 0x4ade80, 0x4ade80);
  botLight.position.set(-3.5, 2.5, -2.5);
  botLight.userData.blink = true;
  group.add(botLight);

  // IoT device cluster
  [0, 1.2, 2.4].forEach((offset) => {
    const iot = mesh(box(0.7, 0.35, 0.7), 0x4ade80);
    iot.position.set(3 + offset * 0.3, 0.18, -2.5 - offset * 0.2);
    group.add(iot);
    const iotLed = mesh(box(0.12, 0.12, 0.06), 0xfbbf24, 0xfbbf24);
    iotLed.position.set(3 + offset * 0.3, 0.4, -2.15 - offset * 0.2);
    iotLed.userData.blink = true;
    group.add(iotLed);
  });
}

function buildChildhood(group, colors) {
  // Cute little house
  const house = mesh(box(3, 2.5, 3), colors.primary);
  house.position.y = 1.25;
  group.add(house);

  // Roof
  const roof = mesh(box(3.8, 0.4, 3.8), colors.secondary);
  roof.position.y = 2.7;
  group.add(roof);
  const roofTop = mesh(box(2.5, 0.4, 2.5), colors.accent);
  roofTop.position.y = 3.1;
  group.add(roofTop);
  const chimney = mesh(box(0.5, 1.2, 0.5), 0xd4d4d8);
  chimney.position.set(1, 3.8, 0.5);
  group.add(chimney);

  // Door
  const door = mesh(box(0.8, 1.5, 0.1), 0x8B6914);
  door.position.set(0, 0.75, 1.55);
  group.add(door);

  // Windows with glow
  [[-0.9, 1.5], [0.9, 1.5]].forEach(([x, y]) => {
    const win = mesh(box(0.6, 0.6, 0.08), 0xfde68a, 0x332200);
    win.position.set(x, y, 1.55);
    group.add(win);
  });

  // Toy blocks scattered around
  const toyColors = [0xef4444, 0x3b82f6, 0xfbbf24, 0x22c55e, 0xa78bfa];
  [{ x: -3, z: 2 }, { x: 3.5, z: 1 }, { x: -2, z: -3 }, { x: 2, z: -2.5 }].forEach((pos, i) => {
    const toy = mesh(box(0.5 + Math.random() * 0.3, 0.5 + Math.random() * 0.3, 0.5 + Math.random() * 0.3), toyColors[i % toyColors.length]);
    toy.position.set(pos.x, 0.3, pos.z);
    toy.rotation.y = Math.random() * Math.PI;
    group.add(toy);
  });

  // Swing set
  const swingPole1 = mesh(box(0.12, 2.5, 0.12), 0xd4d4d8);
  swingPole1.position.set(-3.5, 1.25, -1);
  group.add(swingPole1);
  const swingPole2 = mesh(box(0.12, 2.5, 0.12), 0xd4d4d8);
  swingPole2.position.set(-3.5, 1.25, 1);
  group.add(swingPole2);
  const swingBar = mesh(box(0.1, 0.1, 2.2), 0xd4d4d8);
  swingBar.position.set(-3.5, 2.5, 0);
  group.add(swingBar);
  const swingSeat = mesh(box(0.5, 0.08, 0.3), 0x8B6914);
  swingSeat.position.set(-3.5, 1, 0);
  swingSeat.userData.wave = true;
  group.add(swingSeat);

  // Tree
  const trunk = mesh(box(0.5, 2, 0.5), 0x8B6914);
  trunk.position.set(4, 1, -2);
  group.add(trunk);
  [0, 0.7, 1.4].forEach((yOff, idx) => {
    const size = 2 - idx * 0.5;
    const leaf = mesh(box(size, 0.7, size), 0x22c55e);
    leaf.position.set(4, 2.3 + yOff, -2);
    leaf.rotation.y = idx * 0.4;
    group.add(leaf);
  });
}

function buildFuture(group, colors) {
  // Glowing portal / gateway
  const portalBase = mesh(box(4, 0.3, 4), colors.secondary);
  portalBase.position.y = 0.15;
  group.add(portalBase);

  // Portal pillars
  [-1.8, 1.8].forEach((x) => {
    const pillar = mesh(box(0.6, 5, 0.6), colors.primary);
    pillar.position.set(x, 2.5, 0);
    group.add(pillar);
  });

  // Portal arch
  const arch = mesh(box(4.2, 0.6, 0.6), colors.accent, colors.primary);
  arch.position.set(0, 5.3, 0);
  group.add(arch);

  // Glowing center (the future)
  const glow1 = mesh(box(2.8, 4, 0.15), 0x38bdf8, 0x38bdf8);
  glow1.position.set(0, 2.8, 0);
  glow1.material.transparent = true;
  glow1.material.opacity = 0.3;
  glow1.userData.blink = true;
  group.add(glow1);

  const glow2 = mesh(box(2, 3, 0.1), 0x7dd3fc, 0x7dd3fc);
  glow2.position.set(0, 2.8, 0);
  glow2.material.transparent = true;
  glow2.material.opacity = 0.5;
  group.add(glow2);

  // Question mark made of blocks
  const qColor = 0xfbbf24;
  // Top dot
  const dot = mesh(box(0.5, 0.5, 0.3), qColor, qColor);
  dot.position.set(0, 1, 0.2);
  group.add(dot);
  // Curve
  const q1 = mesh(box(0.5, 0.5, 0.3), qColor, qColor);
  q1.position.set(0, 2, 0.2);
  group.add(q1);
  const q2 = mesh(box(0.5, 0.5, 0.3), qColor, qColor);
  q2.position.set(0.4, 2.6, 0.2);
  group.add(q2);
  const q3 = mesh(box(1.2, 0.5, 0.3), qColor, qColor);
  q3.position.set(0, 3.4, 0.2);
  group.add(q3);
  const q4 = mesh(box(0.5, 0.5, 0.3), qColor, qColor);
  q4.position.set(-0.5, 2.8, 0.2);
  group.add(q4);

  // Floating stars around portal
  [
    { x: -3, y: 3, z: 2 },
    { x: 3.5, y: 4, z: -1 },
    { x: -2, y: 5, z: -2.5 },
    { x: 2, y: 2, z: 3 },
  ].forEach((pos) => {
    const star = mesh(box(0.35, 0.35, 0.35), 0xfbbf24, 0xfbbf24);
    star.position.set(pos.x, pos.y, pos.z);
    star.rotation.set(Math.PI / 4, Math.PI / 4, 0);
    star.userData.spin = true;
    group.add(star);
  });
}

const builders = [buildChildhood, buildBinus, buildBCA, buildEY, buildBlibli, buildGSPE, buildFuture];

export function buildZones(scene) {
  const zoneGroups = [];

  ZONES.forEach((zone, i) => {
    const group = new THREE.Group();
    group.position.set(zone.position.x, 0, zone.position.z);
    builders[i](group, zone.colors);
    scene.add(group);
    zoneGroups.push(group);
  });

  return zoneGroups;
}
