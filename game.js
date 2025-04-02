import Phaser from 'phaser';

import StartScene from './startScene.js';   // Title screen
import InputScene from './input.js';        // Input handler
import FieldScene from './fieldScene.js';     // Main game scene
import RoundEndScene from './roundEnd.js';
import GameOverScene from "./gameOver.js";


const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: { default: 'arcade', arcade: { debug: false } },
    pixelArt: true,

    // Store all the available scenes here
    scene: [StartScene, InputScene, FieldScene, RoundEndScene, GameOverScene]  // Load StartScene first!!!
};

const game = new Phaser.Game(config);
