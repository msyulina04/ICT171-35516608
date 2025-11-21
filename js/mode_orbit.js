// js/mode_orbit.js
// Orbits mode: celestial bodies simulation
export let engine, world, render;
let rootCanvas;
let bodies = [];

export function start(canvas) {
  rootCanvas = canvas;
  ensureCanvasSize();
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 0;
  render = Matter.Render.create({
    canvas: rootCanvas,
    engine: engine,
    options: {
      wireframes: false,
      background: "#070707",
      width: rootCanvas.width,
      height: rootCanvas.height,
      pixelRatio: window.devicePixelRatio || 1
    }
  });
  Matter.Render.run(render);
  Matter.Engine.run(engine);
  // Добавим 4 свободных шарика с случайной скоростью
  for (let i=0; i<4; i++) {
    const x = 200 + Math.random() * (rootCanvas.width - 400);
    const y = 200 + Math.random() * (rootCanvas.height - 400);
    const planet = Matter.Bodies.circle(x, y, 18+i*4, {render:{fillStyle:'#0af'}});
    Matter.Body.setVelocity(planet, {
      x: (Math.random()-0.5)*8,
      y: (Math.random()-0.5)*8
    });
    bodies.push(planet);
    Matter.World.add(world, planet);
  }
  // Добавляем одну планету при запуске
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

export function addBall() {
  // Добавить свободный шарик с случайной скоростью
  let x = rootCanvas.width/2, y = rootCanvas.height/2;
  if (arguments.length === 2) {
    x = arguments[0];
    y = arguments[1];
  }
  const planet = Matter.Bodies.circle(x, y, 16+Math.random()*8, {render:{fillStyle:'#0af'}});
  Matter.Body.setVelocity(planet, {
    x: (Math.random()-0.5)*8,
    y: (Math.random()-0.5)*8
  });
  bodies.push(planet);
  Matter.World.add(world, planet);
}

export function clearBalls() {
  bodies.forEach(b => { if (!b.isStatic) Matter.World.remove(world, b); });
  bodies = bodies.filter(b => b.isStatic);
}

export function setGravity(v) {
  // Отключить гравитацию
}

export function setBounce(v) {
  bodies.forEach(b => { if (!b.isStatic) b.restitution = v; });
}

export function stop() {
  Matter.Render.stop(render);
  Matter.Engine.clear(engine);
  Matter.World.clear(world, false);
  bodies = [];
}
