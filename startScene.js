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

        // Init some basic variables
        this.registry.set('money', 0);          // how much money the player has
        this.registry.set('harvest_bin', {});   // what crops and food units the player had harvested
        this.registry.set('round', 1);
        this.registry.set('roundTime', 120);    // how long each round lasts in seconds
        this.registry.set('goal', 1000);        // how much money the player needs to win
        this.registry.set('totalFoodUnits', 0); // how much food the player has harvested in total
        this.registry.set('roundFoodUnits', 0); // food harvested in the current round

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;
        
        const titleText = this.add.text(0, 0, "Bloomfield")
        titleText.setStyle({fontSize: 100, fill: '#fff'})
        // Position in center of the screen by offsetting center coords by half the text size
        titleText.setPosition(width/2 - titleText.width/2, height/2 - titleText.height/2 - 50)


        const startButton = this.add.text(0, 0, "Start game!")
        startButton.setStyle({fontSize: 60})
        // Position below the title text
        startButton.setPosition(width/2 - startButton.width/2, height/2 - startButton.height/2 + 70)
        startButton.setInteractive()
        .on('pointerdown', () => {this.scene.start('FieldScene')})
        .on('pointerover', () => {startButton.setStyle({fill: '#ff0'})})
        .on('pointerout', () => {startButton.setStyle({fill: '#fff'})})
    }

    update() {

    }
}
