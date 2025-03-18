# Bloomfield

Source code for the Bloomfield game:

Use node to develop:

```bash
npm install
npm run dev
```

Using Phaser game library. Library pulled via node.

## Quick Dev Guide

- `README.md`: this doc
- `public`: assets folder
- `index.html`: html page which attaches the game
- `game.js`: configuration for the game (add scenes here)
- `mainScene.js`: main game scene class
- `startScene.js`: title page scene, entrypoint of phaser
- `input.js`: input (keyboard) handler scene
- `tiles.js`: object class for tiles
- `crops.js`: object class for crops
- `crops.json`: stores data about crops
- `package.json`: config for `npm`
