export const GRID_SIZE = 20;
export const INITIAL_TICK_MS = 140;

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

export function createInitialState(grid = GRID_SIZE, rng = Math.random) {
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

export function setDirection(state, nextDir) {
  if (!DIRS[nextDir] || state.gameOver) return state;
  if (OPPOSITE[state.direction] === nextDir) return state;
  return { ...state, pendingDirection: nextDir };
}

export function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}

export function tick(state, rng = Math.random) {
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

function hitsWall(cell, grid) {
  return cell.x < 0 || cell.y < 0 || cell.x >= grid || cell.y >= grid;
}

function hitsSelf(head, snake) {
  return snake.some((part) => part.x === head.x && part.y === head.y);
}

export function placeFood(snake, grid, rng = Math.random) {
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
  const freeCells = [];

  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) freeCells.push({ x, y });
    }
  }

  if (freeCells.length === 0) {
    return { x: -1, y: -1 };
  }

  const idx = Math.floor(rng() * freeCells.length);
  return freeCells[idx];
}
