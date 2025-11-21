// js/mode_escape.js
// Balls escaping from a rotating ring with a hole
export let engine, world, render;
let rootCanvas;
let balls = [];
let ring, holeAngle = 0;
let ringRadius = 180;
let ringWidth = 4; // Толщина линии кольца
let numRings = 4; // Количество колец
let ringData = []; // [{radius, holeAngle, holeSize, rotateSpeed, direction}]
let holeSize = Math.PI/6;
let rotateSpeed = 0.02;
let ringBodies = [];

export function start(canvas) {
    ringData = [];
    // Настроить параметры для каждого кольца
    for (let i = 0; i < numRings; i++) {
      // Радиус: меньше, чтобы все кольца были внутри
      const base = Math.min(1200, 800);
      const radius = base * (0.18 + 0.09 * i);
      // Один проём в каждом кольце
      const holeSize = Math.PI / (8 + i*3);
      // Все кольца вращаются медленно
      const rotateSpeed = 0.008 / (1 + i*0.7);
      const direction = i % 2 === 0 ? 1 : -1;
      ringData.push({radius, holeAngle: Math.random()*Math.PI*2, holeSize, rotateSpeed, direction});
    }
  rootCanvas = canvas;
  // Фиксированный размер поля
  rootCanvas.width = 1200;
  rootCanvas.height = 800;
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 0.7;
  render = Matter.Render.create({
    canvas: rootCanvas,
    engine: engine,
    options: {
      wireframes: false,
      background: "#070707",
      width: 1200,
      height: 800,
      pixelRatio: 1
    }
  });
  Matter.Render.run(render);
  Matter.Engine.run(engine);
  createRing();
  Matter.Events.on(engine, 'beforeUpdate', rotateRing);
  // Добавляем один шарик при запуске
  addBall();
}

function ensureCanvasSize() {
  const dpr = window.devicePixelRatio || 1;
  const w = rootCanvas.clientWidth * dpr;
  const h = rootCanvas.clientHeight * dpr;
  if (rootCanvas.width !== w || rootCanvas.height !== h) {
    rootCanvas.width = w;
    rootCanvas.height = h;
  }
}

function createRing() {
  // Remove old ring bodies
  ringBodies.forEach(b => Matter.World.remove(world, b));
  ringBodies = [];
  // Несколько колец
  const cx = rootCanvas.width/2, cy = rootCanvas.height/2;
  const segments = 240;
  for (let rIdx = 0; rIdx < ringData.length; rIdx++) {
    const {radius, holeAngle, holeSize} = ringData[rIdx];
    const arcLength = 2 * Math.PI / segments;
    for (let i=0; i<segments; i++) {
      const angle = i*arcLength;
      // Один проём
      if (angle > holeAngle && angle < holeAngle+holeSize) continue;
      const x = cx + Math.cos(angle)*radius;
      const y = cy + Math.sin(angle)*radius;
      // Очень тонкий сегмент
      const seg = Matter.Bodies.rectangle(x, y, ringWidth, 8, {
        isStatic:true,
        angle: angle,
        render:{fillStyle:'#fff'}
      });
      // Исправить отскок: явно задать restitution
      Matter.Body.set(seg, { restitution: 0.9 });
      ringBodies.push(seg);
      Matter.World.add(world, seg);
    }
  }
}

function rotateRing() {
  // Вращать каждое кольцо
  for (let rIdx = 0; rIdx < ringData.length; rIdx++) {
    ringData[rIdx].holeAngle += ringData[rIdx].rotateSpeed * ringData[rIdx].direction;
    if (ringData[rIdx].holeAngle > Math.PI*2) ringData[rIdx].holeAngle -= Math.PI*2;
    if (ringData[rIdx].holeAngle < 0) ringData[rIdx].holeAngle += Math.PI*2;
  }
  createRing();
}

export function addBall() {
  let x = rootCanvas.width/2, y = rootCanvas.height/2;
  if (arguments.length === 2) {
    x = arguments[0];
    y = arguments[1];
  }
  const ball = Matter.Bodies.circle(x, y, 14+Math.random()*8, {
    restitution: 0.7,
    friction: 0.02,
    density: 0.001
  });
  balls.push(ball);
  Matter.World.add(world, ball);
}

export function clearBalls() {
  balls.forEach(b => Matter.World.remove(world, b));
  balls = [];
}

export function setGravity(v) {
  if (world) world.gravity.y = v;
}

export function setBounce(v) {
  balls.forEach(b => b.restitution = v);
}

export function stop() {
  Matter.Render.stop(render);
  Matter.Engine.clear(engine);
  Matter.World.clear(world, false);
  balls = [];
  ringBodies.forEach(b => Matter.World.remove(world, b));
  ringBodies = [];
}
