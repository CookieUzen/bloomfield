import StartScene from './startScene.js';   // Title screen
import InputScene from './input.js';        // Input handler
import MainScene from './mainScene.js';     // Main game scene

const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    physics: { default: 'arcade', arcade: { debug: false } },
    // Store all the available scenes here
    scene: [StartScene, InputScene, MainScene]  // Load StartScene first!!!
};

const game = new Phaser.Game(config);
