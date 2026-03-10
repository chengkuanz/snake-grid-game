# Classic Snake

A minimal browser-based implementation of the classic Snake game.

Built with assistance from Codex Assistant.

## Features

- Fixed grid movement loop
- Snake growth when food is eaten
- Random food spawn on free cells only
- Score tracking
- Game over on wall or self collision
- Restart and pause/resume

## Controls

- Keyboard: Arrow keys or `W A S D`
- Pause/Resume: `Space` or **Pause** button
- Restart: **Restart** button
- Mobile/small screens: on-screen direction buttons

## Run

Open `index.html` in any modern browser.

## Files

- `index.html` - page structure
- `styles.css` - minimal styling
- `snake.js` - game logic + rendering + input handling
- `snake-logic.js` - deterministic core logic module
- `snake-logic.test.js` - core logic tests

## Manual Verification Checklist

- Snake is visible at start and moves automatically.
- Arrow keys and WASD both control direction.
- Direct reverse direction is ignored.
- Eating food increases score by 1 and grows snake length by 1.
- Food does not spawn on snake cells.
- Hitting a wall ends the game and status shows **Game Over**.
- Pause freezes movement; Resume continues from same state.
- Restart resets score, snake, food, and game-over state.

## Test (if Node.js is installed)

```bash
node --test snake-logic.test.js
```
