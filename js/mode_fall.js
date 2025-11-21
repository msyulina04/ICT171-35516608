// js/mode_fall.js
// Falling balls mode using Matter.js
export let engine, world, render;
let rootCanvas;
let balls = [];
let ballTimeouts = [];
let defaultBounce = 0.8;

export function start(canvas) {
  rootCanvas = canvas;
  ensureCanvasSize();
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 1.0;
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
  // Boundaries (видимые, точно по краям canvas)
  const borderColor = '#fff';
  const wallThickness = 10;
  const CANVAS_W = 1200;
  const CANVAS_H = 800;
  // Все стены строго по краям
  const floor = Matter.Bodies.rectangle(
    CANVAS_W/2,
    CANVAS_H - wallThickness/2,
    CANVAS_W,
    wallThickness,
    {
      isStatic:true,
      render:{fillStyle: borderColor}
    }
  );
  const ceiling = Matter.Bodies.rectangle(
    CANVAS_W/2,
    wallThickness/2,
    CANVAS_W,
    wallThickness,
    {
      isStatic:true,
      render:{fillStyle: borderColor}
    }
  );
  const wallL = Matter.Bodies.rectangle(
    wallThickness/2,
    CANVAS_H/2,
    wallThickness,
    CANVAS_H,
    {
      isStatic:true,
      render:{fillStyle: borderColor}
    }
  );
  const wallR = Matter.Bodies.rectangle(
    CANVAS_W - wallThickness/2,
    CANVAS_H/2,
    wallThickness,
    CANVAS_H,
    {
      isStatic:true,
      render:{fillStyle: borderColor}
    }
  );
  Matter.World.add(world, [floor, wallL, wallR, ceiling]);
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

export function addBall() {
  let x = rootCanvas.width/2, y = 30;
  let radius = Math.random() * 18 + 12;
  if (arguments.length === 2) {
    x = arguments[0];
    y = arguments[1];
  }
  // Запретить появление вне поля
  if (x < radius || y < radius || x > 1200 - radius || y > 800 - radius) return;
  // Случайный цвет
  const colors = ['#0af', '#fa0', '#0fa', '#af0', '#f0a', '#a0f', '#ff0', '#0ff', '#f00', '#00f', '#0a0', '#aaa'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const ball = Matter.Bodies.circle(x, y, radius, {
    restitution: defaultBounce,
    friction: 0.02,
    density: 0.001,
    render: {fillStyle: color}
  });
  balls.push(ball);
  Matter.World.add(world, ball);
  // Таймер исчезновения
  const timeoutId = setTimeout(() => {
    removeBall(ball);
  }, 30000);
  ballTimeouts.push({body: ball, timeoutId});
}

export function clearBalls() {
  balls.forEach(b => Matter.World.remove(world, b));
  balls = [];
  ballTimeouts.forEach(obj => clearTimeout(obj.timeoutId));
  ballTimeouts = [];
}

export function setGravity(v) {
  if (world) world.gravity.y = v;
}

export function setBounce(v) {
  defaultBounce = v;
  balls.forEach(b => b.restitution = v);
}

export function stop() {
  Matter.Render.stop(render);
  Matter.Engine.clear(engine);
  Matter.World.clear(world, false);
  balls = [];
  ballTimeouts.forEach(obj => clearTimeout(obj.timeoutId));
  ballTimeouts = [];
// --- Простое удаление шарика ---
function removeBall(ball) {
  Matter.World.remove(world, ball);
  balls = balls.filter(b => b !== ball);
  ballTimeouts = ballTimeouts.filter(obj => obj.body !== ball);
}
}
