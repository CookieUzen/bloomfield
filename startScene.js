// This is the start scene. It will be the first scene to load and will handle the loading of the other scenes.
// This is also the Title Screen of the game.
export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Load assets
    }

    create() {
        // TODO: Load background and add start button
        console.log("Start Scene triggered");

        // For now we just load the main scene and the input scene straightaway
        // Feel free to put this code in a button or something
        this.scene.launch('InputScene');
        this.scene.start('MainScene');  // stops the start scene
    }

    update() {

    }
}
