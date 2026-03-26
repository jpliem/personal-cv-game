import * as THREE from 'three';
import { ZONES } from './data.js';

function makeMesh(geo, color) {
  return new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color }));
}

function box(w, h, d) {
  return new THREE.BoxGeometry(w, h, d);
}

function buildBinus(group, colors) {
  // Tiered university hall
  const base = makeMesh(box(4, 2, 3), colors.primary);
  base.position.y = 1;
  group.add(base);

  const mid = makeMesh(box(3, 1.5, 2.5), colors.secondary);
  mid.position.y = 2.75;
  group.add(mid);

  const top = makeMesh(box(2, 1, 2), colors.accent);
  top.position.y = 4;
  group.add(top);

  // Flag pole
  const pole = makeMesh(box(0.1, 2, 0.1), 0x94a3b8);
  pole.position.set(0, 5.5, 0);
  group.add(pole);

  const flag = makeMesh(box(1, 0.6, 0.1), 0xfbbf24);
  flag.position.set(0.55, 6.2, 0);
  group.add(flag);

  // Trees
  [-3, 3].forEach((xOff) => {
    const trunk = makeMesh(box(0.3, 1, 0.3), 0xa3824a);
    trunk.position.set(xOff, 0.5, 2);
    group.add(trunk);

    const leaves = makeMesh(box(1.2, 1.2, 1.2), 0x22c55e);
    leaves.position.set(xOff, 1.6, 2);
    group.add(leaves);
  });

  // Book stacks
  [{ x: -2, z: -2 }, { x: 2.5, z: -1.5 }].forEach((pos) => {
    const b1 = makeMesh(box(0.8, 0.2, 0.6), 0xef4444);
    b1.position.set(pos.x, 0.1, pos.z);
    group.add(b1);
    const b2 = makeMesh(box(0.7, 0.2, 0.5), 0x3b82f6);
    b2.position.set(pos.x, 0.3, pos.z);
    group.add(b2);
  });
}

function buildBCA(group, colors) {
  // Monitor-shaped building
  const monitor = makeMesh(box(4, 3, 0.5), colors.accent);
  monitor.position.set(0, 1.5, 0);
  group.add(monitor);

  // Screen (lighter inset)
  const screen = makeMesh(box(3.4, 2.4, 0.1), 0x0f172a);
  screen.position.set(0, 1.7, 0.3);
  group.add(screen);

  // Code lines on screen
  const lineColors = [0x4ade80, 0x60a5fa, 0xfbbf24];
  lineColors.forEach((c, i) => {
    const line = makeMesh(box(1.5 + Math.random(), 0.15, 0.05), c);
    line.position.set(-0.3, 2.5 - i * 0.5, 0.38);
    group.add(line);
  });

  // Monitor stand
  const stand = makeMesh(box(0.5, 0.8, 0.5), 0x475569);
  stand.position.set(0, -0.1, 0);
  group.add(stand);

  const base = makeMesh(box(2, 0.2, 1), 0x475569);
  base.position.set(0, -0.4, 0);
  group.add(base);

  // Antenna
  const antenna = makeMesh(box(0.1, 1.5, 0.1), 0x94a3b8);
  antenna.position.set(1.5, 3.5, 0);
  group.add(antenna);

  const blink = makeMesh(box(0.3, 0.3, 0.3), 0xf472b6);
  blink.position.set(1.5, 4.4, 0);
  blink.userData.blink = true;
  group.add(blink);

  // Server racks
  [-2.5, 2.5].forEach((x) => {
    const rack = makeMesh(box(0.8, 2, 0.6), 0x334155);
    rack.position.set(x, 1, -1.5);
    group.add(rack);
    // Lights
    for (let i = 0; i < 3; i++) {
      const light = makeMesh(box(0.15, 0.1, 0.05), 0x4ade80);
      light.position.set(x - 0.2, 0.5 + i * 0.5, -1.18);
      group.add(light);
    }
  });
}

function buildEY(group, colors) {
  // Adventure tent
  const tentBase = makeMesh(box(4, 0.3, 3), 0xa3824a);
  tentBase.position.y = 0.15;
  group.add(tentBase);

  // Tent walls (A-frame)
  const leftWall = makeMesh(box(0.2, 3, 3), colors.primary);
  leftWall.position.set(-1.5, 1.5, 0);
  leftWall.rotation.z = 0.3;
  group.add(leftWall);

  const rightWall = makeMesh(box(0.2, 3, 3), colors.primary);
  rightWall.position.set(1.5, 1.5, 0);
  rightWall.rotation.z = -0.3;
  group.add(rightWall);

  const roofPeak = makeMesh(box(0.6, 0.4, 3.2), colors.accent);
  roofPeak.position.set(0, 3, 0);
  group.add(roofPeak);

  // Flag on top
  const flagPole = makeMesh(box(0.1, 2, 0.1), 0xef4444);
  flagPole.position.set(0, 4, 0);
  group.add(flagPole);
  const flag = makeMesh(box(1, 0.6, 0.1), 0xef4444);
  flag.position.set(0.55, 4.7, 0);
  group.add(flag);

  // Compass rose on ground
  const compass = makeMesh(box(1.5, 0.05, 1.5), colors.secondary);
  compass.position.set(3, 0.03, 2);
  group.add(compass);
  const needle = makeMesh(box(0.1, 0.3, 0.8), 0xef4444);
  needle.position.set(3, 0.2, 2);
  group.add(needle);

  // Quest board
  const boardPole = makeMesh(box(0.2, 2, 0.2), 0xa3824a);
  boardPole.position.set(-3, 1, 0);
  group.add(boardPole);
  const board = makeMesh(box(1.5, 1.2, 0.15), 0xa3824a);
  board.position.set(-3, 2.2, 0);
  group.add(board);
  // Paper notes
  const note1 = makeMesh(box(0.4, 0.5, 0.05), 0xfef3c7);
  note1.position.set(-3.2, 2.3, 0.1);
  group.add(note1);
  const note2 = makeMesh(box(0.4, 0.5, 0.05), 0xfef3c7);
  note2.position.set(-2.8, 2.1, 0.1);
  group.add(note2);
}

