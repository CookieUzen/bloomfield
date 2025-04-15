import { FancyUITextButton } from './UIButton';

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super({
            key : 'GameOverScene'
        })
    }

    preload() {
        this.load.image('gameOverImage', "./public/assets/Fail.png")
    }

    create() {

		// Kill the other scenes so we can have a clean slate
		this.scene.stop('FieldScene');
		this.scene.stop('InputScene');

        // Get scene to place things in the middle
        let { width, height } = this.sys.game.canvas;

        const backgroundImage = this.add.image(width/2, height/2, 'gameOverImage')

        const startButton = new FancyUITextButton(this, width/2, 500, "Restart!", () => {this.scene.start('StartScene')})
        this.add.existing(startButton)

        // todo fix this
		// last round score
		this.add.text(50, 50, `You harvested ${this.registry.get("roundFoodUnits")} food units this round!`, {fontSize: 30, color: '#fff'})
		this.add.text(50, 100, `You needed ${this.registry.get("goal")} food units to win.`, {fontSize: 30, color: '#fff'})

		// total score50
		this.add.text(50, 150, `You harvested a total of ${this.registry.get("totalFoodUnits")} food units!`, {fontSize: 30, color: '#fff'})
    }

    update() {

    }
}
