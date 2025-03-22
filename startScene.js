import { UITextButton, UIImageButton } from "./UIButton.js";
import Tiles from "./tiles.js";

// This is the start scene. It will be the first scene to load and will handle the loading of the other scenes.
// This is also the Title Screen of the game.
export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {

    }

    create() {
        // TODO: Load background and add start button
        console.log("Start Scene triggered");

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        const startButton = this.add.text(0, 0, "Start game!")
        startButton.setStyle({fontSize: 100})
        // Position in center of the screen by offsetting center coords by half the text size
        startButton.setPosition(width/2 - startButton.width/2, height/2 - startButton.height/2)
        startButton.setInteractive()
        .on('pointerdown', () => {this.scene.start('FieldScene')})
        .on('pointerover', () => {startButton.setStyle({fill: '#ff0'})})
        .on('pointerout', () => {startButton.setStyle({fill: '#fff'})})

    }

    update() {

    }
}
