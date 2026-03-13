import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, setDirection, tick, placeFood } from './snake-logic.js';

// Fixed RNG output keeps spawning and movement-dependent assertions deterministic.
function fakeRng(value) {
  return () => value;
}

test('snake moves one step in current direction', () => {
  const state = createInitialState(10, fakeRng(0));
  const next = tick(state, fakeRng(0));

  assert.deepEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
  assert.equal(next.score, 0);
});

test('snake grows and score increments after eating food', () => {
  let state = createInitialState(10, fakeRng(0));
  state = { ...state, food: { x: state.snake[0].x + 1, y: state.snake[0].y } };

  const next = tick(state, fakeRng(0));

  assert.equal(next.snake.length, state.snake.length + 1);
  assert.equal(next.score, 1);
});

test('collision with wall ends game', () => {
  let state = createInitialState(5, fakeRng(0));
  state = { ...state, snake: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }], direction: 'right', pendingDirection: 'right' };

  const next = tick(state, fakeRng(0));

  assert.equal(next.gameOver, true);
});

test('cannot reverse direction directly', () => {
  const state = createInitialState(10, fakeRng(0));
  const next = setDirection(state, 'left');

  assert.equal(next.pendingDirection, 'right');
});

test('food placement avoids snake body', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const food = placeFood(snake, 3, fakeRng(0));

  assert.notDeepEqual(food, { x: 0, y: 0 });
  assert.notDeepEqual(food, { x: 1, y: 0 });
  assert.notDeepEqual(food, { x: 2, y: 0 });
});
