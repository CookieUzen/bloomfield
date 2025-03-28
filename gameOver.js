import Crop from './crops.js'

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super({
            key : 'GameOverScene'
        })
    }

    preload() {

    }

    create() {

		// Kill the other scenes so we can have a clean slate
		this.scene.stop('FieldScene');
		this.scene.stop('InputScene');

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        const startButton = this.add.text(0, 0, `Game Over!`)
        startButton.setStyle({fontSize: 100})
        // Position in center of the screen by offsetting center coords by half the text size
        startButton.setPosition(width/2 - startButton.width/2, height/2 - startButton.height/2 - 100)
		startButton.setInteractive()
		.on('pointerdown', () => {this.scene.start('StartScene')})
		.on('pointerover', () => {startButton.setStyle({fill: '#ff0'})})
		.on('pointerout', () => {startButton.setStyle({fill: '#fff'})})

		// last round score
		this.add.text(50, 50, `You harvested ${this.registry.get("roundFoodUnits")} food units this round!`, {fontSize: 30, color: '#fff'})
		this.add.text(50, 100, `You needed ${this.registry.get("goal")} food units to win.`, {fontSize: 30, color: '#fff'})

		// total score50
		this.add.text(50, 150, `You harvested a total of ${this.registry.get("totalFoodUnits")} food units!`, {fontSize: 30, color: '#fff'})
    }

    update() {

    }
}
