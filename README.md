# snake-grid-game

Classic browser-based Snake game built with vanilla JavaScript featuring grid movement, food spawning, score tracking, collision game-over, and restart/pause controls.

Built with assistance from Codex Assistant.

## Demo

Open `index.html` in any modern browser.

## How to Play

Guide the snake to eat food and grow as long as possible.
Avoid hitting the walls or your own body.

## Controls

- Move: Arrow keys or `W A S D`
- Pause/Resume: `Space` or **Pause** button
- Restart: **Restart** button
- Mobile/small screens: on-screen direction buttons

## Project Structure

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

## Test (optional)

If Node.js is installed:

```bash
node --test snake-logic.test.js
```

## License

MIT
