// js/mode_web.js
// Пружинная паутина: шарики соединяются пружинами
export let engine, world, render;
let rootCanvas;
let balls = [];
let springs = [];
let defaultBounce = 0.8;

export function start(canvas) {
  rootCanvas = canvas;
  // Фиксированный размер поля
  rootCanvas.width = 1200;
  rootCanvas.height = 800;
  engine = Matter.Engine.create();
  world = engine.world;
  world.gravity.y = 0.5;
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
  // Границы
  const borderColor = '#fff';
  const wallThickness = 10;
  const CANVAS_W = 1200;
  const CANVAS_H = 800;
  const floor = Matter.Bodies.rectangle(CANVAS_W/2, CANVAS_H-wallThickness/2, CANVAS_W, wallThickness, {isStatic:true, render:{fillStyle: borderColor}});
  const ceiling = Matter.Bodies.rectangle(CANVAS_W/2, wallThickness/2, CANVAS_W, wallThickness, {isStatic:true, render:{fillStyle: borderColor}});
  const wallL = Matter.Bodies.rectangle(wallThickness/2, CANVAS_H/2, wallThickness, CANVAS_H, {isStatic:true, render:{fillStyle: borderColor}});
  const wallR = Matter.Bodies.rectangle(CANVAS_W-wallThickness/2, CANVAS_H/2, wallThickness, CANVAS_H, {isStatic:true, render:{fillStyle: borderColor}});
  Matter.World.add(world, [floor, wallL, wallR, ceiling]);
  // Добавим стартовый шарик
  addBall(CANVAS_W/2, CANVAS_H/2);
  // Добавить мышиное управление для перетаскивания шариков
  const mouse = Matter.Mouse.create(rootCanvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {visible: false}
    }
  });
  Matter.World.add(world, mouseConstraint);
}

export function addBall(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    x = rootCanvas.width/2;
    y = rootCanvas.height/2;
  }
  const radius = Math.random() * 18 + 12;
  // Запретить появление вне поля
  if (x < radius || y < radius || x > rootCanvas.width - radius || y > rootCanvas.height - radius) return;
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
  // Соединить с ближайшими 3 шариками пружинами
  let nearest = balls.filter(b => b !== ball)
    .map(b => ({b, dist: Math.hypot(b.position.x-x, b.position.y-y)}))
    .sort((a,b) => a.dist-b.dist)
    .slice(0,3);
  nearest.forEach(({b}) => {
    const spring = Matter.Constraint.create({
      bodyA: ball,
      bodyB: b,
      length: Math.hypot(b.position.x-x, b.position.y-y),
      stiffness: 0.03,
      render: {strokeStyle:'#fff'}
    });
    springs.push(spring);
    Matter.World.add(world, spring);
  });
}

export function clearBalls() {
  balls.forEach(b => Matter.World.remove(world, b));
  balls = [];
  springs.forEach(s => Matter.World.remove(world, s));
  springs = [];
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
  springs = [];
}
