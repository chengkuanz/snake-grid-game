const GRID_SIZE = 20;
const INITIAL_TICK_MS = 140;

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function placeFood(snake, grid, rng = Math.random) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const freeCells = [];

  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) freeCells.push({ x, y });
    }
  }

  if (freeCells.length === 0) return { x: -1, y: -1 };
  return freeCells[Math.floor(rng() * freeCells.length)];
}

function createInitialState(grid = GRID_SIZE, rng = Math.random) {
  const center = Math.floor(grid / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    grid,
    snake,
    direction: 'right',
    pendingDirection: 'right',
    food: placeFood(snake, grid, rng),
    score: 0,
    gameOver: false,
    paused: false,
  };
}

function setDirection(state, nextDir) {
  if (!DIRS[nextDir] || state.gameOver) return state;
  if (OPPOSITE[state.direction] === nextDir) return state;
  return { ...state, pendingDirection: nextDir };
}

function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

function hitsWall(cell, grid) {
  return cell.x < 0 || cell.y < 0 || cell.x >= grid || cell.y >= grid;
}

function hitsSelf(head, snake) {
  return snake.some((part) => part.x === head.x && part.y === head.y);
}

function tick(state, rng = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.pendingDirection;
  const delta = DIRS[direction];
  const head = state.snake[0];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };

  if (hitsWall(nextHead, state.grid) || hitsSelf(nextHead, state.snake)) {
    return { ...state, direction, gameOver: true };
  }

  const ate = nextHead.x === state.food.x && nextHead.y === state.food.y;
  const grownSnake = [nextHead, ...state.snake];
  const nextSnake = ate ? grownSnake : grownSnake.slice(0, -1);

  return {
    ...state,
    direction,
    snake: nextSnake,
    score: ate ? state.score + 1 : state.score,
    food: ate ? placeFood(nextSnake, state.grid, rng) : state.food,
  };
}

const board = document.getElementById('board');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const scoreLabelEl = document.getElementById('score-label');
const stateLabelEl = document.getElementById('state-label');
const helpTextEl = document.getElementById('help-text');
const languageLabelEl = document.getElementById('language-label');
const languageSelectEl = document.getElementById('language-select');
const dirUpEl = document.getElementById('dir-up');
const dirLeftEl = document.getElementById('dir-left');
const dirDownEl = document.getElementById('dir-down');
const dirRightEl = document.getElementById('dir-right');
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');
const touchButtons = document.querySelectorAll('[data-dir]');

const ctx = board.getContext('2d');
const cellSize = board.width / GRID_SIZE;

let state = createInitialState();
let language = 'en';

const I18N = {
  en: {
    pageTitle: 'Snake',
    languageLabel: 'Language',
    scoreLabel: 'Score',
    stateLabel: 'State',
    statusRunning: 'Running',
    statusPaused: 'Paused',
    statusGameOver: 'Game Over',
    restart: 'Restart',
    pause: 'Pause',
    resume: 'Resume',
    up: 'Up',
    left: 'Left',
    down: 'Down',
    right: 'Right',
    help: 'Use Arrow keys or WASD to move.',
    boardAria: 'Snake game board',
    hudAria: 'Game status',
    controlsAria: 'Controls',
    touchAria: 'On-screen controls',
    languageAria: 'Language selector',
  },
  fr: {
    pageTitle: 'Serpent',
    languageLabel: 'Langue',
    scoreLabel: 'Score',
    stateLabel: 'Etat',
    statusRunning: 'En cours',
    statusPaused: 'En pause',
    statusGameOver: 'Termine',
    restart: 'Recommencer',
    pause: 'Pause',
    resume: 'Reprendre',
    up: 'Haut',
    left: 'Gauche',
    down: 'Bas',
    right: 'Droite',
    help: 'Utilisez les fleches ou WASD pour vous deplacer.',
    boardAria: 'Plateau du jeu Serpent',
    hudAria: 'Etat du jeu',
    controlsAria: 'Commandes',
    touchAria: 'Commandes a l ecran',
    languageAria: 'Selecteur de langue',
  },
};

function t(key) {
  return I18N[language][key];
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.title = t('pageTitle');
  languageLabelEl.textContent = t('languageLabel');
  scoreLabelEl.textContent = t('scoreLabel');
  stateLabelEl.textContent = t('stateLabel');
  restartBtn.textContent = t('restart');
  dirUpEl.textContent = t('up');
  dirLeftEl.textContent = t('left');
  dirDownEl.textContent = t('down');
  dirRightEl.textContent = t('right');
  helpTextEl.textContent = t('help');

  board.setAttribute('aria-label', t('boardAria'));
  document.querySelector('.hud').setAttribute('aria-label', t('hudAria'));
  document.querySelector('.controls').setAttribute('aria-label', t('controlsAria'));
  document.querySelector('.touch').setAttribute('aria-label', t('touchAria'));
  document.querySelector('.language').setAttribute('aria-label', t('languageAria'));
}

function render() {
  drawGrid();
  drawFood();
  drawSnake();

  scoreEl.textContent = String(state.score);
  statusEl.textContent = state.gameOver
    ? t('statusGameOver')
    : state.paused
      ? t('statusPaused')
      : t('statusRunning');
  pauseBtn.textContent = state.paused ? t('resume') : t('pause');
}

function drawGrid() {
  ctx.clearRect(0, 0, board.width, board.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, board.width, board.height);

  ctx.strokeStyle = '#e4e4e4';
  ctx.lineWidth = 1;
  for (let i = 0; i <= GRID_SIZE; i += 1) {
    const p = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, board.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(board.width, p);
    ctx.stroke();
  }
}

function drawSnake() {
  ctx.fillStyle = '#2f7a34';
  for (const part of state.snake) {
    ctx.fillRect(part.x * cellSize + 1, part.y * cellSize + 1, cellSize - 2, cellSize - 2);
  }
}

function drawFood() {
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(state.food.x * cellSize + 1, state.food.y * cellSize + 1, cellSize - 2, cellSize - 2);
}

function onDirection(dir) {
  state = setDirection(state, dir);
  render();
}

const keyToDir = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  a: 'left',
  A: 'left',
  s: 'down',
  S: 'down',
  d: 'right',
  D: 'right',
};

document.addEventListener('keydown', (event) => {
  const dir = keyToDir[event.key];
  if (dir) {
    event.preventDefault();
    onDirection(dir);
  }

  if (event.key === ' ') {
    event.preventDefault();
    state = togglePause(state);
    render();
  }
});

touchButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    onDirection(btn.dataset.dir);
  });
});

restartBtn.addEventListener('click', () => {
  state = createInitialState();
  render();
});

pauseBtn.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

languageSelectEl.addEventListener('change', () => {
  language = languageSelectEl.value;
  applyTranslations();
  render();
});

setInterval(() => {
  state = tick(state);
  render();
}, INITIAL_TICK_MS);

applyTranslations();
render();
