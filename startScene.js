import { UITextButton, UIImageButton } from "./UIButton.js";
import Tiles from "./tiles.js";

// This is the start scene. It will be the first scene to load and will handle the loading of the other scenes.
// This is also the Title Screen of the game.
export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load assets
        this.load.image('soybean_seed', "./public/assets/soybean/Soybean_seeds.png");
    }

    create() {
        // TODO: Load background and add start button
        console.log("Start Scene triggered");

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        // todo: add a button that loads the next scene
        // For now we just load the main scene and the input scene straightaway
        // Feel free to put this code in a button or something

        const startButton = this.add.text(0, 0, "Start game!")
        startButton.setStyle({fontSize: 100})
        // Position in center of the screen by offsetting center coords by half the text size
        startButton.setPosition(width/2 - startButton.width/2, height/2 - startButton.height/2)
        startButton.setInteractive()
        .on('pointerdown', () => {this.scene.start('MainScene')})
        .on('pointerover', () => {startButton.setStyle({fill: '#ff0'})})
        .on('pointerout', () => {startButton.setStyle({fill: '#fff'})})

        // const testButton = new UITextButton(this, width/2, height/2 + 100, "some message")
        // this.add.existing(testButton)

        // const testButton2 = new UIImageButton(this, width/2, height/2 + 200, "soybean_seed")
        // this.add.existing(testButton2)

        // const testGraphic = this.add.graphics()


        // testGraphic.fillStyle(0xFFFFFF, 1.0);

        // testGraphic.fillRect(50, 50, 400, 200);

        // testGraphic.strokeRect(50, 50, 400, 200);

        // this.scene.start('MainScene');  // stops the start scene
    }

    update() {

    }
}
