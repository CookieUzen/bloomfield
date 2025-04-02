# Bloomfield

Source code for the Bloomfield game:

You can find the game online here [here](https://cookieuzen.github.io/bloomfield/).

## Dev Guide

Using Phaser game library. Library pulled via node. Code compiled by webpack.
```bash
npm install
npm run build   # compile the code via webpack
npm run dev     # run the web server
```

**Remember to recompile the code with webpack when developing:** `npm run build`

### Files

- `README.md`: this doc
- `public`: assets folder
- `index.html`: html page which attaches the game
- `game.js`: configuration for the game (add scenes here)
- Scenes:
    * `fieldScene.js`: main game scene class
    * `startScene.js`: title page scene, entrypoint of phaser
    * `input.js`: UI/keymap scene
    * `roundEnd.js`: round end scene
    * `gameOver.js`: game over scene
- Game objects/Sprites:
    * `tiles.js`: object class for tiles
    * `crops.js`: object class for crops
    * `crops.json`: stores data about crops
    * `alertIcon.js`: object class for water warning etc
    * `newToolbar.js`: toolbar object
- `package.json`: config for `npm`
- `webpack.config.js`: config for webpack