function buildBlibli(group, colors) {
  // Castle base
  const base = makeMesh(box(5, 2.5, 4), colors.primary);
  base.position.y = 1.25;
  group.add(base);

  // Battlements
  for (let i = -2; i <= 2; i += 1) {
    if (Math.abs(i) % 2 === 0) {
      const merlon = makeMesh(box(0.6, 0.8, 0.6), colors.secondary);
      merlon.position.set(i, 3, 2);
      group.add(merlon);
      const merlonBack = makeMesh(box(0.6, 0.8, 0.6), colors.secondary);
      merlonBack.position.set(i, 3, -2);
      group.add(merlonBack);
    }
  }

  // Shield emblem on front
  const shield = makeMesh(box(1, 1.2, 0.2), colors.accent);
  shield.position.set(0, 1.5, 2.1);
  group.add(shield);
  const shieldInner = makeMesh(box(0.5, 0.6, 0.1), 0xe2e8f0);
  shieldInner.position.set(0, 1.6, 2.25);
  group.add(shieldInner);

  // Watchtower
  const tower = makeMesh(box(1.2, 4, 1.2), colors.secondary);
  tower.position.set(2.5, 2, -1.5);
  group.add(tower);
  const towerTop = makeMesh(box(1.5, 0.3, 1.5), colors.accent);
  towerTop.position.set(2.5, 4.15, -1.5);
  group.add(towerTop);

  // Torches
  [-2.8, 2.8].forEach((x) => {
    const torchPole = makeMesh(box(0.15, 1.5, 0.15), 0xa3824a);
    torchPole.position.set(x, 0.75, 2.5);
    group.add(torchPole);
    const flame = makeMesh(box(0.3, 0.4, 0.3), 0xfbbf24);
    flame.position.set(x, 1.7, 2.5);
    flame.userData.flicker = true;
    group.add(flame);
  });
}

function buildGSPE(group, colors) {
  // Main tower
  const tower = makeMesh(box(3, 5, 3), colors.primary);
  tower.position.y = 2.5;
  group.add(tower);

  // Upper section
  const upper = makeMesh(box(2.5, 2, 2.5), colors.secondary);
  upper.position.y = 6;
  group.add(upper);

  // Satellite dish
  const dishBase = makeMesh(box(0.3, 1, 0.3), 0x94a3b8);
  dishBase.position.set(0, 7.5, 0);
  group.add(dishBase);
  const dish = makeMesh(box(2, 0.2, 2), colors.accent);
  dish.position.set(0, 8, 0);
  dish.rotation.x = 0.3;
  group.add(dish);
  const dishTip = makeMesh(box(0.2, 0.8, 0.2), 0xfbbf24);
  dishTip.position.set(0, 8.5, -0.3);
  group.add(dishTip);

  // Monitor screens at base
  [{ x: -2.5, z: 0 }, { x: 2.5, z: 0 }].forEach((pos) => {
    const screenFrame = makeMesh(box(1.5, 1.2, 0.3), 0x334155);
    screenFrame.position.set(pos.x, 1, pos.z);
    group.add(screenFrame);
    const screenFace = makeMesh(box(1.2, 0.9, 0.05), 0x0f172a);
    screenFace.position.set(pos.x, 1.05, pos.z + 0.18);
    group.add(screenFace);
    // Scan lines
    const scanLine = makeMesh(box(1, 0.08, 0.02), pos.x < 0 ? 0x4ade80 : 0x60a5fa);
    scanLine.position.set(pos.x, 1.1, pos.z + 0.22);
    group.add(scanLine);
  });

  // AI bot figure
  const botBody = makeMesh(box(0.8, 1, 0.6), 0x60a5fa);
  botBody.position.set(-3, 0.5, -2);
  group.add(botBody);
  const botHead = makeMesh(box(0.6, 0.5, 0.5), 0x93c5fd);
  botHead.position.set(-3, 1.25, -2);
  group.add(botHead);
  const botEye1 = makeMesh(box(0.12, 0.12, 0.05), 0x0f172a);
  botEye1.position.set(-3.15, 1.3, -1.72);
  group.add(botEye1);
  const botEye2 = makeMesh(box(0.12, 0.12, 0.05), 0x0f172a);
  botEye2.position.set(-2.85, 1.3, -1.72);
  group.add(botEye2);

  // IoT device
  const iot = makeMesh(box(0.6, 0.3, 0.6), 0x4ade80);
  iot.position.set(3, 0.15, -2);
  group.add(iot);
  const iotAntenna = makeMesh(box(0.08, 0.6, 0.08), 0x94a3b8);
  iotAntenna.position.set(3, 0.6, -2);
  group.add(iotAntenna);
}

const builders = [buildBinus, buildBCA, buildEY, buildBlibli, buildGSPE];

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
