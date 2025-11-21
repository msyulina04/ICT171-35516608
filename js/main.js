// js/main.js
// Entry point for Ball Physics Simulator

const canvas = document.getElementById("simCanvas");
const buttons = document.querySelectorAll(".mode-btn");
const addBallBtn = document.getElementById("add-ball");
const clearBallsBtn = document.getElementById("clear-balls");
const gravitySlider = document.getElementById("gravity-slider");
const bounceSlider = document.getElementById("bounce-slider");
const gravityValue = document.getElementById("gravity-value");
const bounceValue = document.getElementById("bounce-value");

let currentModule = null;
let currentMode = null;

// Для появления шариков по клику и удержанию
let mouseDown = false;
let mouseInterval = null;
let lastMousePos = {x: 0, y: 0};

function addBallAt(x, y) {
  // Проверяем, что координаты внутри canvas
  if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) return;
  if (currentModule && typeof currentModule.addBall === "function") {
    currentModule.addBall(x, y);
  }
}

canvas.addEventListener("mousedown", (e) => {
  mouseDown = true;
  updateMousePos(e);
  addBallAt(lastMousePos.x, lastMousePos.y);
  // Только для НЕ web режима — спавн при удержании
  if (currentMode !== "web") {
    mouseInterval = setInterval(() => {
      addBallAt(lastMousePos.x, lastMousePos.y);
    }, 200);
  } else {
    mouseInterval = null;
  }
});

canvas.addEventListener("mouseup", () => {
  mouseDown = false;
  if (mouseInterval) {
    clearInterval(mouseInterval);
    mouseInterval = null;
  }
});

canvas.addEventListener("mouseleave", () => {
  mouseDown = false;
  if (mouseInterval) {
    clearInterval(mouseInterval);
    mouseInterval = null;
  }
});

canvas.addEventListener("mousemove", (e) => {
  updateMousePos(e);
});

function updateMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  // Для фиксированного canvas 600x400
  lastMousePos.x = e.clientX - rect.left;
  lastMousePos.y = e.clientY - rect.top;
}

async function loadMode(modeName) {
  if (currentModule && typeof currentModule.stop === "function") {
    try { await currentModule.stop(); } catch (e) {}
  }
  try {
    const mod = await import(`./mode_${modeName}.js`);
    currentModule = mod;
  } catch (e) {
    currentModule = null;
    return;
  }
  if (typeof currentModule.start === "function") {
    currentModule.start(canvas);
  }
  currentMode = modeName;
  updateActiveButton();
  pushControlsToModule();
}

function updateActiveButton() {
  buttons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === currentMode);
  });
}

buttons.forEach(btn => btn.addEventListener("click", () => loadMode(btn.dataset.mode)));

addBallBtn.addEventListener("click", () => {
  if (currentModule && typeof currentModule.addBall === "function") {
    currentModule.addBall();
  }
});

clearBallsBtn.addEventListener("click", () => {
  if (currentModule && typeof currentModule.clearBalls === "function") {
    currentModule.clearBalls();
  }
});

gravitySlider.addEventListener("input", () => {
  const v = Number(gravitySlider.value);
  gravityValue.textContent = v.toFixed(2);
  if (currentModule && typeof currentModule.setGravity === "function") {
    currentModule.setGravity(v);
  }
});

bounceSlider.addEventListener("input", () => {
  const v = Number(bounceSlider.value);
  bounceValue.textContent = v.toFixed(2);
  if (currentModule && typeof currentModule.setBounce === "function") {
    currentModule.setBounce(v);
  }
});

function pushControlsToModule() {
  const g = Number(gravitySlider.value);
  const b = Number(bounceSlider.value);
  gravityValue.textContent = g.toFixed(2);
  bounceValue.textContent = b.toFixed(2);
  if (currentModule) {
    if (typeof currentModule.setGravity === "function") currentModule.setGravity(g);
    if (typeof currentModule.setBounce === "function") currentModule.setBounce(b);
  }
}

// --- Доработка: поддержка координат для addBall(x, y) ---

window.addEventListener("load", () => {
  resizeCanvasToDisplaySize();
  loadMode("fall");
});
window.addEventListener("resize", resizeCanvasToDisplaySize);

function resizeCanvasToDisplaySize() {
  // canvas всегда фиксированного размера
  canvas.width = 1200;
  canvas.height = 800;
}
